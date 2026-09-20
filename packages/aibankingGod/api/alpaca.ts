import { Router } from "express";
import type { Request, Response } from "express";
import { getAlpaca } from "../services/serverHelpers.js";

const router = Router();

router.get("/api/v1/alpaca/positions", async (req: Request, res: Response) => {
  try {
    const alpaca = getAlpaca();
    const positions = await alpaca.getPositions();
    res.json(positions);
  } catch (error: any) {
    console.error("Alpaca Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/alpaca/positions/close", async (req: Request, res: Response) => {
  try {
    const { symbol } = req.body || {};
    const alpaca = getAlpaca();
    const result = await alpaca.closePosition(symbol);
    res.json(result);
  } catch (error: any) {
    console.error("Alpaca Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/alpaca/positions/close-all", async (req: Request, res: Response) => {
  try {
    const alpaca = getAlpaca();
    const result = await alpaca.closeAllPositions();
    res.json(result);
  } catch (error: any) {
    console.error("Alpaca Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/api/v1/alpaca/account", async (req: Request, res: Response) => {
  try {
    const alpaca = getAlpaca();
    const account = await alpaca.getAccount();
    res.json(account);
  } catch (error: any) {
    console.error("Alpaca Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/api/v1/alpaca/orders", async (req: Request, res: Response) => {
  try {
    const alpaca = getAlpaca();
    const order = await alpaca.createOrder(req.body);
    res.json(order);
  } catch (error: any) {
    console.error("Alpaca Error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
