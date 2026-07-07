# Kaduna Health AI: UX/UI Design Specifications

This document outlines the visual system, styling tokens, interface architectures, user flows, and design decisions governing the Kaduna Health AI application. It serves as a unified reference for product designers, UX researchers, and developers to ensure visual consistency and high accessibility in frontline environments.

---

## 🎨 Visual Identity & Theme System

The design is engineered around a **Modern Swiss-Industrial Minimalist Aesthetic**. It prioritizes high contrast, generous whitespace, clear structural grids, and elegant, human-centric font pairing.

We intentionally reject standard "medical corporate blue/purple" templates. Instead, we use a stark, high-contrast, publication-grade theme built to feel highly professional, humble, and clean.

### Core Color Palette (The "Cosmic Slate" Palette)

Our colors are strictly bounded to maintain elite typography contrast and ease of reading on low-grade mobile screens under direct sunlight.

| Color Name | Hex Code | Tailwind Equivalent | Purpose |
| :--- | :--- | :--- | :--- |
| **Deep Charcoal** | `#141414` | `bg-[#141414]` / `text-[#141414]` | Primary headings, active UI components, structural borders, primary buttons |
| **Warm Sand** | `#F5F5F0` | `bg-[#F5F5F0]` | Master canvas background (relaxing, eye-safe, reduces glare) |
| **Pure White** | `#FFFFFF` | `bg-white` | Card backgrounds, headers, interactive fields, content cards |
| **Alert Red** | `#EF4444` | `bg-red-500` / `bg-red-600` | High-urgency triage states, outbreak notifications, critical actions |
| **Warning Orange**| `#F97316` | `bg-orange-500` | Medium-urgency triage, warning banners, suspicious indicators |
| **Protocol Blue** | `#3B82F6` | `bg-blue-500` | Low-urgency indicators, general info, informational protocol prompts |

---

## ✍️ Typography & Font Pairing

To reinforce structural elegance and high-grade editorial readability, we employ two highly intentional families:

1. **Serif (Display Headings)**:
   * **Font**: *Playfair Display* or standard high-contrast system Serif.
   * **Implementation**: `font-serif italic text-xl sm:text-2xl font-medium tracking-tight text-[#141414]`
   * **Purpose**: Page headers, primary component titles, diagnoses, and focal UI landmarks. Gives the product a humanistic, caring, and authoritative tone.
   
2. **Sans-Serif (User Interface Body)**:
   * **Font**: *Inter* or standard system UI sans-serif.
   * **Implementation**: `font-sans text-sm tracking-normal leading-relaxed`
   * **Purpose**: Form inputs, medical protocol actions, descriptive bodies, descriptions. Ensures high legibility at small sizes.
   
3. **Monospace (Systems, Metadata & Indicators)**:
   * **Font**: *JetBrains Mono* or *Fira Code*.
   * **Implementation**: `font-mono text-[10px] uppercase tracking-widest`
   * **Purpose**: Status labels, timers, micro-badges, confidence ratings, and district names. Keeps system-related tags visually separated from medical copy.

---

## 👥 Targeted User Personas

To build high-value software, our UX flows are optimized for two primary user groups working in distinct contexts within Kaduna State.

### Persona A: The Frontline Worker (Community Health Volunteer - CHV)
* **Demographics**: 20–45 years old, based in rural settlements (e.g., outskirts of Kaduna South or Igabi).
* **Context**: Handles dozens of daily child welfare check-ins under significant pressure. Frequently encounters poor cellular reception, low-light clinic rooms, and varying screen displays.
* **Goal**: Quickly register new infants, record symptoms, and get immediate, protocol-compliant AI diagnostic and nutrition triage.
* **UX Solution**: 
  * Massive touch targets (min 44px) for all buttons and select fields.
  * Simple, text-area symptom box allowing conversational input rather than rigid drop-down codes.
  * Local, immediate storage: never loses entered patient data on page refresh or brief network outage.

### Persona B: The District Health Official (Health Administration)
* **Demographics**: 35–60 years old, based at a district headquarters office.
* **Context**: Oversees public health trends, manages local resources, and tracks potential infection spreads (cholera, malaria outbreaks).
* **Goal**: Monitor real-time disease metrics, identify spikes in cases, and quickly dispatch health advisories to the field.
* **UX Solution**:
  * Real-time dashboard view highlighting critical metrics at a glance.
  * Distinct, eye-catching notification trays.
  * A single-click "Broadcast to Districts" feature to immediately push safety briefs out to all volunteers in seconds.

---

## 🧭 Interface Layouts & Adaptive Navigation

### Desktop Layout
- **Left Navigation**: Fixed 64-width sidebar, styled with highly visible mono tracking. High-contrast indicators clearly frame the active tab.
- **Main Section**: Adaptive, centered layout (`max-w-7xl mx-auto`) framed with generous negative space to minimize cognitive load.
- **Top Bar**: Sticky header displaying the product identity, geographic region boundary, and the Web Push Bell icon for quick permission management.

### Mobile Adaptive Layout
- **Bottom Navigation**: Mobile-first grid anchored to the bottom. Each icon is paired with high-contrast text labels optimized for 44px thumb touch zones.
- **Header**: Compact header featuring the bell notifications widget and user role avatar for easy access on small mobile screens.

---

## ✨ Micro-Animations & State Transitions

All dynamic states (tab switches, loading sequences, modal presentations) are driven by hardware-accelerated transitions via the `motion` framework:

1. **Diagnostic Processing State**:
   * A clean, circular loader paired with uppercase, spacing-shifted text: `ANALYZING DISTRICT DATA...`
   * Prevents double-submission and gives users a sense of technical rigor.
2. **Analysis Result Slide-In**:
   * Emerges from a 20px vertical offset with a subtle easing transition (`initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}`).
   * Attracts immediate visual focus to the diagnosis and urgency badge.
3. **Notification Badge Pulse**:
   * Subscribed notification indicators feature a soft green pulse animation (`animate-pulse`) representing active, live-connected security channels.
