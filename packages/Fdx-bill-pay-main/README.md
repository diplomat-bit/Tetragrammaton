# Citi FDX BillPay Dashboard

A sleek, full-stack dashboard application designed to integrate securely with the Citi Sandbox FDX API. It allows users to manage payees, track payments, and monitor API telemetry (latency, request counts) in real-time through rich data visualizations.

## Features

- **Secure API Proxy:** Utilizes an Express backend to proxy requests to the Citi FDX API, ensuring sensitive tokens and recipient IDs are never exposed to the client browser.
- **Payee & Payment Management:** Fetches and displays raw JSON payload data for Payees and Payments in beautifully styled, responsive tables.
- **Telemetry Tracking:** Monitors API latency and request frequency automatically, displaying historical data via Recharts area and bar charts.
- **Sleek Interface:** Built with a high-contrast, premium dark mode aesthetic (Slate & Indigo palettes).
- **Persistent Local Context:** Automatically saves the active username and telemetry logs to local storage to persist state between reloads.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (v4)
- **Visualizations:** Recharts
- **Icons:** Lucide React
- **Backend:** Express.js (Node.js)

## Environment Variables & Setup

This application requires specific environment variables to authenticate with the Citi FDX API. In Google AI Studio, add the following to your **Settings > Secrets**:

- `CITI_API_TOKEN`: Your authorization token for the Citi Sandbox. **(Enter the token *without* the word "Bearer ", the server handles that automatically)**
- `FDX_API_ACTOR_TYPE`: The actor type for the API (default is usually `USER`).
- `FDX_API_DATA_RECIPIENT_ID`: Your registered data recipient ID.
- `X_FAPI_INTERACTION_ID`: The FAPI interaction ID for tracing.

*Note: If these variables are not provided, the dashboard will display a connection error prompting you to add them.*

## Project Structure

- `server.ts`: The Express backend entry point containing the `/api/payees` and `/api/payments` secure proxy routes.
- `src/App.tsx`: The main React application containing the dashboard layout, charts, and data tables.
- `src/utils.ts`: Tailwind utility functions for class merging (`cn`).
- `package.json`: Contains the build and dev scripts designed to bundle both the frontend Vite app and the backend Express server into a production-ready container.
