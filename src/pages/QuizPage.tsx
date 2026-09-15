/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlaceholderPage } from '../components/common/PlaceholderPage';

export const QuizPage: React.FC = () => {
  return (
    <PlaceholderPage
      route="/quiz"
      eyebrow="Confidence Assessment"
      title="Rider Diagnostic Quiz"
      description="A 6-step dynamic assessment evaluating daily commute distance, apartment charging access, monthly petrol expenditure, and riding habits."
      nextRoute={{
        path: '/profile',
        label: 'View Rider Profile',
      }}
      secondaryAction={{
        path: '/savings',
        label: 'Preview Savings Logic',
      }}
      phase2PreviewPoints={[
        'Interactive multi-step commute slider',
        'Home parking & 5A plug type selection',
        'Real-time hesitation concern detection',
        'Instantaneous lead score weight computation',
      ]}
      requiresProductData={true}
    />
  );
};
