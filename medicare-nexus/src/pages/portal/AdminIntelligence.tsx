import React from 'react';
import PortalLayout from '../../components/PortalLayout';
import ClinicalIntelligenceSuite from '../clinical-intelligence/ClinicalIntelligenceSuite';

export default function AdminIntelligence() {
  return (
    <PortalLayout
      role="admin"
      title="ShadowFlow AI — Clinical Process Mining & Hospital Intelligence"
      subtitle="Discovered perioperative workflows, SOP compliance adherence, friction bottlenecks, and AI interventions."
    >
      <ClinicalIntelligenceSuite embedded={true} />
    </PortalLayout>
  );
}
