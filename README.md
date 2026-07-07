# Kaduna Health AI: AI-Powered Rural Diagnostic & Outbreak Surveillance System

Kaduna Health AI is a full-stack, responsive digital health platform designed specifically for **Community Health Volunteers (CHVs)** and **District Health Officials** in Kaduna State, Nigeria. 

Operating in low-bandwidth, rural environments, this system leverages advanced, lightweight artificial intelligence (via the **Gemini 3 Flash** model) to assist frontline workers in diagnosing acute childhood illnesses, scanning for malnutrition, tracking local patients, and broadcasting real-time, zero-latency outbreak alerts.

---

## 🌟 Key Product Value & Capabilities

- **Frontline Patient Records**: Move past paper logbooks. Log and access patient histories locally with high-speed key-value offline storage.
- **AI-Powered Diagnostics**: Provide diagnostic assistance to volunteers for pediatric conditions (e.g., Malaria, Pneumonia, Diarrheal diseases) in seconds, utilizing customized local context.
- **Visual Malnutrition Scanning**: Upload an image of a child to evaluate nutritional indicators (wasting, stunting, edema) and retrieve immediate protocol-guided nutritional recommendations.
- **Dynamic Outbreak Monitor**: Automatically scan aggregated health reports across Kaduna districts to map out anomalies, identify risks, and track infection spreads.
- **Web Push Notifications**: Instantly bridge the communication gap between CHVs in rural clinics and officials at district headquarters using standard, persistent browser notifications (Web Push Protocol).

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons, and Motion (for highly readable, hardware-accelerated transitions).
- **Backend (API & Hosting)**: Express v4, Node.js, `tsx` for TypeScript execution, and `esbuild` for bundling the production runtime.
- **Intelligence Engine**: `@google/genai` TypeScript SDK utilizing the `gemini-3-flash-preview` model for schema-controlled JSON outputs.
- **Real-Time Push Protocol**: `web-push` library utilizing VAPID (Voluntary Application Server Identification) credentials for secure browser-independent notification delivery.
- **Client Storage**: Persistent local storage engine with structured data synchronization triggers.

---

## 📁 Repository Structure

```
├── server.ts                 # Full-stack Express backend & Vite middleware handler
├── public/
│   └── sw.js                 # Service Worker listening for push & background notifications
├── src/
│   ├── App.tsx               # Primary single-page routing and tab management
│   ├── main.tsx              # Application client-side entry point
│   ├── index.css             # Global Tailwind stylesheets and font definitions
│   ├── components/
│   │   ├── Dashboard.tsx            # Community health performance indicators & maps
│   │   ├── PatientRegistration.tsx  # Dynamic modal-based patient onboarding
│   │   ├── PatientList.tsx          # Patient cards with expandable diagnostic history
│   │   ├── DiagnosticTool.tsx       # Symptom parser & high-urgency notify triggers
│   │   ├── MalnutritionScanner.tsx  # Multi-modal imaging scanner for wasting / stunting
│   │   ├── AlertDashboard.tsx       # District epidemiological risks & manual push controls
│   │   ├── NotificationManager.tsx  # Header widget managing browser push subscriptions
│   │   └── Layout.tsx               # High-contrast navigation and master wrapper
│   └── services/
│       ├── gemini.ts                # Structured AI queries (diagnostics, malnutrition, alerts)
│       └── patientService.ts        # Local patient persistence & record-tying logic
├── metadata.json             # AI Studio frame permission configs
└── .env.example              # Template documenting essential API keys & VAPID secrets
```

---

## 🚀 Local Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm

### 1. Clone & Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in the root directory:
```bash
cp .env.example .env
```
Fill in the following details:
```env
# Gemini API Access
GEMINI_API_KEY="your-gemini-api-key-here"

# Web Push Keys (VAPID)
VITE_VAPID_PUBLIC_KEY="BHoPMQGjzpxv-Y-5B_oW0d-SbvIvDMeeKdUxrz9B77CcaMyNgbMmPyAkSaBShBYzhcZCITaQ4Qasf6V901DuGD0"
VAPID_PRIVATE_KEY="your-private-vapid-key-here"
```

### 3. Start the Development Server
This boots up the integrated Express + Vite full-stack dev container:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Outbreak Push Notification Workflow (How to Test)

1. **Launch in New Tab**: Since Web Push notifications require secure contexts and are blocked by default in cross-origin iframes, open the application in a **new browser tab** using the external link icon.
2. **Enable Alerts**: Click the **Bell Icon** in the top header. Click "Allow" when the browser requests notification permission.
3. **Simulate Outbreak case**:
   - Go to the **Patients** tab and ensure a patient is registered.
   - Go to the **Diagnostics** tab.
   - Select your registered patient from the dropdown.
   - Input severe symptoms suggesting an outbreak (e.g., *"Sudden watery diarrhea, rapid dehydration, muscle cramps, and extreme fatigue for 2 days in Kaduna South"*).
   - Click **Run Diagnostic Analysis**.
4. **Instant Push**: As soon as the AI classifies the condition (e.g., suspect Cholera) with **high urgency**, the Express backend will broadcast a push payload to your browser. You will receive a system-level notification even if you switch tabs!
5. **District Monitor**: Alternatively, go to the **Outbreak Alerts** tab and click **Broadcast to Districts** on any AI-generated alert card to manually trigger notifications to all connected volunteers.

---

## 🛡️ Guidelines & Production Readiness

- **API Safety**: All calls to the Gemini API are executed server-side to hide the development and production API keys from the client's browser developer console.
- **Strict Typing**: The system is compiled with `--noEmit` and strictly typed in TypeScript to prevent runtime data corruption or silent structural failures in low-bandwidth settings.
- **Offline Resiliency**: Patient registration and clinical histories are saved immediately in persistent storage to ensure work is never lost due to unexpected power or network drops in rural clinics.
