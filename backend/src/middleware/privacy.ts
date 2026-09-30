import { Request, Response, NextFunction } from 'express';

export function healthcarePrivacyMiddleware(req: Request, res: Response, next: NextFunction) {
  // Enforce mandatory Clinical Decision Support (CDS) header
  res.setHeader(
    'X-Healthcare-Guardrail',
    'Clinical Decision Support Only - Aggregated Operational Telemetry - De-identified per DPDP/HIPAA'
  );

  const originalJson = res.json;

  res.json = function (data: any) {
    if (data && typeof data === 'object') {
      // Guardrail: Attach mandatory disclaimer if AI insight is included
      if (data.root_cause_hypothesis || data.hypotheses || data.recommendations) {
        data._disclaimer = 'CLINICAL DECISION SUPPORT ONLY. Operational insights are probabilistic and must be verified by a qualified medical or operations officer before protocol changes.';
      }
    }
    return originalJson.call(this, data);
  };

  next();
}
