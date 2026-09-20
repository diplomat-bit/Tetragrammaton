import { Router, Request, Response } from 'express';

export const stripeAnalyticsRouter = Router();

// In-memory data store for live simulation
let metricsState = {
  grossVolume: 428940.50,
  netVolume: 395120.25,
  newCustomerCount: 142,
  successfulCharges: 2184,
  averageVolumePerUser: 3020.70,
  disputeActivity: 0.12,
  refundVolume: 12450.00,
  billingMRR: 84320.00,
  activeSubscriptions: 890,
  churnRate: 1.8,
  issuingPhysicalCards: 48,
  issuingVirtualCards: 312,
  issuingVolume: 184500.00,
};

function generateTimeSeries(baseVal: number, days = 30, volatility = 0.15) {
  const points = [];
  const now = Date.now();
  let current = baseVal / days;

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now - i * 86400000);
    const dayName = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const change = (Math.random() * 2 - 0.9) * volatility * current;
    current = Math.max(10, current + change);
    points.push({
      date: dayName,
      timestamp: date.toISOString(),
      value: Math.round(current * 100) / 100,
      previousPeriod: Math.round(current * (0.85 + Math.random() * 0.2) * 100) / 100,
    });
  }
  return points;
}

/**
 * GET /ajax/charts/gross_volume
 */
stripeAnalyticsRouter.get('/ajax/charts/gross_volume', (req: Request, res: Response) => {
  const series = generateTimeSeries(metricsState.grossVolume, 30, 0.2);
  return res.json({
    type: 'OpenapiAnalyticsAggregatedMetric',
    runtimePath: '/ajax/charts/gross_volume',
    metric: 'gross_volume',
    currency: 'usd',
    total: metricsState.grossVolume,
    growthPercent: 14.8,
    data: series,
  });
});

/**
 * GET /ajax/charts/net_volume
 */
stripeAnalyticsRouter.get('/ajax/charts/net_volume', (req: Request, res: Response) => {
  const series = generateTimeSeries(metricsState.netVolume, 30, 0.18);
  return res.json({
    type: 'OpenapiAnalyticsAggregatedMetric',
    runtimePath: '/ajax/charts/net_volume',
    metric: 'net_volume',
    currency: 'usd',
    total: metricsState.netVolume,
    growthPercent: 12.4,
    data: series,
  });
});

/**
 * GET /ajax/charts/new_customer_count
 */
stripeAnalyticsRouter.get('/ajax/charts/new_customer_count', (req: Request, res: Response) => {
  const series = generateTimeSeries(metricsState.newCustomerCount, 30, 0.35);
  return res.json({
    type: 'OpenapiAnalyticsAggregatedMetric',
    runtimePath: '/ajax/charts/new_customer_count',
    metric: 'new_customer_count',
    total: metricsState.newCustomerCount,
    growthPercent: 8.2,
    data: series.map(s => ({ ...s, value: Math.max(1, Math.round(s.value / 10)) })),
  });
});

/**
 * GET /ajax/charts/applications/gross_volume
 */
stripeAnalyticsRouter.get('/ajax/charts/applications/gross_volume', (req: Request, res: Response) => {
  const series = generateTimeSeries(metricsState.grossVolume * 0.45, 30, 0.25);
  return res.json({
    type: 'OpenapiAnalyticsAggregatedMetric',
    runtimePath: '/ajax/charts/applications/gross_volume',
    metric: 'applications/gross_volume',
    currency: 'usd',
    total: metricsState.grossVolume * 0.45,
    growthPercent: 22.1,
    connectedAccounts: 28,
    data: series,
  });
});

/**
 * GET /api/stripe/dashboard/metrics
 */
stripeAnalyticsRouter.get('/api/stripe/dashboard/metrics', (req: Request, res: Response) => {
  return res.json({
    success: true,
    engine: 'dashboard.629.52caa70385635309ff5a.min.txt.es',
    metrics: metricsState,
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/stripe/dashboard/issuing/issue-card
 */
stripeAnalyticsRouter.post('/api/stripe/dashboard/issuing/issue-card', (req: Request, res: Response) => {
  const { type = 'virtual', cardholderName = 'Autonomous Agent 01', spendingLimit = 5000 } = req.body;
  
  if (type === 'physical') {
    metricsState.issuingPhysicalCards += 1;
  } else {
    metricsState.issuingVirtualCards += 1;
  }

  const newCard = {
    id: `ic_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    type,
    cardholderName,
    last4: Math.floor(1000 + Math.random() * 9000).toString(),
    expMonth: 12,
    expYear: new Date().getFullYear() + 3,
    status: 'active',
    spendingLimit,
    currency: 'usd',
    created: new Date().toISOString(),
  };

  return res.status(201).json({
    success: true,
    card: newCard,
    currentCounts: {
      physical: metricsState.issuingPhysicalCards,
      virtual: metricsState.issuingVirtualCards,
    },
  });
});
