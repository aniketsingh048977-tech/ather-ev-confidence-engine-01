/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const ConciergePage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/concierge"
      eyebrow="AI Assistance"
      title="Intelligent EV Concierge"
      description="An empathetic AI assistant answering questions about battery thermal management, water-wading capability, monsoon safety, and real-world range."
      nextRoute={{
        path: '/test-ride',
        label: 'Schedule My Test Ride',
      }}
      secondaryAction={{
        path: '/how-it-works',
        label: 'See How It Works',
      }}
      phase2PreviewPoints={[
        'Grounded conversational query engine',
        'Top hesitation FAQ quick-prompts (Monsoons, Battery Life, Pillion weight)',
        'Automatic lead scoring update based on question sentiment',
        'Direct handoff to Experience Center test ride booking',
      ]}
      requiresProductData={true}
    />
  );
};
