# Kaduna Health AI: Architecture & Integration Workflows

This document outlines the system architecture, integration layers, database models, and critical workflows for the Kaduna Health AI application. It is designed to assist software engineers, backend teams, and district technical administrators in understanding how data flows throughout the product.

---

## 🗺️ System Topology

```
+--------------------------------------------------------------------------------------------------+
|                                     CLIENT WEB BROWSER                                           |
|                                                                                                  |
|   +-----------------------+     +------------------------+     +-----------------------------+   |
|   |   React UI Components | <-> | Patient Local Storage  | <-> |  NotificationManager        |   |
|   |   (Tailwind, Lucide)  |     | (JSON Stringified key) |     |  (Service Worker API Client)|   |
|   +-----------------------+     +------------------------+     +-----------------------------+   |
|               ^                                                               |                  |
|               | (Vite Assets proxy)                                           |                  |
+---------------+---------------------------------------------------------------+------------------+
                |                                                               |
                v                                                               v (Push Subscriptions)
+--------------------------------------------------------------------------------------------------+
|                                  EXPRESS FULL-STACK SERVER (Node.js)                             |
|                                                                                                  |
|   +-----------------------+     +------------------------+     +-----------------------------+   |
|   |    Vite Dev/Prod      |     |  Express API Router    |     |  web-push Engine            |   |
|   |    Middleware         |     |  - /api/subscribe      |     |  - VAPID Cryptography       |   |
|   |    (Static files dist)|     |  - /api/notify-all     |     |  - Subscription Array Store |   |
|   +-----------------------+     +------------------------+     +-----------------------------+   |
+---------------+-----------------------------+----------------------------------------------------+
                |                             |
                | (Server API proxy)          | (Google GenAI API Protocol)
                v                             v
+-------------------------------+ +----------------------------------------------------------------+
|  BROWSER NOTIFICATION SYSTEM  | |                    GOOGLE GEMINI API GATEWAY                   |
|                               | |                                                                |
|  [Push Service]               | |  Model: 'gemini-3-flash-preview'                               |
|  - Relays encrypted payload   | |  Outputs: Pure structured JSON conforming to specified Schema  |
|  - Triggers Browser Tray UI   | |                                                                |
+-------------------------------+ +----------------------------------------------------------------+
```

---

## 🔄 Core Engineering Workflows

### 1. Symptom Diagnosis & Auto-Alert Pipeline

This workflow describes how a Community Health Volunteer processes symptoms, retrieves an AI-driven triage decision, ties the record to a client, and triggers a system-wide alert if an epidemiological threat is identified.

```
 CHV (Browser Client)                Express Server                  Gemini API               Subscribed Officials
         |                                 |                             |                             |
         | 1. Submit symptoms &            |                             |                             |
         |    Patient ID                   |                             |                             |
         |-------------------------------->|                             |                             |
         |                                 | 2. Proxy request with       |                             |
         |                                 |    GEMINI_API_KEY           |                             |
         |                                 |---------------------------->|                             |
         |                                 |                             | 3. Validate context,        |
         |                                 |                             |    generate structured JSON |
         |                                 |                             |<----------------------------|
         |                                 | 4. Parse result             | (Return JSON: Urgency level)|
         |                                 |<----------------------------|                             |
         | 5. Return diagnosis             |                             |                             |
         |<--------------------------------|                             |                             |
         |                                 |                             |                             |
         |--+                              |                             |                             |
         |  | 6. Save locally to patient   |                             |                             |
         |  |    diagnostic records array  |                             |                             |
         |<--                              |                             |                             |
         |                                 |                             |                             |
         | 7. IF Urgency == "high"         |                             |                             |
         |    (Trigger Auto-Alert)         |                             |                             |
         |-------------------------------->|                             |                             |
         |                                 | 8. Fetch subscription keys  |                             |
         |                                 |--+                          |                             |
         |                                 |  | Encrypt payloads         |                             |
         |                                 |<-- with VAPID Private Key   |                             |
         |                                 |                             |                             |
         |                                 | 9. Broadcast Push Alert     |                             |
         |                                 |---------------------------------------------------------->|
         |                                 |                             | (Render Alert Tray Tray)    |
```

### 2. Manual Outbreak Alert Trigger (District Level)

District health monitors use the Outbreak Dashboard to track state-wide reports. When they confirm an anomaly, they can manually dispatch targeted protocol warnings back to field CHVs.

```
District Monitor Component            Express Server                 Service Worker (sw.js)            CHV Device
         |                                 |                                 |                             |
         | 1. Click "Broadcast"            |                                 |                             |
         |-------------------------------->|                                 |                             |
         |                                 | 2. Load Subscription Endpoints  |                             |
         |                                 |--+                              |                             |
         |                                 |  | Map through active users     |                             |
         |                                 |<--                              |                             |
         |                                 |                                 |                             |
         |                                 | 3. Dispatch webpush payload     |                             |
         |                                 |-------------------------------->|                             |
         |                                 |                                 | 4. Push event intercepted   |
         |                                 |                                 |--+                          |
         |                                 |                                 |  | registration.show...     |
         |                                 |                                 |<--                          |
         |                                 |                                 |                             |
         |                                 |                                 | 5. Show push notification   |
         |                                 |                                 |---------------------------->|
```

---

## 🗄️ System Schema Definitions

### 1. Patient Profile Model (`Patient`)
Stored as stringified JSON under key `kaduna_health_patients` in Client LocalStorage.

```typescript
interface Patient {
  id: string;               // UUID v4
  name: string;             // Full name
  age: string;              // Text input (e.g., "3 years", "18 months")
  gender: string;           // Male / Female / Other
  address: string;          // Household / Settlement coordinates or name
  phone: string;            // Primary caregiver contact number
  registeredAt: string;     // ISO 8601 string
  diagnostics?: DiagnosticRecord[]; // Historical AI diagnosis records linked to patient
}
```

### 2. Diagnostic Log Model (`DiagnosticRecord`)
Conforms to the strict JSON schema required from the Gemini API gateway.

```typescript
interface DiagnosticRecord {
  id: string;               // UUID v4
  timestamp: string;        // ISO 8601 string
  symptoms: string;         // Plain-text input entered by volunteer
  condition: string;        // Primary disease identified (e.g., "Suspected Malaria")
  confidence: number;       // Value between 0.00 and 1.00 representing confidence
  recommendation: string;   // Local treatment protocol guidelines
  urgency: "low" | "medium" | "high"; // Triage classification
}
```

### 3. Web Push Subscription Model
Saved dynamically in the backend server's active subscriptions stack.

```typescript
interface PushSubscription {
  endpoint: string;         // Unique registration URL hosted by push service (Chrome/Firefox/Safari)
  expirationTime: null | number;
  keys: {
    p256dh: string;         // Client's elliptic-curve public key
    auth: string;           // Symmetric authentication secret
  };
}
```

---

## 🔌 API Route Specifications

### `GET /api/health`
Simple service health checker.
- **Response**: `200 OK`
- **Body**: `{ "status": "ok" }`

### `POST /api/subscribe`
Registers a client browser subscription endpoint with the server.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**: `PushSubscription` object.
- **Response**: `201 Created`
- **Body**: `{ "message": "Subscription added successfully" }`

### `POST /api/notify-all`
Dispatches an encrypted notification payload to all registered web-push clients.
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "title": "Alert Title Here",
    "body": "Detailed notification body here.",
    "icon": "/icon.png",
    "data": { "additional": "metadata" }
  }
  ```
- **Response**: `200 OK`
- **Body**: `{ "message": "Notifications sent", "count": 24 }`
- **Behavior**: Automatically catches expired subscription errors (`410 Gone`, `401 Unauthorized`) and purges stale endpoints from the backend memory store to maximize communication efficiency.
