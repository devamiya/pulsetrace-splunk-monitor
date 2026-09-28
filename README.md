# PulseTrace - Home Lending Splunk Telemetry Monitor & Playwright Automation

PulseTrace is an end-to-end telemetry monitoring dashboard and Playwright automation engine designed for financial origination systems (Home Lending Division, `cfgCode=502002`).

---

## 🚀 How to Run the Application

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend API Server (Playwright & Telemetry Streamer)
```bash
node server.js
```
*Backend runs on `http://localhost:3001`*

### 3. Start the Frontend Vite Development Dashboard
```bash
npm run dev
```
*Frontend runs on `http://localhost:5173/`*

---

## ⚡ Quick All-In-One Terminal Launch
Run both servers simultaneously:

```bash
node server.js & npm run dev
```

---

## 🌟 Key Features

- **Executive KPI Summary Bar**: Real-time tracking of *Submitted Apps*, *E2E Completed (Processed Success)*, *Active In-Pipeline*, *E2E Failures & DLQ Exception Alerts*, and *Telemetry Flow*.
- **Interactive Microservice Flow Graph**: Visual progress tracking across 5 origination stages (UI Origination → Flow Adapter → Risk & Fraud → Underwriting → Loan Disbursement).
- **Playwright Automation Runner**: Simulated or real desktop Chromium browser automation (`secure.chase.com`) with background submission mode and error detection.
- **Embedded Splunk Terminal**: Full SPL query engine (`index=risk_fraud_logs | stats count by stage`, `earliest=-15m`) with live log streaming.

