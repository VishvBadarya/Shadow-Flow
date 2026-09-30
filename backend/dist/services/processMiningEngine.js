import { getDb } from '../db/connection.js';
import { PROCESS_MODELS_DATA } from '../db/processModelsData.js';
function calculatePercentile(values, percentile) {
    if (values.length === 0)
        return 0;
    const sorted = [...values].sort((a, b) => a - b);
    const index = (percentile / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index - lower;
    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}
export class ProcessMiningEngine {
    /**
     * Discovers the Directly-Follows Graph (DFG) from raw operational events.
     */
    async getProcessGraph(processModelId) {
        const db = getDb();
        const model = PROCESS_MODELS_DATA.find(p => p.id === processModelId);
        if (!model) {
            throw new Error(`Process model '${processModelId}' not found.`);
        }
        // Query events in chronological order per case
        const query = `
      SELECT case_id, activity_name, start_time, end_time, duration_seconds,
             role, department, channel, system_used, is_official_step, attributes
      FROM event_logs
      WHERE process_model_id = $1
      ORDER BY case_id, start_time ASC
    `;
        const res = await db.query(query, [processModelId]);
        const events = res.rows;
        if (events.length === 0) {
            return {
                process_model: model,
                summary: {
                    total_cases: 0,
                    total_events: 0,
                    unique_variants: 0,
                    conformance_score: 100,
                    median_cycle_time_min: 0,
                    p90_cycle_time_min: 0,
                    off_system_handoff_pct: 0
                },
                nodes: model.official_graph.nodes,
                edges: [],
                variants: [],
                conformance: {
                    conforming_cases: 0,
                    non_conforming_cases: 0,
                    skipped_steps: [],
                    unofficial_transitions: [],
                    off_system_events: []
                }
            };
        }
        // Group events by case
        const caseTraces = new Map();
        for (const ev of events) {
            if (!caseTraces.has(ev.case_id)) {
                caseTraces.set(ev.case_id, []);
            }
            caseTraces.get(ev.case_id).push(ev);
        }
        const totalCases = caseTraces.size;
        let offSystemEventCount = 0;
        const transitionMap = new Map();
        const nodeStatsMap = new Map();
        // Trace variants tracking
        const variantTracesMap = new Map();
        // Process each case
        for (const [caseId, trace] of caseTraces.entries()) {
            const activitySeq = [];
            const caseStartTime = new Date(trace[0].start_time).getTime();
            const caseEndTime = new Date(trace[trace.length - 1].end_time).getTime();
            const totalCaseDurationMinutes = (caseEndTime - caseStartTime) / (60 * 1000);
            for (let i = 0; i < trace.length; i++) {
                const current = trace[i];
                activitySeq.push(current.activity_name);
                if (current.channel !== 'EMR') {
                    offSystemEventCount++;
                }
                // Node metrics
                if (!nodeStatsMap.has(current.activity_name)) {
                    nodeStatsMap.set(current.activity_name, {
                        count: 0,
                        serviceDurations: [],
                        queueDurations: [],
                        department: current.department,
                        role: current.role
                    });
                }
                const nStat = nodeStatsMap.get(current.activity_name);
                nStat.count++;
                nStat.serviceDurations.push((current.duration_seconds || 0) / 60);
                if (i > 0) {
                    const prev = trace[i - 1];
                    const prevEnd = new Date(prev.end_time).getTime();
                    const currStart = new Date(current.start_time).getTime();
                    const queueMin = Math.max(0, (currStart - prevEnd) / (60 * 1000));
                    nStat.queueDurations.push(queueMin);
                    // Edge transition
                    const edgeKey = `${prev.activity_name}__${current.activity_name}`;
                    if (!transitionMap.has(edgeKey)) {
                        transitionMap.set(edgeKey, {
                            source: prev.activity_name,
                            target: current.activity_name,
                            durations: [],
                            channelCounts: new Map(),
                            count: 0
                        });
                    }
                    const eStat = transitionMap.get(edgeKey);
                    eStat.count++;
                    eStat.durations.push(queueMin);
                    eStat.channelCounts.set(current.channel, (eStat.channelCounts.get(current.channel) || 0) + 1);
                }
            }
            // Record variant
            const seqHash = activitySeq.join(' -> ');
            if (!variantTracesMap.has(seqHash)) {
                variantTracesMap.set(seqHash, {
                    sequence: activitySeq,
                    durations: [],
                    cases: []
                });
            }
            variantTracesMap.get(seqHash).durations.push(totalCaseDurationMinutes);
            variantTracesMap.get(seqHash).cases.push(caseId);
        }
        // Build Nodes
        const officialNodeIds = new Set(model.official_graph.nodes.map(n => n.id));
        const nodes = [];
        // Combine official nodes with discovered nodes
        const allNodeNames = new Set([...officialNodeIds, ...nodeStatsMap.keys()]);
        for (const name of allNodeNames) {
            const officialMeta = model.official_graph.nodes.find(n => n.id === name);
            const stat = nodeStatsMap.get(name);
            const medianService = stat ? calculatePercentile(stat.serviceDurations, 50) : 0;
            const p90Service = stat ? calculatePercentile(stat.serviceDurations, 90) : 0;
            const medianQueue = stat && stat.queueDurations.length > 0 ? calculatePercentile(stat.queueDurations, 50) : 0;
            // Bottleneck threshold: queue > 2.5x service time AND queue > 20 min
            const isBottleneck = (medianQueue > medianService * 2.5 && medianQueue > 20) || (medianQueue > 60);
            nodes.push({
                id: name,
                label: officialMeta?.label || name,
                department: stat?.department || officialMeta?.department || 'Operations',
                expected_role: officialMeta?.expected_role || stat?.role || 'Staff',
                is_required: officialMeta?.is_required ?? false,
                frequency: stat?.count || 0,
                median_duration_minutes: Math.round(medianService * 10) / 10,
                p90_duration_minutes: Math.round(p90Service * 10) / 10,
                queue_time_minutes: Math.round(medianQueue * 10) / 10,
                service_time_minutes: Math.round(medianService * 10) / 10,
                is_bottleneck: isBottleneck
            });
        }
        // Build Edges
        const officialEdgesSet = new Set(model.official_graph.edges.map(e => `${e.source}__${e.target}`));
        const edges = [];
        for (const [edgeKey, stat] of transitionMap.entries()) {
            const isOfficial = officialEdgesSet.has(edgeKey);
            let dominantChannel = 'EMR';
            let maxChanCount = 0;
            for (const [chan, count] of stat.channelCounts.entries()) {
                if (count > maxChanCount) {
                    maxChanCount = count;
                    dominantChannel = chan;
                }
            }
            const isShadow = !isOfficial || dominantChannel !== 'EMR';
            const medianDur = calculatePercentile(stat.durations, 50);
            const p90Dur = calculatePercentile(stat.durations, 90);
            edges.push({
                id: `edge-${edgeKey}`,
                source: stat.source,
                target: stat.target,
                count: stat.count,
                frequency_pct: Math.round((stat.count / totalCases) * 1000) / 10,
                median_duration_minutes: Math.round(medianDur * 10) / 10,
                p90_duration_minutes: Math.round(p90Dur * 10) / 10,
                is_official: isOfficial,
                is_shadow: isShadow,
                channel: dominantChannel
            });
        }
        // Build Variants
        const variants = [];
        let conformingCaseCount = 0;
        const skippedStepMap = new Map();
        const unofficialTransitionMap = new Map();
        for (const [hash, vData] of variantTracesMap.entries()) {
            const notes = [];
            let isConforming = true;
            // Check required nodes
            for (const reqNode of model.official_graph.nodes.filter(n => n.is_required)) {
                if (!vData.sequence.includes(reqNode.id)) {
                    isConforming = false;
                    notes.push(`Missing mandatory step: ${reqNode.label}`);
                    skippedStepMap.set(reqNode.label, (skippedStepMap.get(reqNode.label) || 0) + vData.cases.length);
                }
            }
            // Check transitions
            for (let s = 0; s < vData.sequence.length - 1; s++) {
                const tKey = `${vData.sequence[s]}__${vData.sequence[s + 1]}`;
                if (!officialEdgesSet.has(tKey)) {
                    isConforming = false;
                    notes.push(`Unofficial transition: ${vData.sequence[s]} → ${vData.sequence[s + 1]}`);
                    const transStat = transitionMap.get(tKey);
                    unofficialTransitionMap.set(tKey, {
                        count: (unofficialTransitionMap.get(tKey)?.count || 0) + vData.cases.length,
                        channel: transStat?.channelCounts.keys().next().value || 'Unofficial'
                    });
                }
            }
            if (isConforming) {
                conformingCaseCount += vData.cases.length;
            }
            const vMedian = calculatePercentile(vData.durations, 50);
            const vP90 = calculatePercentile(vData.durations, 90);
            variants.push({
                id: `var-${variants.length + 1}`,
                variant_hash: hash,
                activity_sequence: vData.sequence,
                case_count: vData.cases.length,
                frequency_pct: Math.round((vData.cases.length / totalCases) * 1000) / 10,
                median_duration_minutes: Math.round(vMedian * 10) / 10,
                p90_duration_minutes: Math.round(vP90 * 10) / 10,
                is_conforming: isConforming,
                conformance_notes: notes
            });
        }
        // Sort variants by frequency descending
        variants.sort((a, b) => b.case_count - a.case_count);
        // Global cycle times
        const allCaseDurations = Array.from(variantTracesMap.values()).flatMap(v => v.durations);
        const medianCycleTime = calculatePercentile(allCaseDurations, 50);
        const p90CycleTime = calculatePercentile(allCaseDurations, 90);
        const conformanceScore = Math.round((conformingCaseCount / totalCases) * 1000) / 10;
        const offSystemPct = Math.round((offSystemEventCount / events.length) * 1000) / 10;
        return {
            process_model: model,
            summary: {
                total_cases: totalCases,
                total_events: events.length,
                unique_variants: variants.length,
                conformance_score: conformanceScore,
                median_cycle_time_min: Math.round(medianCycleTime * 10) / 10,
                p90_cycle_time_min: Math.round(p90CycleTime * 10) / 10,
                off_system_handoff_pct: offSystemPct
            },
            nodes,
            edges,
            variants,
            conformance: {
                conforming_cases: conformingCaseCount,
                non_conforming_cases: totalCases - conformingCaseCount,
                skipped_steps: Array.from(skippedStepMap.entries()).map(([act, cnt]) => ({
                    activity: act,
                    count: cnt,
                    severity: 'CRITICAL_SAFETY'
                })),
                unofficial_transitions: Array.from(unofficialTransitionMap.entries()).map(([k, v]) => {
                    const [from, to] = k.split('__');
                    return { from, to, count: v.count, channel: v.channel };
                }),
                off_system_events: [
                    { channel: 'WhatsApp', count: events.filter(e => e.channel === 'WhatsApp').length, pct: 0 },
                    { channel: 'Paper Slip', count: events.filter(e => e.channel === 'Paper Slip').length, pct: 0 },
                    { channel: 'Verbal', count: events.filter(e => e.channel === 'Verbal').length, pct: 0 }
                ]
            }
        };
    }
    /**
     * Generates department x hour-of-day bottleneck heatmap matrix
     */
    async getDepartmentHourHeatmap() {
        const db = getDb();
        const query = `
      SELECT department,
             EXTRACT(HOUR FROM start_time) as hour_of_day,
             COUNT(*) as event_count,
             AVG(duration_seconds) / 60 as avg_duration_min,
             SUM(CASE WHEN channel != 'EMR' THEN 1 ELSE 0 END) as shadow_count
      FROM event_logs
      GROUP BY department, EXTRACT(HOUR FROM start_time)
      ORDER BY department, hour_of_day
    `;
        const res = await db.query(query);
        const departments = Array.from(new Set(res.rows.map(r => r.department)));
        const heatmap = [];
        for (const dept of departments) {
            const deptRows = res.rows.filter(r => r.department === dept);
            const hourlyData = [];
            for (let h = 0; h < 24; h++) {
                const match = deptRows.find(r => Number(r.hour_of_day) === h);
                const count = match ? Number(match.event_count) : 0;
                const avgDur = match ? Number(match.avg_duration_min) : 0;
                const shadow = match ? Number(match.shadow_count) : 0;
                // Friction index: combination of volume, latency, and off-system channels (0 to 100)
                const friction = match ? Math.min(100, Math.round((avgDur * 1.2) + (shadow * 3))) : 0;
                hourlyData.push({
                    hour: h,
                    count,
                    friction_score: friction
                });
            }
            heatmap.push({
                department: dept,
                hourly_data: hourlyData
            });
        }
        return heatmap;
    }
}
