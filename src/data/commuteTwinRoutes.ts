/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CommuteRoute {
  id: string;
  cityName: string;
  name: string;
  distanceKm: number;
  oneWayKm: number;
  elevationDeltaM: number; // meters (+ for uphill, - for downhill)
  signalsCount: number;
  trafficIntensity: 'Bumper-to-Bumper' | 'Heavy Rush Hour' | 'Moderate Flow' | 'Expressway';
  flyoversCount: number;
  avgSpeedKmph: number;
  description: string;
  landmarks: string[];
}

export const PRESET_COMMUTE_ROUTES: CommuteRoute[] = [
  {
    id: 'blr-silkboard-orr',
    cityName: 'Bengaluru',
    name: 'Silk Board Junction to Bellandur / Marathahalli ORR',
    distanceKm: 26, // round trip
    oneWayKm: 13,
    elevationDeltaM: 18,
    signalsCount: 14,
    trafficIntensity: 'Bumper-to-Bumper',
    flyoversCount: 3,
    avgSpeedKmph: 18,
    description: "India's most notorious tech corridor. Heavy stop-and-go with high regenerative braking recovery opportunities.",
    landmarks: ['Silk Board Flyover', 'HSR Layout BDA', 'Agara Lake', 'Iblur Junction', 'Bellandur Tech Hub', 'Ecospace'],
  },
  {
    id: 'blr-indiranagar-manyata',
    cityName: 'Bengaluru',
    name: 'Indiranagar 100ft Rd to Manyata Tech Park (Hebbal)',
    distanceKm: 32,
    oneWayKm: 16,
    elevationDeltaM: 35,
    signalsCount: 11,
    trafficIntensity: 'Heavy Rush Hour',
    flyoversCount: 4,
    avgSpeedKmph: 24,
    description: 'Elevated corridors and mixed arterial roads with steep flyover inclines.',
    landmarks: ['Indiranagar Metro', 'Baiyappanahalli', 'Kasturi Nagar', 'Ramamurthy Nagar', 'Hebbal Flyover', 'Manyata Gate 2'],
  },
  {
    id: 'mum-thane-bkc',
    cityName: 'Mumbai',
    name: 'Thane West to Bandra-Kurla Complex (BKC)',
    distanceKm: 48,
    oneWayKm: 24,
    elevationDeltaM: 12,
    signalsCount: 19,
    trafficIntensity: 'Heavy Rush Hour',
    flyoversCount: 6,
    avgSpeedKmph: 22,
    description: 'Eastern Express Highway into BKC financial district with severe monsoon puddle spots and slow toll crawl.',
    landmarks: ['Teen Hath Naka', 'Mulund Check Naka', 'Vikhroli EEH', 'Chembur SCLR', 'Kurla Depot', 'BKC G-Block'],
  },
  {
    id: 'del-cybercity-noida',
    cityName: 'Delhi NCR',
    name: 'Cyber City Gurugram to Nehru Place / Okhla',
    distanceKm: 42,
    oneWayKm: 21,
    elevationDeltaM: 8,
    signalsCount: 12,
    trafficIntensity: 'Moderate Flow',
    flyoversCount: 5,
    avgSpeedKmph: 34,
    description: 'High speed stretches on Mehrauli-Gurgaon Road and Outer Ring Road with extreme ambient temperature conditions.',
    landmarks: ['DLF Cyber Hub', 'Sikanderpur', 'Aya Nagar Border', 'IIT Delhi Flyover', 'Nehru Place', 'Kalkaji Mandir'],
  },
  {
    id: 'hyd-gachibowli-hitec',
    cityName: 'Hyderabad',
    name: 'Gachibowli ORR to Hitec City & Jubilee Hills',
    distanceKm: 28,
    oneWayKm: 14,
    elevationDeltaM: 45, // significant rocky undulations
    signalsCount: 9,
    trafficIntensity: 'Moderate Flow',
    flyoversCount: 4,
    avgSpeedKmph: 29,
    description: 'Deccan rocky terrain with frequent 8–12% hill gradients where Ather instant torque and AutoHold shine.',
    landmarks: ['Gachibowli Stadium', 'Bio Diversity Park', 'Mindspace Circle', 'Cyber Towers', 'Durgam Cheruvu Cable Bridge', 'Jubilee Hills Rd 36'],
  },
  {
    id: 'che-adyar-omr',
    cityName: 'Chennai',
    name: 'Adyar Canal to OMR Siruseri IT SEZ',
    distanceKm: 44,
    oneWayKm: 22,
    elevationDeltaM: 5,
    signalsCount: 16,
    trafficIntensity: 'Heavy Rush Hour',
    flyoversCount: 2,
    avgSpeedKmph: 27,
    description: 'Old Mahabalipuram Road coastal corridor with strong sea headwind and continuous IT park signal junctions.',
    landmarks: ['Madhya Kailash', 'Tidel Park', 'Perungudi Toll', 'Sholinganallur Junction', 'Navalur', 'SIPCOT Siruseri'],
  },
];

export interface CommuteTelemetryResult {
  roundTripKm: number;
  batteryUsedPercent: number; // e.g. 18.5%
  batteryRemainingPercent: number;
  regenEnergyCapturedWh: number; // Wh added back through Magic Twist / Regen
  regenExtraKmGained: number; // km added through regen
  idleFuelWastedLitersICE: number; // petrol scooter burns ~0.55L/hr idling
  idleCostWastedICE: number; // INR
  atherEnergyCost: number; // INR
  petrolEnergyCost: number; // INR
  netDailySavings: number; // INR
  netMonthlySavings: number; // INR (assuming 24 commute days)
  chargesPerMonth: number;
  daysBetweenCharges: number;
  carbonAvoidedKgPerMonth: number;
}

export function calculateCommuteTelemetry(
  route: CommuteRoute,
  batteryCapacityKwh: number = 3.7, // Ather 450X / Rizta 3.7 kWh
  petrolPricePerLiter: number = 105,
  petrolMileageKmpl: number = 40,
  powerTariffPerUnit: number = 7.5
): CommuteTelemetryResult {
  const km = route.distanceKm;

  // Base consumption rate: ~27 Wh/km
  let baseWhPerKm = 27;

  // Elevation penalty
  if (route.elevationDeltaM > 20) {
    baseWhPerKm += (route.elevationDeltaM - 20) * 0.15;
  }

  // Traffic stop-and-go multiplier
  let regenMultiplier = 0.08; // 8% recovered baseline
  let idleHours = 0.15; // 9 mins idling at signals

  switch (route.trafficIntensity) {
    case 'Bumper-to-Bumper':
      baseWhPerKm += 4.5;
      regenMultiplier = 0.15; // 15% recovered in heavy braking
      idleHours = 0.45; // 27 mins idling
      break;
    case 'Heavy Rush Hour':
      baseWhPerKm += 2.5;
      regenMultiplier = 0.12;
      idleHours = 0.3;
      break;
    case 'Moderate Flow':
      baseWhPerKm += 0.5;
      regenMultiplier = 0.09;
      idleHours = 0.18;
      break;
    case 'Expressway':
      baseWhPerKm += 3.0; // wind resistance at 70+ km/h
      regenMultiplier = 0.05;
      idleHours = 0.08;
      break;
  }

  // Gross energy required
  const grossWh = km * baseWhPerKm;

  // Regenerative energy recaptured via Ather motor & Magic Twist™
  const regenWh = Math.round(grossWh * regenMultiplier);
  const netWhUsed = Math.max(10, grossWh - regenWh);

  // Battery percentage consumed on roundtrip
  const totalBatteryWh = batteryCapacityKwh * 1000;
  const batteryUsedPercent = Math.min(100, Math.round((netWhUsed / totalBatteryWh) * 1000) / 10);
  const batteryRemainingPercent = Math.max(0, 100 - batteryUsedPercent);

  // Extra km gained via regenerative braking
  const regenExtraKm = Math.round((regenWh / baseWhPerKm) * 10) / 10;

  // Petrol vehicle idling losses (typical 110cc scooter consumes ~0.55 L/hr at idle with clutch engaged)
  const idleFuelLiters = Math.round(idleHours * 0.52 * 100) / 100;
  const idleCostWasted = Math.round(idleFuelLiters * petrolPricePerLiter);

  // Fuel consumed for moving (ICE)
  const runningFuelLiters = km / petrolMileageKmpl;
  const totalPetrolCost = Math.round((runningFuelLiters + idleFuelLiters) * petrolPricePerLiter);

  // Ather energy cost (electric)
  const unitsConsumed = (netWhUsed / 1000) * 1.15; // 15% charging efficiency loss
  const totalAtherCost = Math.round(unitsConsumed * powerTariffPerUnit * 10) / 10;

  const netDailySavings = Math.round(totalPetrolCost - totalAtherCost);
  const netMonthlySavings = netDailySavings * 24; // 24 working days

  // Days between charges (leaving 15% reserve)
  const usableBatteryPercent = 85;
  const daysBetweenCharges = Math.max(1, Math.floor(usableBatteryPercent / batteryUsedPercent));
  const chargesPerMonth = Math.ceil(24 / daysBetweenCharges);

  // Carbon emission avoided (ICE ~0.065 kg CO2/km vs EV ~0.015 kg from grid)
  const carbonAvoidedKg = Math.round((km * 24 * 0.05) * 10) / 10;

  return {
    roundTripKm: km,
    batteryUsedPercent,
    batteryRemainingPercent,
    regenEnergyCapturedWh: regenWh,
    regenExtraKmGained: regenExtraKm,
    idleFuelWastedLitersICE: idleFuelLiters,
    idleCostWastedICE: idleCostWasted,
    atherEnergyCost: totalAtherCost,
    petrolEnergyCost: totalPetrolCost,
    netDailySavings,
    netMonthlySavings,
    chargesPerMonth,
    daysBetweenCharges,
    carbonAvoidedKgPerMonth: carbonAvoidedKg,
  };
}
