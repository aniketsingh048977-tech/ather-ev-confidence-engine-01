/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const PostRidePage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/post-ride"
      eyebrow="Post-Experience Pulse"
      title="Post-Ride Evaluation & Booking Intent"
      description="Captures visceral post-ride reactions: throttle response satisfaction, pillion comfort impressions, and final decision progression."
      nextRoute={{
        path: '/admin',
        label: 'View Admin Portal',
      }}
      secondaryAction={{
        path: '/savings',
        label: 'Revisit Financials',
      }}
      phase2PreviewPoints={[
        '1-to-5 star tactile rating (Torque, Handling, Dashboard UI, Storage)',
        'Immediate post-ride intent barometer (Ready to Purchase, Need Financing, Comparing)',
        'Personalized lease vs loan financing calculator trigger',
        'Direct connection to delivery specialist',
      ]}
      requiresProductData={true}
    />
  );
};
