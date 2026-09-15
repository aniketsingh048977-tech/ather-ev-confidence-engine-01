/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const TestRidePage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/test-ride"
      eyebrow="Conversion Pivot"
      title="Frictionless Test Ride Scheduling"
      description="The decisive inflection point turning theoretical EV hesitation into visceral road experience. Choose your preferred Ather Space and time slot."
      nextRoute={{
        path: '/confirmation',
        label: 'Preview Confirmation Voucher',
      }}
      secondaryAction={{
        path: '/profile',
        label: 'Review Rider Fit',
      }}
      phase2PreviewPoints={[
        'City & Experience Center selector [VERIFIED LOCATIONS REQUIRED]',
        'Model selection (Ather 450X, Ather Rizta) [VERIFIED SPECS REQUIRED]',
        'Preferred date & time slot picker',
        'Home test ride availability inquiry toggle',
      ]}
      requiresProductData={true}
    />
  );
};
