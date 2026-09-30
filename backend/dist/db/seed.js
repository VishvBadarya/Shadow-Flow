import { getDb, initDatabaseSchema } from './connection.js';
import { PROCESS_MODELS_DATA, HOSPITAL_ROLES } from './processModelsData.js';
import { v4 as uuidv4 } from 'uuid';
export async function runSeed(totalCasesTarget = 5000) {
    console.log(`\n🏥 [ShadowFlow AI] Initializing Seed Data Generation (Target: ~${totalCasesTarget} cases)...`);
    const db = getDb();
    // Initialize Schema
    await initDatabaseSchema();
    // 1. Seed Roles & Users
    console.log('👤 Seeding 11 hospital operational users & roles...');
    for (const r of HOSPITAL_ROLES) {
        const userId = `usr_${r.role.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
        const email = `${r.role.toLowerCase().replace(/[^a-z0-9]/g, '.')}@cosmicsurgical.in`;
        await db.query(`INSERT INTO users (id, email, full_name, role, department, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (id) DO NOTHING`, [userId, email, `${r.role} Officer`, r.role, r.department]);
    }
    // 2. Seed Process Models & Conformance Rules
    console.log('📋 Seeding 8 perioperative process models and conformance rules...');
    for (const pm of PROCESS_MODELS_DATA) {
        await db.query(`INSERT INTO process_models (id, name, category, description, target_tat_minutes, official_graph, metadata)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         category = EXCLUDED.category,
         description = EXCLUDED.description,
         target_tat_minutes = EXCLUDED.target_tat_minutes,
         official_graph = EXCLUDED.official_graph,
         metadata = EXCLUDED.metadata`, [pm.id, pm.name, pm.category, pm.description, pm.target_tat_minutes, JSON.stringify(pm.official_graph), JSON.stringify(pm.metadata)]);
        for (const rule of pm.conformance_rules) {
            await db.query(`INSERT INTO conformance_rules (id, process_model_id, rule_name, rule_type, source_activity, target_activity, severity, description)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (id) DO NOTHING`, [rule.id, pm.id, rule.rule_name, rule.rule_type, rule.source_activity || null, rule.target_activity || null, rule.severity, rule.description]);
        }
    }
    // 3. Clear old event logs for clean reproducible seed
    console.log('🧹 Clearing legacy event logs for fresh deterministic generation...');
    await db.exec('DELETE FROM event_logs');
    await db.exec('DELETE FROM findings');
    await db.exec('DELETE FROM recommendations');
    await db.exec('DELETE FROM kpi_metrics');
    await db.exec('DELETE FROM audit_logs');
    // 4. Generate Realistic Event Logs (5,000 cases spanning 90 days)
    console.log('⚙️ Generating 5,000 realistic clinical event cases across 8 workflows with planted shadow behaviors...');
    const now = new Date('2026-09-30T10:00:00.000Z').getTime();
    const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;
    const startTimeBase = now - ninetyDaysMs;
    // Distribution of cases across workflows
    const caseDistribution = [
        { modelId: 'W1_ADMISSION_PREOP', count: 700 },
        { modelId: 'W2_PAC_CLEARANCE', count: 1200 }, // Planted Anomaly: 38% WhatsApp clearance bypass
        { modelId: 'W3_OT_SCHEDULING', count: 650 },
        { modelId: 'W4_PREOP_CHECKLIST_CONSENT', count: 550 },
        { modelId: 'W5_INTRAOP_PACU_TRANSFER', count: 500 },
        { modelId: 'W6_CSSD_TURNAROUND', count: 500 }, // Planted Anomaly: 3x duplicate indent entries
        { modelId: 'W7_PHARMACY_INDENT', count: 400 },
        { modelId: 'W8_BILLING_PREAUTH_DISCHARGE', count: 500 } // Planted Anomaly: 6.2h pre-auth wait for existing document
    ];
    const allEvents = [];
    let w2BypassCount = 0;
    let w2TotalCount = 0;
    for (const dist of caseDistribution) {
        const pm = PROCESS_MODELS_DATA.find(p => p.id === dist.modelId);
        for (let c = 1; c <= dist.count; c++) {
            const caseCode = `CASE-${dist.modelId.substring(0, 2)}-${String(c).padStart(4, '0')}`;
            // Random arrival time within 90 days, biased towards operational hours (07:00 to 20:00)
            const dayOffsetMs = Math.random() * ninetyDaysMs;
            const caseDate = new Date(startTimeBase + dayOffsetMs);
            const hour = 7 + Math.floor(Math.random() * 12); // 7 to 19
            caseDate.setUTCHours(hour, Math.floor(Math.random() * 60), Math.floor(Math.random() * 60));
            let currentTimestamp = caseDate.getTime();
            // PLANTING ANOMALIES PER WORKFLOW
            if (dist.modelId === 'W2_PAC_CLEARANCE') {
                w2TotalCount++;
                const isBypass = Math.random() < 0.38; // Planted 38% anomaly!
                if (isBypass) {
                    w2BypassCount++;
                    // Shadow Sequence: OT Booking first -> Chased on WhatsApp -> Late Fitness / Cancellation
                    // Step 1: OT Slot Booking Initiated (Unofficial premature order)
                    const dur1 = 15 * 60;
                    allEvents.push({
                        id: uuidv4(),
                        case_id: caseCode,
                        process_model_id: dist.modelId,
                        activity_name: 'OT Slot Booking',
                        start_time: new Date(currentTimestamp).toISOString(),
                        end_time: new Date(currentTimestamp + dur1 * 1000).toISOString(),
                        duration_seconds: dur1,
                        role: 'Surgeon',
                        department: 'OT Administration',
                        channel: 'EMR',
                        system_used: 'CosmicHMS',
                        is_official_step: true,
                        attributes: JSON.stringify({ variant_type: 'SHADOW_PAC_BYPASS', note: 'Booked prior to PAC clearance' })
                    });
                    currentTimestamp += dur1 * 1000 + (30 + Math.random() * 60) * 60 * 1000;
                    // Step 2: Unofficial WhatsApp PAC Follow-up
                    const dur2 = 10 * 60;
                    allEvents.push({
                        id: uuidv4(),
                        case_id: caseCode,
                        process_model_id: dist.modelId,
                        activity_name: 'WhatsApp PAC Verification Request',
                        start_time: new Date(currentTimestamp).toISOString(),
                        end_time: new Date(currentTimestamp + dur2 * 1000).toISOString(),
                        duration_seconds: dur2,
                        role: 'Surgeon',
                        department: 'Surgical Department',
                        channel: 'WhatsApp',
                        system_used: 'WhatsApp',
                        is_official_step: false,
                        attributes: JSON.stringify({ channel: 'WhatsApp', shadow_activity: true, urgent_flag: true })
                    });
                    currentTimestamp += dur2 * 1000 + (45 + Math.random() * 90) * 60 * 1000;
                    // Step 3: PAC Consultation & Lab Review
                    const dur3 = 40 * 60;
                    allEvents.push({
                        id: uuidv4(),
                        case_id: caseCode,
                        process_model_id: dist.modelId,
                        activity_name: 'PAC Clinic Consultation',
                        start_time: new Date(currentTimestamp).toISOString(),
                        end_time: new Date(currentTimestamp + dur3 * 1000).toISOString(),
                        duration_seconds: dur3,
                        role: 'Anaesthetist',
                        department: 'Anaesthesia OPD',
                        channel: 'EMR',
                        system_used: 'CosmicHMS',
                        is_official_step: true,
                        attributes: JSON.stringify({ expedited: true })
                    });
                    currentTimestamp += dur3 * 1000 + 20 * 60 * 1000;
                    allEvents.push({
                        id: uuidv4(),
                        case_id: caseCode,
                        process_model_id: dist.modelId,
                        activity_name: 'Lab & ECG Review',
                        start_time: new Date(currentTimestamp).toISOString(),
                        end_time: new Date(currentTimestamp + 25 * 60 * 1000).toISOString(),
                        duration_seconds: 25 * 60,
                        role: 'Anaesthetist',
                        department: 'Anaesthesia OPD',
                        channel: 'EMR',
                        system_used: 'CosmicHMS',
                        is_official_step: true,
                        attributes: JSON.stringify({})
                    });
                    currentTimestamp += 30 * 60 * 1000;
                    // Step 4: Outcome: 22% of these bypasses get cancelled day-of-surgery!
                    const isCancelled = Math.random() < 0.22;
                    if (isCancelled) {
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: 'Surgery Rescheduled or Cancelled',
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + 10 * 60 * 1000).toISOString(),
                            duration_seconds: 10 * 60,
                            role: 'Hospital Administrator',
                            department: 'OT Administration',
                            channel: 'EMR',
                            system_used: 'CosmicHMS',
                            is_official_step: false,
                            attributes: JSON.stringify({ cancellation_reason: 'Incomplete PAC workup at scheduled OT start time' })
                        });
                    }
                    else {
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: 'Surgical Fitness Issued',
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + 15 * 60 * 1000).toISOString(),
                            duration_seconds: 15 * 60,
                            role: 'Anaesthetist',
                            department: 'Anaesthesia OPD',
                            channel: 'WhatsApp', // Verbal/WhatsApp signed off!
                            system_used: 'WhatsApp',
                            is_official_step: true,
                            attributes: JSON.stringify({ warning: 'Retroactive verbal signoff' })
                        });
                        currentTimestamp += 15 * 60 * 1000;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: 'EMR Clearance Flagged',
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + 10 * 60 * 1000).toISOString(),
                            duration_seconds: 10 * 60,
                            role: 'Anaesthetist',
                            department: 'Anaesthesia OPD',
                            channel: 'EMR',
                            system_used: 'CosmicHMS',
                            is_official_step: true,
                            attributes: JSON.stringify({ retroactive: true })
                        });
                    }
                }
                else {
                    // Standard Official Workflow for W2
                    for (const node of pm.official_graph.nodes) {
                        const stepDur = (10 + Math.floor(Math.random() * 20)) * 60;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: node.id,
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + stepDur * 1000).toISOString(),
                            duration_seconds: stepDur,
                            role: node.expected_role,
                            department: node.department,
                            channel: 'EMR',
                            system_used: 'CosmicHMS',
                            is_official_step: true,
                            attributes: JSON.stringify({ variant_type: 'OFFICIAL_SOP' })
                        });
                        currentTimestamp += (stepDur + (5 + Math.floor(Math.random() * 15)) * 60) * 1000;
                    }
                }
            }
            else if (dist.modelId === 'W6_CSSD_TURNAROUND') {
                // PLANT ANOMALY: CSSD tray requests re-entered 3 times (Paper Slip, EMR Indent, WhatsApp Reminder)
                const hasRework = Math.random() < 0.65;
                for (const node of pm.official_graph.nodes) {
                    if (node.id === 'OT Tray Indent Placed' && hasRework) {
                        // Entry 1: Paper register entry
                        const d1 = 12 * 60;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: 'Paper Indent Slip Created',
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + d1 * 1000).toISOString(),
                            duration_seconds: d1,
                            role: 'OT Nurse',
                            department: 'OT Suite',
                            channel: 'Paper Slip',
                            system_used: 'PaperSlip',
                            is_official_step: false,
                            attributes: JSON.stringify({ repeat_index: 1, method: 'Physical paper carbon slip' })
                        });
                        currentTimestamp += (d1 + 15 * 60) * 1000;
                        // Entry 2: Official EMR Indent entry
                        const d2 = 10 * 60;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: 'OT Tray Indent Placed',
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + d2 * 1000).toISOString(),
                            duration_seconds: d2,
                            role: 'OT Nurse',
                            department: 'OT Suite',
                            channel: 'EMR',
                            system_used: 'CosmicHMS',
                            is_official_step: true,
                            attributes: JSON.stringify({ repeat_index: 2 })
                        });
                        currentTimestamp += (d2 + 25 * 60) * 1000;
                        // Entry 3: WhatsApp urgent ping
                        const d3 = 8 * 60;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: 'WhatsApp Urgent Tray Ping',
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + d3 * 1000).toISOString(),
                            duration_seconds: d3,
                            role: 'OT Nurse',
                            department: 'OT Suite',
                            channel: 'WhatsApp',
                            system_used: 'WhatsApp',
                            is_official_step: false,
                            attributes: JSON.stringify({ repeat_index: 3, note: 'Chasing CSSD technician directly' })
                        });
                        currentTimestamp += (d3 + 10 * 60) * 1000;
                    }
                    else {
                        const stepDur = (15 + Math.floor(Math.random() * 30)) * 60;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: node.id,
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + stepDur * 1000).toISOString(),
                            duration_seconds: stepDur,
                            role: node.expected_role,
                            department: node.department,
                            channel: 'EMR',
                            system_used: 'CosmicHMS',
                            is_official_step: true,
                            attributes: JSON.stringify({})
                        });
                        currentTimestamp += (stepDur + 10 * 60) * 1000;
                    }
                }
            }
            else if (dist.modelId === 'W8_BILLING_PREAUTH_DISCHARGE') {
                // PLANT ANOMALY: Pre-Auth waits 6 hours for document already existing in admission packet
                for (const node of pm.official_graph.nodes) {
                    if (node.id === 'Pre-Auth Approval Transmitted') {
                        // Massive idle bottleneck: 6.2 hours average wait!
                        const waitSeconds = Math.floor((5.5 + Math.random() * 1.5) * 3600); // ~5.5 to 7.0 hours
                        // Shadow activity: Manual documentation chase between billing and ward
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: 'Paper Query Sent to Ward for Admission Record',
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + 20 * 60 * 1000).toISOString(),
                            duration_seconds: 20 * 60,
                            role: 'Billing Executive',
                            department: 'Billing Desk',
                            channel: 'Paper Slip',
                            system_used: 'PaperSlip',
                            is_official_step: false,
                            attributes: JSON.stringify({ query: 'Document exists in digital admission repository but was re-queried manually' })
                        });
                        currentTimestamp += waitSeconds * 1000;
                        const stepDur = 25 * 60;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: node.id,
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + stepDur * 1000).toISOString(),
                            duration_seconds: stepDur,
                            role: node.expected_role,
                            department: node.department,
                            channel: 'EMR',
                            system_used: 'CosmicHMS',
                            is_official_step: true,
                            attributes: JSON.stringify({ preauth_wait_hours: (waitSeconds / 3600).toFixed(1) })
                        });
                        currentTimestamp += (stepDur + 15 * 60) * 1000;
                    }
                    else {
                        const stepDur = (20 + Math.floor(Math.random() * 30)) * 60;
                        allEvents.push({
                            id: uuidv4(),
                            case_id: caseCode,
                            process_model_id: dist.modelId,
                            activity_name: node.id,
                            start_time: new Date(currentTimestamp).toISOString(),
                            end_time: new Date(currentTimestamp + stepDur * 1000).toISOString(),
                            duration_seconds: stepDur,
                            role: node.expected_role,
                            department: node.department,
                            channel: 'EMR',
                            system_used: 'CosmicHMS',
                            is_official_step: true,
                            attributes: JSON.stringify({})
                        });
                        currentTimestamp += (stepDur + 15 * 60) * 1000;
                    }
                }
            }
            else {
                // Other workflows (W1, W3, W4, W5, W7) with realistic variance
                for (const node of pm.official_graph.nodes) {
                    // Occasional shadow channels (verbal, paper) in 15% of events
                    const isShadowChannel = Math.random() < 0.15;
                    const channel = isShadowChannel ? (Math.random() < 0.5 ? 'Verbal' : 'Paper Slip') : 'EMR';
                    const system = isShadowChannel ? (channel === 'Verbal' ? 'Verbal' : 'PaperSlip') : 'CosmicHMS';
                    const stepDur = (12 + Math.floor(Math.random() * 25)) * 60;
                    allEvents.push({
                        id: uuidv4(),
                        case_id: caseCode,
                        process_model_id: dist.modelId,
                        activity_name: node.id,
                        start_time: new Date(currentTimestamp).toISOString(),
                        end_time: new Date(currentTimestamp + stepDur * 1000).toISOString(),
                        duration_seconds: stepDur,
                        role: node.expected_role,
                        department: node.department,
                        channel,
                        system_used: system,
                        is_official_step: true,
                        attributes: JSON.stringify({})
                    });
                    currentTimestamp += (stepDur + (5 + Math.floor(Math.random() * 20)) * 60) * 1000;
                }
            }
        }
    }
    console.log(`📊 Total events generated: ${allEvents.length} across ${caseDistribution.reduce((a, b) => a + b.count, 0)} cases.`);
    console.log(`🎯 Seed Anomaly Check: W2 PAC bypass rate = ${((w2BypassCount / w2TotalCount) * 100).toFixed(1)}% (Target: ~38%)`);
    // Batch insert events (batches of 1000)
    const batchSize = 1000;
    for (let i = 0; i < allEvents.length; i += batchSize) {
        const chunk = allEvents.slice(i, i + batchSize);
        const valuePlaceholders = [];
        const values = [];
        let pIdx = 1;
        for (const ev of chunk) {
            valuePlaceholders.push(`($${pIdx}, $${pIdx + 1}, $${pIdx + 2}, $${pIdx + 3}, $${pIdx + 4}, $${pIdx + 5}, $${pIdx + 6}, $${pIdx + 7}, $${pIdx + 8}, $${pIdx + 9}, $${pIdx + 10}, $${pIdx + 11}, $${pIdx + 12})`);
            values.push(ev.id, ev.case_id, ev.process_model_id, ev.activity_name, ev.start_time, ev.end_time, ev.duration_seconds, ev.role, ev.department, ev.channel, ev.system_used, ev.is_official_step, ev.attributes);
            pIdx += 13;
        }
        const insertSql = `
      INSERT INTO event_logs (
        id, case_id, process_model_id, activity_name,
        start_time, end_time, duration_seconds,
        role, department, channel, system_used,
        is_official_step, attributes
      ) VALUES ${valuePlaceholders.join(', ')}
    `;
        await db.query(insertSql, values);
        process.stdout.write(`   ↳ Saved ${Math.min(i + batchSize, allEvents.length)}/${allEvents.length} events...\r`);
    }
    console.log('\n✅ All event records committed to database.');
    // 5. Seed Core Seed Findings (to anchor initial UI views)
    console.log('🔍 Seeding baseline findings grounded in the event anomalies...');
    const findingsData = [
        {
            id: 'FIND-W2-001',
            process_model_id: 'W2_PAC_CLEARANCE',
            finding_type: 'COMPLIANCE_BREACH',
            title: 'Premature OT Booking Prior to Anaesthetic Clearance with WhatsApp Workaround',
            severity: 'CRITICAL',
            department: 'Anaesthesia OPD & OT',
            affected_roles: ['Surgeon', 'Anaesthetist', 'OT Nurse'],
            evidence: {
                bypass_percentage: ((w2BypassCount / w2TotalCount) * 100).toFixed(1) + '%',
                affected_cases: w2BypassCount,
                shadow_channel: 'WhatsApp',
                cancellation_rate_in_bypass: '21.8%',
                cancellation_rate_in_sop: '2.1%'
            },
            root_cause_hypothesis: 'Surgeons book OT calendar slots early to reserve preferred room blocks before securing formal PAC clearance. Anaesthetists are subsequently chased over personal WhatsApp groups, creating high clinical risk and day-of-surgery cancellations when investigations fail.',
            ai_confidence: 0.94,
            requires_clinical_review: true
        },
        {
            id: 'FIND-W6-002',
            process_model_id: 'W6_CSSD_TURNAROUND',
            finding_type: 'REWORK_LOOP',
            title: 'Triple-Redundant CSSD Tray Requisition Across Paper, EMR & WhatsApp',
            severity: 'HIGH',
            department: 'CSSD & OT Suite',
            affected_roles: ['OT Nurse', 'CSSD Technician'],
            evidence: {
                rework_factor: '3.0x',
                affected_workflows: 'CSSD Instrument Indent',
                channels_observed: ['Paper Slip', 'CosmicHMS', 'WhatsApp'],
                wasted_nurse_time_hours_month: 168
            },
            root_cause_hypothesis: 'Nurses lack real-time visibility into autoclave queue status on CosmicHMS, prompting them to keep a physical paper ledger and send duplicate WhatsApp alerts to technicians to guarantee tray delivery before first-case start.',
            ai_confidence: 0.91,
            requires_clinical_review: false
        },
        {
            id: 'FIND-W8-003',
            process_model_id: 'W8_BILLING_PREAUTH_DISCHARGE',
            finding_type: 'BOTTLENECK',
            title: '6.2-Hour Pre-Authorization Idle Queue for Existing Admission Documents',
            severity: 'HIGH',
            department: 'Billing Desk',
            affected_roles: ['Billing Executive', 'Ward Nurse'],
            evidence: {
                median_idle_queue_hours: 6.2,
                target_tat_hours: 1.5,
                idle_time_pct: '84%',
                discharge_delay_average_hours: 5.4
            },
            root_cause_hypothesis: 'TPA insurance pre-authorization queries trigger physical paper documentation requests to the inpatient ward for diagnostic and admission notes, despite these documents already being uploaded digitally during initial admission.',
            ai_confidence: 0.96,
            requires_clinical_review: false
        }
    ];
    for (const f of findingsData) {
        await db.query(`INSERT INTO findings (id, process_model_id, finding_type, title, severity, department, affected_roles, evidence, root_cause_hypothesis, ai_confidence, requires_clinical_review)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       ON CONFLICT (id) DO NOTHING`, [f.id, f.process_model_id, f.finding_type, f.title, f.severity, f.department, JSON.stringify(f.affected_roles), JSON.stringify(f.evidence), f.root_cause_hypothesis, f.ai_confidence, f.requires_clinical_review]);
    }
    // 6. Seed Recommendations on the Action Board
    console.log('📌 Seeding actionable recommendations across Kanban stages...');
    const recommendationsData = [
        {
            id: 'REC-001',
            finding_id: 'FIND-W2-001',
            process_model_id: 'W2_PAC_CLEARANCE',
            title: 'Digital Gatekeeper: Enforce PAC Clearance Lock in OT Booking System',
            status: 'PROPOSED',
            owner_role: 'Hospital Administrator',
            change_description: 'Modify CosmicHMS to restrict OT slot reservation until a certified EMR PAC fitness flag is digitally signed by the attending anaesthetist. Replace WhatsApp chases with automated in-app clinical alerts.',
            projected_minutes_saved: 42.5,
            projected_cost_savings_inr: 420000,
            risk_level: 'MEDIUM',
            success_metric: 'PAC-before-OT compliance > 98%, First-case on-time start > 88%, Zero WhatsApp clinical handoffs.',
            before_kpi_value: 62.0,
            after_kpi_value: 98.0
        },
        {
            id: 'REC-002',
            finding_id: 'FIND-W6-002',
            process_model_id: 'W6_CSSD_TURNAROUND',
            title: 'Unified CSSD Tracking Screen & Deprecation of Paper Carbon Register',
            status: 'APPROVED',
            owner_role: 'Quality/Compliance Head',
            change_description: 'Deploy real-time autoclave chamber cycle status tablets in OT nurse stations and eliminate paper indent registers. Automatically notify OT scrub team on autoclave completion.',
            projected_minutes_saved: 35.0,
            projected_cost_savings_inr: 180000,
            risk_level: 'LOW',
            success_metric: 'Tray indent rework rate reduced from 3.0x to 1.0x, CSSD turnaround time < 120 min.',
            before_kpi_value: 3.0,
            after_kpi_value: 1.0
        },
        {
            id: 'REC-003',
            finding_id: 'FIND-W8-003',
            process_model_id: 'W8_BILLING_PREAUTH_DISCHARGE',
            title: 'Automated Document Package Push to TPA Insurance Portal',
            status: 'IN_PROGRESS',
            owner_role: 'Billing Executive',
            change_description: 'Auto-bind initial admission face sheets and diagnostic PDFs to the insurance pre-auth module upon surgery completion. Eliminates manual ward inquiries.',
            projected_minutes_saved: 240.0,
            projected_cost_savings_inr: 320000,
            risk_level: 'LOW',
            success_metric: 'Pre-auth approval TAT reduced from 6.2h to 1.5h, Discharge delay < 60 min.',
            before_kpi_value: 372.0,
            after_kpi_value: 90.0
        }
    ];
    for (const r of recommendationsData) {
        await db.query(`INSERT INTO recommendations (id, finding_id, process_model_id, title, status, owner_role, change_description, projected_minutes_saved, projected_cost_savings_inr, risk_level, success_metric, before_kpi_value, after_kpi_value)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO NOTHING`, [r.id, r.finding_id, r.process_model_id, r.title, r.status, r.owner_role, r.change_description, r.projected_minutes_saved, r.projected_cost_savings_inr, r.risk_level, r.success_metric, r.before_kpi_value, r.after_kpi_value]);
    }
    // 7. Seed Initial KPI Metrics
    console.log('📈 Seeding hospital baseline KPI metrics...');
    const kpiData = [
        { modelId: 'W3_OT_SCHEDULING', name: 'OT_UTILIZATION_PCT', current: 64.2, baseline: 61.5, target: 85.0, unit: 'PERCENT' },
        { modelId: 'W3_OT_SCHEDULING', name: 'FIRST_CASE_ON_TIME_START_PCT', current: 58.4, baseline: 55.0, target: 90.0, unit: 'PERCENT' },
        { modelId: 'W5_INTRAOP_PACU_TRANSFER', name: 'TURNOVER_TIME_BETWEEN_CASES_MIN', current: 48.0, baseline: 52.0, target: 25.0, unit: 'MINUTES' },
        { modelId: 'W1_ADMISSION_PREOP', name: 'ADMISSION_TO_SURGERY_TAT_HOURS', current: 14.8, baseline: 16.2, target: 6.0, unit: 'HOURS' },
        { modelId: 'W8_BILLING_PREAUTH_DISCHARGE', name: 'DISCHARGE_TAT_HOURS', current: 5.4, baseline: 6.1, target: 2.0, unit: 'HOURS' },
        { modelId: 'W8_BILLING_PREAUTH_DISCHARGE', name: 'PREAUTH_APPROVAL_TAT_HOURS', current: 6.2, baseline: 6.8, target: 1.5, unit: 'HOURS' },
        { modelId: 'W6_CSSD_TURNAROUND', name: 'CSSD_TRAY_TAT_MIN', current: 168.0, baseline: 175.0, target: 120.0, unit: 'MINUTES' },
        { modelId: 'W6_CSSD_TURNAROUND', name: 'REWORK_RATE_FACTOR', current: 2.8, baseline: 3.0, target: 1.0, unit: 'RATIO' },
        { modelId: 'W2_PAC_CLEARANCE', name: 'OFF_SYSTEM_HANDOFF_PCT', current: 38.2, baseline: 42.0, target: 0.0, unit: 'PERCENT' },
        { modelId: 'W2_PAC_CLEARANCE', name: 'CONFORMANCE_SCORE_PCT', current: 61.8, baseline: 58.0, target: 95.0, unit: 'PERCENT' },
        { modelId: 'W3_OT_SCHEDULING', name: 'CANCELLED_SURGERY_RATE_PCT', current: 8.4, baseline: 9.2, target: 2.0, unit: 'PERCENT' }
    ];
    for (const k of kpiData) {
        const kpiId = `kpi_${k.modelId.toLowerCase()}_${k.name.toLowerCase()}`;
        await db.query(`INSERT INTO kpi_metrics (id, process_model_id, kpi_name, current_value, baseline_value, target_value, unit, trend_data)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`, [kpiId, k.modelId, k.name, k.current, k.baseline, k.target, k.unit, JSON.stringify([
                { month: 'Jul', value: k.baseline },
                { month: 'Aug', value: (k.baseline + k.current) / 2 },
                { month: 'Sep', value: k.current }
            ])]);
    }
    // 8. Seed Initial Audit Log
    await db.query(`INSERT INTO audit_logs (id, user_role, action, resource_type, resource_id, details)
     VALUES ($1, $2, $3, $4, $5, $6)`, [uuidv4(), 'Hospital Administrator', 'INITIAL_DATASET_SEED', 'EVENT_LOG', 'ALL_WORKFLOWS', JSON.stringify({ cases: 5000, events: allEvents.length })]);
    console.log('🎉 [ShadowFlow AI] Seed data complete! Ready for discovery engine and API.');
}
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
    runSeed().catch(err => {
        console.error('❌ Error during seeding:', err);
        process.exit(1);
    });
}
