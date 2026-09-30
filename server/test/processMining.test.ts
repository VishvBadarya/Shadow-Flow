import { test, describe, before } from 'node:test';
import assert from 'node:assert';
import { ProcessMiningEngine } from '../src/services/processMiningEngine.js';
import { FrictionDetectorService } from '../src/services/frictionDetectorService.js';
import { SimulatorService } from '../src/services/simulatorService.js';
import { PROCESS_MODELS_DATA } from '../src/db/processModelsData.js';
import { initDatabaseSchema } from '../src/db/connection.js';
import { runSeed } from '../src/db/seed.js';

describe('ShadowFlow AI — Process Mining & Analytical Engine Test Suite', () => {
  let engine: ProcessMiningEngine;
  let detector: FrictionDetectorService;
  let simulator: SimulatorService;

  before(async () => {
    await initDatabaseSchema();
    await runSeed(1000); // Fast seed for testing
    engine = new ProcessMiningEngine();
    detector = new FrictionDetectorService();
    simulator = new SimulatorService();
  });


  test('PROCESS MODELS: exactly 8 perioperative workflows are defined with official graphs', () => {
    assert.strictEqual(PROCESS_MODELS_DATA.length, 8);
    const requiredIds = [
      'W1_ADMISSION_PREOP',
      'W2_PAC_CLEARANCE',
      'W3_OT_SCHEDULING',
      'W4_PREOP_CHECKLIST_CONSENT',
      'W5_INTRAOP_PACU_TRANSFER',
      'W6_CSSD_TURNAROUND',
      'W7_PHARMACY_INDENT',
      'W8_BILLING_PREAUTH_DISCHARGE'
    ];
    for (const id of requiredIds) {
      const model = PROCESS_MODELS_DATA.find(p => p.id === id);
      assert.ok(model, `Process model ${id} should exist`);
      assert.ok(model.official_graph.nodes.length >= 4, `${id} should have official nodes`);
      assert.ok(model.official_graph.edges.length >= 3, `${id} should have official edges`);
    }
  });

  test('DISCOVERY ENGINE: computes DFG, variants, and detects planted W2 WhatsApp bypass', async () => {
    const graph = await engine.getProcessGraph('W2_PAC_CLEARANCE');
    assert.ok(graph.summary.total_cases > 0, 'Should have processed cases');
    assert.ok(graph.nodes.length > 0, 'Should have discovered nodes');
    assert.ok(graph.edges.length > 0, 'Should have discovered transitions');

    // Verify WhatsApp shadow activity was discovered in DFG
    const whatsappNode = graph.nodes.find(n => n.id.includes('WhatsApp'));
    assert.ok(whatsappNode, 'Discovered nodes must include WhatsApp PAC Verification Request');

    // Verify conformance score reflects planted bypass (~60% conforming, ~40% non-conforming)
    assert.ok(graph.summary.conformance_score < 75, 'Conformance score should detect planted ~38% non-conformance');
    assert.ok(graph.summary.conformance_score > 40, 'Conformance score should not be 0');

    // Verify variants extracted
    assert.ok(graph.variants.length >= 2, 'Should detect at least 2 distinct trace variants');
    const topVariant = graph.variants[0];
    assert.ok(topVariant.case_count > 0, 'Top variant should have cases');
  });

  test('FRICTION DETECTOR: identifies rework loops and shadow communication channels', async () => {
    const alerts = await detector.detectAllFriction();
    assert.ok(alerts.length > 0, 'Should detect friction alerts');

    const hasShadowAlert = alerts.some(a => a.type === 'SHADOW_TOOL');
    assert.ok(hasShadowAlert, 'Should detect off-system shadow tools (WhatsApp / Paper Slip)');

    const hasReworkAlert = alerts.some(a => a.type === 'REWORK_LOOP');
    assert.ok(hasReworkAlert, 'Should detect rework loops (CSSD repeats)');
  });

  test('SIMULATOR ENGINE: calculates projected OT utilization and cancellation reduction accurately', async () => {
    const result = await simulator.runWhatIfSimulation({
      scenarioName: 'Cosmic PAC + CSSD Turnaround Intervention',
      addCssdTechnicians: 1,
      automateConsentCapture: true,
      enforcePacGatekeeper: true,
      automateTpaInsuranceBinding: true,
      turnoverBufferReductionMin: 10
    });

    assert.ok(result.projected.ot_utilization_pct > result.baseline.ot_utilization_pct, 'Projected OT utilization should increase');
    assert.ok(result.projected.cancelled_surgery_rate_pct < result.baseline.cancelled_surgery_rate_pct, 'Projected cancellation rate should decrease');
    assert.ok(result.projected.total_monthly_hours_saved > 0, 'Monthly hours saved should be positive');
    assert.ok(result.projected.projected_annual_cost_savings_inr > 0, 'Annual savings should be positive');
  });
});
