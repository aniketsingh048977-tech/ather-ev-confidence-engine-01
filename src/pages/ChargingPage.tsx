/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const ChargingPage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/charging"
      eyebrow="Infrastructure & Habits"
      title="Charging Routine Simulator"
      description="Demystifies EV charging by showing how overnight home charging satisfies 95% of urban commutes, complemented by grid fast-charging."
      nextRoute={{
        path: '/concierge',
        label: 'Ask AI Concierge',
      }}
      secondaryAction={{
        path: '/test-ride',
        label: 'Book Test Ride',
      }}
      phase2PreviewPoints={[
        'Interactive weekly charging schedule planner',
        'Home 5A socket vs fast-charger time simulator',
        'Ather Grid fast-charger network locator [VERIFIED DATA REQUIRED]',
        'Apartment society approval documentation generator',
      ]}
      requiresProductData={true}
    />
  );
};
