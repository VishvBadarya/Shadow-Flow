export interface SimulationInput {
  processModelId?: string;
  scenarioName: string;
  addCssdTechnicians: number;             // e.g. +1 or +2
  automateConsentCapture: boolean;        // true/false
  enforcePacGatekeeper: boolean;          // true/false (eliminates 38% bypass & cancellation)
  automateTpaInsuranceBinding: boolean;   // true/false (eliminates 6.2h idle wait)
  turnoverBufferReductionMin: number;     // e.g. 5 to 20 minutes
}

export interface SimulationOutput {
  scenarioName: string;
  baseline: {
    ot_utilization_pct: number;
    turnover_time_min: number;
    cancelled_surgery_rate_pct: number;
    cssd_tat_min: number;
    discharge_tat_hours: number;
    total_cycle_time_min: number;
  };
  projected: {
    ot_utilization_pct: number;
    turnover_time_min: number;
    cancelled_surgery_rate_pct: number;
    cssd_tat_min: number;
    discharge_tat_hours: number;
    total_cycle_time_min: number;
    delta_ot_utilization_pct: number;
    delta_turnover_min: number;
    total_monthly_hours_saved: number;
    projected_annual_cost_savings_inr: number;
  };
  interventions: Array<{ name: string; impact: string }>;
}

export class SimulatorService {
  async runWhatIfSimulation(input: SimulationInput): Promise<SimulationOutput> {
    // Hospital Baseline Metrics
    const baseOtUtil = 64.2;
    const baseTurnover = 48.0;
    const baseCancelled = 8.4;
    const baseCssdTat = 168.0;
    const baseDischargeTat = 5.4;
    const baseCycleTime = 420.0;

    let projOtUtil = baseOtUtil;
    let projTurnover = baseTurnover;
    let projCancelled = baseCancelled;
    let projCssdTat = baseCssdTat;
    let projDischargeTat = baseDischargeTat;
    let projCycleTime = baseCycleTime;
    let annualSavingsInr = 0;
    let monthlyHoursSaved = 0;

    const interventions: Array<{ name: string; impact: string }> = [];

    // 1. Intervention: Enforce PAC Gatekeeper
    if (input.enforcePacGatekeeper) {
      projCancelled -= 6.2; // Reduces cancellation rate from 8.4% to 2.2%
      projOtUtil += 8.5;    // Recovered block time increases OT utilization
      projTurnover -= 6.0;  // Fewer frantic room shuffles
      monthlyHoursSaved += 120;
      annualSavingsInr += 4800000; // Prevented cancelled OT slots
      interventions.push({
        name: 'Digital PAC Gatekeeper',
        impact: 'Cuts cancellation rate by 74% and recovers 8.5% OT capacity by eliminating day-of-surgery fitness disqualifications.'
      });
    }

    // 2. Intervention: Add CSSD Technicians
    if (input.addCssdTechnicians > 0) {
      const techImpact = Math.min(input.addCssdTechnicians * 28, 60);
      projCssdTat -= techImpact;
      projTurnover -= Math.min(input.addCssdTechnicians * 4.5, 12);
      projOtUtil += Math.min(input.addCssdTechnicians * 2.2, 5.0);
      monthlyHoursSaved += input.addCssdTechnicians * 64;
      annualSavingsInr += input.addCssdTechnicians * 850000;
      interventions.push({
        name: `Added ${input.addCssdTechnicians} CSSD Technician(s)`,
        impact: `Decreases CSSD tray turnaround by ${techImpact} min and prevents first-case table holding.`
      });
    }

    // 3. Intervention: Automate Consent & WHO Checklist Capture
    if (input.automateConsentCapture) {
      projCycleTime -= 22;
      projTurnover -= 4.0;
      monthlyHoursSaved += 85;
      annualSavingsInr += 420000;
      interventions.push({
        name: 'Automated Digital Consent & WHO Checklist',
        impact: 'Saves 22 min per pre-op workup and eliminates 100% of missing physical consent scan delays.'
      });
    }

    // 4. Intervention: Automate TPA Insurance Document Push
    if (input.automateTpaInsuranceBinding) {
      projDischargeTat -= 3.8; // Drops from 5.4h to 1.6h
      monthlyHoursSaved += 190;
      annualSavingsInr += 1200000; // Accelerated bed turnover & reduced bed block
      interventions.push({
        name: 'Automated TPA Admission Document Push',
        impact: 'Slashes discharge TAT by 3.8 hours by eliminating manual ward documentation queries.'
      });
    }

    // 5. Buffer Reduction
    if (input.turnoverBufferReductionMin > 0) {
      const effReduction = Math.min(input.turnoverBufferReductionMin, 15);
      projTurnover -= effReduction;
      projOtUtil += (effReduction / 2);
      monthlyHoursSaved += effReduction * 10;
    }

    // Normalizing ranges
    projOtUtil = Math.min(94.0, Math.round(projOtUtil * 10) / 10);
    projTurnover = Math.max(22.0, Math.round(projTurnover * 10) / 10);
    projCancelled = Math.max(1.5, Math.round(projCancelled * 10) / 10);
    projCssdTat = Math.max(90.0, Math.round(projCssdTat * 10) / 10);
    projDischargeTat = Math.max(1.2, Math.round(projDischargeTat * 10) / 10);
    projCycleTime = Math.max(180.0, Math.round((baseCycleTime - (baseTurnover - projTurnover) - (baseDischargeTat - projDischargeTat) * 60) * 10) / 10);

    return {
      scenarioName: input.scenarioName || 'Custom Operational Scenario',
      baseline: {
        ot_utilization_pct: baseOtUtil,
        turnover_time_min: baseTurnover,
        cancelled_surgery_rate_pct: baseCancelled,
        cssd_tat_min: baseCssdTat,
        discharge_tat_hours: baseDischargeTat,
        total_cycle_time_min: baseCycleTime
      },
      projected: {
        ot_utilization_pct: projOtUtil,
        turnover_time_min: projTurnover,
        cancelled_surgery_rate_pct: projCancelled,
        cssd_tat_min: projCssdTat,
        discharge_tat_hours: projDischargeTat,
        total_cycle_time_min: projCycleTime,
        delta_ot_utilization_pct: Math.round((projOtUtil - baseOtUtil) * 10) / 10,
        delta_turnover_min: Math.round((baseTurnover - projTurnover) * 10) / 10,
        total_monthly_hours_saved: Math.round(monthlyHoursSaved),
        projected_annual_cost_savings_inr: Math.round(annualSavingsInr)
      },
      interventions
    };
  }
}
