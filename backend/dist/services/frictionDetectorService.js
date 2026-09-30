import { getDb } from '../db/connection.js';
export class FrictionDetectorService {
    async detectAllFriction(processModelId) {
        const db = getDb();
        const alerts = [];
        // Filter by processModelId if supplied
        const whereClause = processModelId ? 'WHERE process_model_id = $1' : '';
        const params = processModelId ? [processModelId] : [];
        // 1. DETECT REWORK LOOPS (Activity repeated 2+ times, or multi-channel indent entries)
        const reworkQuery = `
      SELECT process_model_id, case_id, activity_name, department, role, COUNT(*) as occurrence_count
      FROM event_logs
      ${whereClause}
      GROUP BY process_model_id, case_id, activity_name, department, role
      HAVING COUNT(*) >= 2
    `;
        const reworkRes = await db.query(reworkQuery, params);
        // Also check for multi-step indent rework in W6 CSSD (Paper + EMR + WhatsApp)
        const indentReworkQuery = `
      SELECT process_model_id, case_id, department, role, COUNT(*) as indent_entries_count
      FROM event_logs
      WHERE (activity_name ILIKE '%indent%' OR activity_name ILIKE '%tray%')
      ${processModelId ? 'AND process_model_id = $1' : ''}
      GROUP BY process_model_id, case_id, department, role
      HAVING COUNT(*) >= 2
    `;
        const indentRes = await db.query(indentReworkQuery, params);
        const grouped = new Map();
        for (const r of reworkRes.rows) {
            const key = `${r.process_model_id}::${r.activity_name}`;
            if (!grouped.has(key)) {
                grouped.set(key, { count: 0, cases: [], dept: r.department, role: r.role, maxRepeat: 0 });
            }
            const item = grouped.get(key);
            item.count++;
            if (item.cases.length < 5)
                item.cases.push(r.case_id);
            item.maxRepeat = Math.max(item.maxRepeat, Number(r.occurrence_count));
        }
        // Add multi-channel indent rework if found
        if (indentRes.rows.length > 0) {
            const w6Cases = indentRes.rows.map(r => r.case_id);
            const maxEntries = Math.max(...indentRes.rows.map(r => Number(r.indent_entries_count)));
            alerts.push({
                type: 'REWORK_LOOP',
                title: `CSSD Tray Requisition Re-entered ${maxEntries}x Across Multi-Channels`,
                severity: 'HIGH',
                department: 'CSSD & OT Suite',
                affected_roles: ['OT Nurse', 'CSSD Technician'],
                metrics: {
                    affected_cases_count: indentRes.rows.length,
                    max_repeat_count: maxEntries,
                    rework_factor: `${maxEntries}.0x`,
                    estimated_wasted_hours_monthly: Math.round(indentRes.rows.length * maxEntries * 0.25 * 10) / 10
                },
                description: `Instrument tray requisitions are entered up to ${maxEntries} times across paper slips, EMR indents, and WhatsApp messages due to lack of autoclave status visibility.`,
                evidence_traces: w6Cases.slice(0, 5)
            });
        }
        for (const [key, data] of grouped.entries()) {
            const [modelId, actName] = key.split('::');
            alerts.push({
                type: 'REWORK_LOOP',
                title: `Redundant Re-entry in '${actName}' (${data.maxRepeat}x repeats)`,
                severity: data.maxRepeat >= 3 ? 'HIGH' : 'MEDIUM',
                department: data.dept,
                affected_roles: [data.role],
                metrics: {
                    affected_cases_count: data.count,
                    max_repeat_count: data.maxRepeat,
                    estimated_wasted_hours_monthly: Math.round(data.count * data.maxRepeat * 0.25 * 10) / 10
                },
                description: `Activity '${actName}' occurred up to ${data.maxRepeat} times per case across ${data.count} cases, indicating repeated data logging or missing cross-department handoff confirmation.`,
                evidence_traces: data.cases
            });
        }
        // 2. DETECT SHADOW CHANNELS (WhatsApp, Paper Slip, Personal Excel)
        const shadowQuery = `
      SELECT channel, system_used, department, role, COUNT(*) as event_count, COUNT(DISTINCT case_id) as case_count
      FROM event_logs
      WHERE channel NOT IN ('EMR') ${processModelId ? 'AND process_model_id = $1' : ''}
      GROUP BY channel, system_used, department, role
      ORDER BY event_count DESC
    `;
        const shadowRes = await db.query(shadowQuery, params);
        for (const s of shadowRes.rows) {
            alerts.push({
                type: 'SHADOW_TOOL',
                title: `Off-System Workaround: ${s.channel} used in ${s.department}`,
                severity: s.channel === 'WhatsApp' ? 'CRITICAL' : 'HIGH',
                department: s.department,
                affected_roles: [s.role],
                metrics: {
                    channel_name: s.channel,
                    events_recorded: Number(s.event_count),
                    affected_cases: Number(s.case_count),
                    system_bypassed: 'CosmicHMS'
                },
                description: `Staff relied on ${s.channel} (${s.system_used}) for ${s.event_count} clinical coordination events instead of the official EMR, bypassing audit trails and accreditation compliance.`,
                evidence_traces: []
            });
        }
        // 3. DETECT BOTTLENECKS (Where queue latency is disproportionate)
        const bottleneckQuery = `
      SELECT activity_name, department, role,
             AVG(duration_seconds)/60 as avg_service_min,
             COUNT(*) as frequency
      FROM event_logs
      ${whereClause}
      GROUP BY activity_name, department, role
      HAVING AVG(duration_seconds)/60 > 30
      ORDER BY avg_service_min DESC
      LIMIT 5
    `;
        const bRes = await db.query(bottleneckQuery, params);
        for (const b of bRes.rows) {
            alerts.push({
                type: 'BOTTLENECK',
                title: `Service Latency Bottleneck: '${b.activity_name}'`,
                severity: Number(b.avg_service_min) > 90 ? 'CRITICAL' : 'HIGH',
                department: b.department,
                affected_roles: [b.role],
                metrics: {
                    avg_duration_min: Math.round(Number(b.avg_service_min) * 10) / 10,
                    case_frequency: Number(b.frequency)
                },
                description: `Average duration for '${b.activity_name}' is ${Math.round(Number(b.avg_service_min))} minutes, significantly exceeding the target operational threshold.`,
                evidence_traces: []
            });
        }
        return alerts;
    }
}
