/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const HowItWorksPage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/how-it-works"
      eyebrow="Consumer Psychology Framework"
      title="How the Confidence Engine Works"
      description="The 4-stage behavioral bridge moving skeptical urban two-wheeler riders from abstract EV hesitation to concrete physical test rides."
      nextRoute={{
        path: '/quiz',
        label: 'Start 2-Minute Assessment',
      }}
      secondaryAction={{
        path: '/savings',
        label: 'Inspect Savings Framework',
      }}
      phase2PreviewPoints={[
        'Stage 1: Hesitation Diagnostics (Exposing implicit range & charging doubts)',
        'Stage 2: Reality Calibration (Commute-mapped math vs petrol expenses)',
        'Stage 3: AI Concern Resolution (Technical clarity without sales pressure)',
        'Stage 4: Experiential Conversion (Seamless test ride bookings)',
      ]}
      requiresProductData={false}
    />
  );
};
