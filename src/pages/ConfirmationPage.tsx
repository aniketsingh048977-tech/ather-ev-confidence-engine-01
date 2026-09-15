/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const ConfirmationPage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/confirmation"
      eyebrow="Booking Secured"
      title="Test Ride Booking Confirmation"
      description="Instant booking pass with QR code, what-to-bring checklist (valid driver license, helmet recommendation), and route navigation instructions."
      nextRoute={{
        path: '/post-ride',
        label: 'Preview Post-Ride Flow',
      }}
      secondaryAction={{
        path: '/how-it-works',
        label: 'Explore Confidence Framework',
      }}
      phase2PreviewPoints={[
        'Digital pass with calendar export (.ics)',
        'Experience Center navigation pin with Google Maps integration',
        'Pre-ride briefing video on Warp Mode vs Eco Mode',
        'Direct WhatsApp support link',
      ]}
      requiresProductData={true}
    />
  );
};
