import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Ather EV Knowledge Base System Instruction
const ATHER_EV_SYSTEM_PROMPT = `
You are the Ather Senior EV Specialist & AI Concierge for the "Ather EV Confidence Engine".
Your mission is to help riders transition from petrol hesitation to complete electric confidence through objective engineering physics, real ownership data, and transparent guidance.

ABOUT ATHER ENERGY & SCOOTER LINEUP:
1. Ather 450X (Gen 3):
   - Battery: 3.7 kWh or 2.9 kWh high-capacity Li-ion pack (IP67 certified sealed aluminum case).
   - Real-World Range: TrueRange™ 110 km (3.7 kWh) / 90 km (2.9 kWh) in SmartEco mode. Certified IDC is 150 km / 115 km.
   - Acceleration: 0-40 km/h in 3.3 seconds.
   - Motor: 6.4 kW peak power, 26 Nm instantaneous torque. Top speed: 90 km/h.
   - Riding Modes: Eco, SmartEco (adapts to riding style to preserve TrueRange), Ride, Sport, Warp.
   - Dashboard: 7-inch TFT capacitive touchscreen, onboard Google Maps with live traffic & range footprint, auto-rerouting to Ather Grid chargers.
   - Smart Features: AutoHold™ (hill-hold stop without brakes on flyovers or steep ramps), Park Assist™ (reverse throttle up to 5 km/h), FallSafe™ (cuts power immediately if tilted in a fall), Emergency Stop Signal (ESS).

2. Ather 450S:
   - Battery: 2.9 kWh pack.
   - Real-World Range: TrueRange™ 90 km (115 km IDC).
   - Acceleration: 0-40 km/h in 3.9 seconds. Top speed: 90 km/h. 5.4 kW peak power, 22 Nm torque.
   - Dashboard: 7-inch DeepView™ segmented display with high contrast sunlight readability, turn-by-turn navigation via Ather App.

3. Ather 450 Apex (Flagship):
   - 10-Year Celebration flagship with transparent translucent side panels and Indium Blue color.
   - Battery: 3.7 kWh. Warp+ mode: 0-40 km/h in 2.9 seconds! Top speed: 100 km/h.
   - Magic Twist™: Proprietary regenerative braking allowing complete stopping without touching mechanical brake levers by twisting the throttle reverse.

4. Ather Rizta (The Smart Family Scooter):
   - Largest, most plush seat in the segment (suitable for two full adults + child).
   - Huge cargo: 34-liter boot storage + 22-liter optional organizer Frunk (56L total!).
   - Battery: 2.9 kWh (TrueRange 105 km) or 3.7 kWh (TrueRange 125 km).
   - Family Safety: SkidControl™ (anti-skid traction control on wet/loose roads), FallSafe, Emergency Stop Signal, WhatsApp alerts, Live location sharing, Ping My Scooter.

CHARGING ECOSYSTEM:
- Home Charging:
  - Standard 5A / 15A three-pin household socket. Ather Dot wallbox or Portable Charger.
  - Zero special industrial high-power wiring required. 0-80% in ~4.5 hours.
  - Overnight charging costs approximately ₹20 - ₹28 for a full 100% tank (based on ₹7-₹8/unit domestic electricity tariff).
- Apartment & Society (RWA) Installations:
  - Ather provides complete RWA documentation, compliance guidelines, and technical site-survey blueprints to draw a dedicated wire from the resident's meter box to their basement parking slot with a sub-meter. Over 40% of Ather owners live in multi-story apartments.
- Ather Grid™ Public Fast Charging:
  - 3,000+ fast chargers across 100+ Indian cities and highway corridors.
  - Adds up to 1.5 km of range per minute (up to 15 km in 10 minutes, 0-50% in ~20-30 mins). Auto-authenticates and tracks via the Ather App.

TRUERANGE™ PHILOSOPHY:
- Indian Driving Cycle (IDC) is conducted on flat dynos in lab conditions. Real Indian commutes have traffic lights, monsoon puddles, flyovers, pillion riders, and dynamic acceleration.
- Ather's algorithm computes TrueRange™ with 98% accuracy. If the dashboard shows 42 km, you can trust it to take you exactly 42 km.

ECONOMICS & RUNNING COSTS:
- Petrol Scooter: 35-40 km/L @ ₹105/L = ~₹2.60 to ₹3.00 per km. Monthly petrol for 25 km/day = ~₹2,200 to ₹3,200.
- Ather Scooter: Consumes ~3.0 - 3.3 kWh per 100 km @ ₹7.5/unit = ~₹0.25 to ₹0.35 per km! Monthly electricity = ~₹200 to ₹300.
- Annual Net Fuel Savings: ~₹25,000 to ₹38,000+ directly saved.
- Maintenance: No engine oil, spark plugs, drive belts, air filters, or clutch rollers to replace. 70-80% lower periodic servicing cost.

PETROL-TO-ELECTRIC SWITCH & EXCHANGE PROGRAM:
- Trade-in any old petrol two-wheeler (Honda Activa, TVS Jupiter, Suzuki Access, Hero Maestro/Pleasure, etc.).
- Direct Instant Trade-In Valuation: ₹15,000 to ₹45,000 based on registration year (2016-2024) and condition.
- Ather Switch Bonus: Flat additional +₹10,000 discount applied on top of the vehicle exchange appraisal, directly reducing down payment and on-road price.
- 7-Day Price Lock Guarantee: Values calculated on the Ather Switch Engine are locked for 7 days upon booking a test ride.
- VIP Doorstep Ride Option: Customers can request home/office doorstep delivery of the test ride scooter with on-spot trade-in evaluation.

BATTERY SAFETY & LONGEVITY:
- Sealed IP67 aluminum battery pack casing: tested to wade through 400 mm of standing water safely.
- Multi-tier Battery Management System (BMS) with thermal cut-offs and cell-level balancing.
- Ather Battery Protect™: 5-year / 60,000 km warranty with a 70% State-of-Health (SoH) minimum capacity guarantee. Real fleet telemetry shows over 80% capacity retained even after 100,000+ km of daily use.

COMMUNICATION STYLE:
- Tone: Highly knowledgeable, friendly, authoritative, reassuring, and concise. Speak as a seasoned EV automotive engineer.
- Be transparent and realistic: If a rider commutes 140 km every single day without charging access, explain clearly why they need charging access or consider their routing carefully.
- Include concrete calculations, practical tips, and relevant Ather features.
- Structure responses clearly with punchy bullet points, bold highlights, and short readable paragraphs.
- Keep responses focused (typically 2 to 4 compact paragraphs or structured bullets).
- Do not hedge artificially on price, range, specs, models, or charging—answer them directly with real numbers!
`;

// Helper for fallback responses when GEMINI_API_KEY is not set
function generateFallbackExpertResponse(
  message: string,
  userContext: any
): string {
  const query = message.toLowerCase();
  const commute = userContext?.commute || '20-30 km';
  const parking = userContext?.parking || 'Apartment/Home parking';
  const petrolSpend = userContext?.monthlyFuelExpense || 3000;

  if (query.includes('rizta') || query.includes('family') || query.includes('boot') || query.includes('storage') || query.includes('seat')) {
    return `### Ather Rizta: Engineered for Everyday Family Life\n\nThe **Ather Rizta** is purpose-built from the chassis up for Indian family riding:\n\n* **Segment-Leading Comfort**: Features the largest, widest pillion seat in the two-wheeler category with an integrated pillion backrest.\n* **56L Massive Storage**: A deep 34-liter under-seat boot (fits 2 full-size helmets) plus an optional 22L front trunk (Frunk).\n* **Safety First with SkidControl™**: Proprietary electronic traction control prevents rear-wheel slip on wet roads, gravel, or sandy patch turns.\n* **TrueRange™ Performance**: Available in 2.9 kWh (105 km TrueRange) and 3.7 kWh (125 km TrueRange) options.\n* **Smart Connectivity**: WhatsApp notification preview, Live location tracking, and Emergency Stop Signal (ESS).\n\nWould you like to compare the Rizta directly with the sporty 450X?`;
  }

  if (query.includes('450x') || query.includes('apex') || query.includes('performance') || query.includes('warp') || query.includes('speed') || query.includes('acceleration')) {
    return `### Ather 450X & 450 Apex: Instant Throttle & Precision Dynamics\n\nIf agile handling and instant response are your priorities, the **Ather 450 Series** stands in a league of its own:\n\n* **Instant Warp Torque**: Delivers **26 Nm of instant torque @ 0 RPM**, launching you from 0 to 40 km/h in just **3.3 seconds** (2.9s on the 450 Apex).\n* **Chassis Engineering**: Precision-engineered all-aluminum hybrid trellis chassis provides a low center of gravity and 50:50 weight distribution for confident cornering.\n* **Smart Navigation**: 7-inch waterproof TFT touchscreen powered by Android with onboard **Google Maps** and live traffic.\n* **AutoHold™ Technology**: Holds you securely on steep flyovers and basement parking slopes without touching the brakes.\n* **Top Speed**: 90 km/h on 450X, 100 km/h on 450 Apex with Magic Twist™ zero-lever regenerative braking.\n\nAre you looking at the 3.7 kWh pack (110 km TrueRange) or the 2.9 kWh pack (90 km TrueRange)?`;
  }

  if (query.includes('range') || query.includes('km') || query.includes('truerange') || query.includes('distance') || query.includes('battery dead') || query.includes('stranded')) {
    return `### The TrueRange™ Guarantee vs Laboratory Claims\n\nUnlike standard IDC (Indian Driving Cycle) test results done on flat dynos, **Ather TrueRange™ is what you actually get on real roads**:\n\n* **Ather 450X (3.7 kWh)**: 110 km TrueRange (150 km IDC)\n* **Ather 450X / 450S (2.9 kWh)**: 90 km TrueRange (115 km IDC)\n* **Ather Rizta (3.7 kWh)**: 125 km TrueRange (160 km IDC)\n\n**Why you will not get stranded:**\n1. **Stop-and-Go Efficiency**: Unlike petrol engines that idle and waste fuel at red lights, an Ather motor uses zero energy when stationary.\n2. **Predictive Dashboard Indicator**: The battery percentage shows your real remaining range based on your current ride mode and gradient.\n3. **Ather Grid™ Safety Net**: With over 3,000+ fast-charging points, you are never more than a few minutes away from a quick top-up in major urban hubs.`;
  }

  if (query.includes('charging') || query.includes('apartment') || query.includes('socket') || query.includes('plug') || query.includes('rwa') || query.includes('home')) {
    return `### Effortless Charging: Home, Apartment & Public Grid\n\nCharging an Ather is as straightforward as charging your smartphone overnight:\n\n1. **Everyday Home Charging (5A Socket)**:\n   * Plugs into any standard 5A or 15A three-pin household socket using the Ather Portable Charger or Ather Dot.\n   * Charges from **0 to 80% in approximately 4.5 hours** while you sleep.\n   * Costs just **₹22 to ₹28 per full charge** (~₹0.25 to ₹0.30/km).\n\n2. **Apartment / Society (RWA) Setup**:\n   * Over 40% of Ather owners live in apartment complexes.\n   * Ather provides standard RWA permission templates, technical compliance letters, and assistance to draw dedicated wiring from your meter box to your assigned basement slot.\n\n3. **Public Ather Grid™ (Fast Charging)**:\n   * 3,000+ points across 100+ cities.\n   * Adds up to **1.5 km of range per minute** (0 to 50% in ~20-25 mins).\n\nWhere do you usually park your scooter at night?`;
  }

  if (query.includes('cost') || query.includes('savings') || query.includes('petrol') || query.includes('price') || query.includes('maintenance') || query.includes('money') || query.includes('expensive')) {
    const monthlyFuel = Number(petrolSpend) || 3000;
    const annualPetrol = monthlyFuel * 12;
    const annualEV = Math.round(annualPetrol * 0.12);
    const annualSavings = annualPetrol - annualEV;

    return `### The Economics: Real Cash Savings vs Petrol\n\nLet’s look at the hard financial math based on typical ownership:\n\n* **Running Cost per km**:\n  * Petrol Scooter: **₹2.80 - ₹3.20 per km** (at ₹105/L & 35-38 km/L)\n  * Ather Electric: **₹0.30 - ₹0.35 per km** (consuming ~3.2 units per 100 km)\n* **Monthly Fuel Comparison**:\n  * Your current petrol expense: **₹${monthlyFuel.toLocaleString('en-IN')}/mo**\n  * Equivalent Ather electricity cost: **₹${Math.round(monthlyFuel * 0.12).toLocaleString('en-IN')}/mo**\n* **Annual Net Savings**:\n  * Fuel savings: **~₹${annualSavings.toLocaleString('en-IN')} retained cash every year**\n  * Maintenance savings: ~₹4,500/year (zero engine oil, clutch shoes, spark plugs, or valve clearances to service)\n\nOver 3 to 4 years, an Ather typically saves **₹1,00,000 to ₹1,40,000+** in operating expenses!`;
  }

  if (query.includes('autohold') || query.includes('magic twist') || query.includes('reverse') || query.includes('regen') || query.includes('hill') || query.includes('fallsafe')) {
    return `### Atherstack™ Proprietary Ride Engineering

Ather vehicles feature deep software-hardware integration engineered for intuitive control:

* **AutoHold™ (Hill-Hold Assist)**:
  * Automatically detects road incline when stopped on flyovers, highway bridges, or basement parking ramps.
  * Locks the scooter firmly in place without requiring you to hold the mechanical brake levers. Releasing throttle or tapping brake disengages it seamlessly without rolling backward.
* **Magic Twist™ (Patented on 450 Apex)**:
  * Allows continuous negative throttle rotation to apply regenerative deceleration down to a complete 0 km/h standstill.
  * Eliminates the need to touch front/rear brake levers in 85%+ of urban city commuting while recuperating kinetic energy back into the battery.
* **Park Assist™ (Reverse Throttle)**:
  * Motor-assisted reverse up to 5 km/h allows effortless reversing out of congested, sloped, or tight parking bays.
* **FallSafe™**:
  * Real-time 6-axis IMU gyroscopes detect any abnormal tilt angle during an accidental tip-over and cut off motor torque instantly to prevent runaway acceleration.`;
  }

  if (query.includes('price') || query.includes('emi') || query.includes('on road') || query.includes('on-road') || query.includes('cost to buy') || query.includes('down payment')) {
    return `### Ather Product Lineup & Pricing Guide (Approx. Ex-Showroom)

Ather offers clear choices tailored to distinct riding archetypes:

1. **Ather Rizta (Family Comfort)**:
   * **Rizta S (2.9 kWh)**: ~₹1,10,000 (105 km TrueRange, 34L boot, DeepView display)
   * **Rizta Z (3.7 kWh)**: ~₹1,44,000 (125 km TrueRange, SkidControl™, pillion backrest, TFT display)
2. **Ather 450X (Sport Performance)**:
   * **450X (2.9 kWh)**: ~₹1,40,000 (90 km TrueRange, 0-40 in 3.3s, Warp mode)
   * **450X (3.7 kWh)**: ~₹1,55,000 (110 km TrueRange, 7" Google Maps touchscreen)
3. **Ather 450S (Entry Sport)**:
   * ~₹1,15,000 (90 km TrueRange, 90 km/h top speed, DeepView display)
4. **Ather 450 Apex (Flagship)**:
   * ~₹1,95,000 (100 km/h top speed, Warp+ 0-40 in 2.9s, Magic Twist, Indium Blue)

* **EMI & Financing**: Low-interest retail EV finance partners offer EMIs starting from **~₹2,999/month** with down payments as low as 5%. State EV road tax exemptions apply in multiple states.`;
  }

  if (query.includes('test ride') || query.includes('checklist') || query.includes('what to check') || query.includes('experience center')) {
    return `### Ather Space Test Ride Checklist

To get the most out of your 15-minute evaluation ride, we suggest testing these key areas:

1. **Instant Throttle Calibration**: Notice the smooth, vibration-free delivery from 0 km/h with zero clutch lag or belt shudder.
2. **AutoHold™ on an Incline**: Ask the product specialist to let you halt on the showroom exit ramp or flyover to experience zero-rollback hold without touching brakes.
3. **Seat Ergonomics & Pillion Balance**: Sit with a family member or co-rider to verify cushion density and footpeg positioning.
4. **TrueRange™ Live Feedback**: Observe how the dashboard predicts real remaining distance based on Eco vs Sport mode.
5. **Boot Utility Depth**: Check that your daily bag, backpack, or full-face helmet fits comfortably under the seat.`;
  }

  if (query.includes('exchange') || query.includes('trade in') || query.includes('trade-in') || query.includes('switch') || query.includes('activa') || query.includes('jupiter') || query.includes('access') || query.includes('old scooter') || query.includes('bonus')) {
    return `### Ather Switch & Save: Petrol-to-Electric Trade-In\n\nYou can trade in any petrol scooter (Honda Activa, TVS Jupiter, Suzuki Access, Hero, etc.) directly for an Ather with two big financial advantages:\n\n* **Guaranteed Trade-in Value**: We evaluate your scooter's fair market value (typically **₹18,000 to ₹42,000** based on year and running condition).\n* **Exclusive Ather Switch Bonus**: You receive an **extra +₹10,000 bonus discount** applied directly on top of your scooter's trade-in value.\n* **Instant Downpayment Deduction**: Both amounts are deducted upfront from your Ather on-road price, lowering your loan principal or cash outflow.\n* **7-Day Price Lock Guarantee**: Lock your appraised value for 7 days when you book a test ride.\n* **Doorstep VIP Inspection**: If you book a Doorstep Test Ride, our specialist inspects your old scooter and completes the valuation at your home.\n\nUse our interactive **Switch & Save Engine** on the homepage or book a test ride to lock your bonus today!`;
  }

  // General EV Expert Advice tailored to user context
  return `### Ather EV Expert Assessment\n\nFor your daily transit needs (commute: **${commute}**, parking: **${parking}**):\n\n* **Range Fit**: Your daily commute easily fits within standard TrueRange™ with a healthy 60%+ safety buffer remaining.\n* **Charging Simplicity**: Charging overnight via a standard 5A socket ensures 100% capacity every morning without visiting fuel stations.\n* **Operational Purity**: Instant 26 Nm torque eliminates engine vibration, noise fatigue, and clutch wear in heavy stop-and-go traffic.\n* **Next Step**: We always recommend taking a relaxed 15-minute test ride at your local Ather Space to evaluate the balance, AutoHold™, and throttle feel in person.\n\nWhat specific detail would you like to explore next—charging setup, savings breakdown, or riding dynamics?`;
}

// API Route: AI Concierge Chat
app.post('/api/concierge/chat', async (req, res) => {
  try {
    const { message, history = [], userContext = {} } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGenAI();

    // If Gemini API Key is available, use Gemini 3.8 Flash model
    if (ai) {
      try {
        const contextualSystemInstruction = `${ATHER_EV_SYSTEM_PROMPT}

CURRENT USER CONTEXT:
- Customer Name: ${userContext?.name || 'Rider'}
- City: ${userContext?.city || 'Bengaluru / Pune'}
- Daily Commute: ${userContext?.commute || userContext?.dailyCommute || '20 km'}
- Parking / Charging Setup: ${userContext?.parking || userContext?.parkingType || 'Home / Apartment parking'}
- Monthly Fuel Spend: ₹${userContext?.monthlyFuelExpense || userContext?.petrolSpend || 3000}
- Rider Archetype: ${userContext?.archetype || 'Smart Urban Commuter'}
- Suggested Ather Model: ${userContext?.suggestedModel || 'Ather 450X / Rizta'}
- Primary Priority: ${userContext?.priority || 'Range confidence & Running cost'}
- Biggest Concern: ${userContext?.concern || 'Charging and real-world range'}

Use this context to personalize your answer naturally.`;

        // Format conversation history for Gemini API (ensuring strict role alternation starting with 'user')
        const contents: any[] = [];
        
        if (Array.isArray(history)) {
          let lastRole: string | null = null;
          for (const item of history.slice(-6)) {
            if (!item.text) continue;
            const currentRole = item.sender === 'user' ? 'user' : 'model';
            // Gemini conversation contents must start with 'user'
            if (contents.length === 0 && currentRole !== 'user') {
              continue;
            }
            // Strict role alternation
            if (currentRole !== lastRole) {
              contents.push({
                role: currentRole,
                parts: [{ text: item.text }],
              });
              lastRole = currentRole;
            }
          }
        }

        // Append latest user message (if last was user, combine or overwrite, else append)
        if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
          contents[contents.length - 1] = {
            role: 'user',
            parts: [{ text: message }],
          };
        } else {
          contents.push({
            role: 'user',
            parts: [{ text: message }],
          });
        }

        const generateCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction: contextualSystemInstruction,
            temperature: 0.7,
            thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          },
        });

        const timeoutCall = new Promise<null>((resolve) => {
          setTimeout(() => resolve(null), 3500);
        });

        const response: any = await Promise.race([generateCall, timeoutCall]);

        const replyText = response?.text || generateFallbackExpertResponse(message, userContext);

        return res.json({
          reply: replyText,
          model: response?.text ? 'gemini-3.8-flash' : 'ather-expert-engine',
          status: 'success',
        });
      } catch (geminiError) {
        console.error('Gemini API call failed, falling back to local expert system:', geminiError);
        const fallbackText = generateFallbackExpertResponse(message, userContext);
        return res.json({
          reply: fallbackText,
          model: 'ather-expert-engine',
          status: 'fallback',
        });
      }
    }

    // If no API key configured, use comprehensive Ather EV Expert engine
    const expertReply = generateFallbackExpertResponse(message, userContext);
    return res.json({
      reply: expertReply,
      model: 'ather-expert-engine',
      status: 'success',
    });
  } catch (error: any) {
    console.error('Error in /api/concierge/chat:', error);
    return res.status(500).json({
      error: 'Internal server error',
      reply: 'I encountered an error analyzing that query. As an Ather EV specialist, I can help you with charging feasibility, battery longevity, model comparison, or cost savings. What would you like to verify?',
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
  });
});

// Setup Vite development middleware or static production serving
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

start();
