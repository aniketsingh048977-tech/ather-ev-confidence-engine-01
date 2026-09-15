/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const ProfilePage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/profile"
      eyebrow="Rider Synthesis"
      title="Personalized Confidence Profile"
      description="Synthesizes assessment data into a rider archetype, confidence score, and custom mitigation report addressing your primary concerns."
      nextRoute={{
        path: '/savings',
        label: 'Calculate My Savings',
      }}
      secondaryAction={{
        path: '/test-ride',
        label: 'Schedule Test Ride',
      }}
      phase2PreviewPoints={[
        'Dynamic ScoreRing displaying confidence fit',
        'Custom mitigation report (Range vs Commute)',
        'Model recommendation with verified specifications',
        'Direct 1-click test ride booking pre-fill',
      ]}
      requiresProductData={true}
    />
  );
};
