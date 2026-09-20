import express from "express";
import cors from "cors";

import alpacaRouter from "./alpaca.js";
import stripeRouter from "./stripe.js";
import mtRouter from "./modern-treasury.js";
import plaidRouter from "./plaid.js";
import citiRouter from "./citi.js";
import azureRouter from "./azure.js";
import aiRouter from "./ai.js";
import fapiRouter from "./fapi.js";
import sovereignRouter from "./sovereign.js";
import googleChatRouter from "./google-chat.js";
import configRouter from "./config.js";

const app = express();

app.use(cors());

// COOP/COEP Headers adjusted for Plaid Link & Stripe Checkout redirects
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "unsafe-none");
  res.setHeader("X-Runtime-Integrity", "Hardware-Bound");
  next();
});

// Note: webhook endpoints like Stripe / MT / OFX handle raw/text parsing inside their routers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Mount API Routers
app.use(alpacaRouter);
app.use(stripeRouter);
app.use(mtRouter);
app.use(plaidRouter);
app.use(citiRouter);
app.use(azureRouter);
app.use(aiRouter);
app.use(fapiRouter);
app.use(sovereignRouter);
app.use(googleChatRouter);
app.use(configRouter);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", system: "Aquarius Sovereign Vercel Engine" });
});

export default app;
