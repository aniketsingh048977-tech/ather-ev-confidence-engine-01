/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const SavingsPage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/savings"
      eyebrow="Financial Economics"
      title="Total Cost of Ownership & Savings"
      description="Compare operational costs of internal combustion engines against electric mobility over 1, 3, and 5-year horizons."
      nextRoute={{
        path: '/charging',
        label: 'Explore Charging Reality',
      }}
      secondaryAction={{
        path: '/profile',
        label: 'Back to Profile',
      }}
      phase2PreviewPoints={[
        'Interactive petrol vs electricity tariff model',
        'Break-even payback calendar timeline',
        'Consumable & routine servicing cost delta',
        'Exportable TCO comparison PDF sheet',
      ]}
      requiresProductData={true}
    />
  );
};
