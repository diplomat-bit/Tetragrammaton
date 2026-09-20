import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { recordBridgeEvent, QuickBooksLinkedRecord } from './intuit/quickbooks-bridge.ts';

export const visaApiRouter = Router();

// In-memory store for recent webhooks
export const recentVisaWebhooks: any[] = [];

/**
 * Handle incoming Visa Webhooks and map them to QuickBooks Bridge Ledger
 */
const handleVisaWebhook = (req: Request, res: Response) => {
  try {
    const eventPayload = req.body;
    // Visa often sends a custom signature header depending on the specific API product
    const signature = req.headers['x-pay-token'] || req.headers['authorization'] || 'no-signature';
    const eventId = `VISA-WH-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Extract the event type. Visa may send it as eventType, eventName, or type depending on the product
    const eventType = eventPayload?.eventType || eventPayload?.eventName || eventPayload?.type || 'unknown.event';

    let action: QuickBooksLinkedRecord['action'] = 'WEBHOOK_RECEIVED';
    let summary = 'Visa Webhook Received';

    // Map specific Visa events to QuickBooks Bridge Ledger actions
    switch(eventType) {
      // 1. Token Management
      case 'tms.networktoken.provisioned': action = 'VISA_TOKEN_PROVISIONED'; summary = 'Visa Network Token Provisioned'; break;
      case 'tms.networktoken.updated': action = 'VISA_TOKEN_UPDATED'; summary = 'Visa Network Token Updated'; break;
      
      // 2. Recurring Billing
      case 'rbs.subscriptions.charge.created': action = 'VISA_SUB_CHARGE_CREATED'; summary = 'Visa Recurring Billing Charge Created'; break;
      case 'rbs.subscriptions.charge.pre-notified': action = 'VISA_SUB_CHARGE_PRENOTIFIED'; summary = 'Visa Recurring Billing Charge Pre-Notified'; break;
      case 'rbs.subscriptions.charge.failed': action = 'VISA_SUB_CHARGE_FAILED'; summary = 'Visa Recurring Billing Charge Failed'; break;
      
      // 3. payByLink
      case 'payByLink.customer.payment': action = 'VISA_PAY_BY_LINK_CUST_PAYMENT'; summary = 'Visa PayByLink Customer Payment Received'; break;
      case 'payByLink.merchant.payment': action = 'VISA_PAY_BY_LINK_MERCH_PAYMENT'; summary = 'Visa PayByLink Merchant Payment Processed'; break;
      
      // 4. unifiedCheckout
      case 'uc.orders.transactionresults': action = 'VISA_UNIFIED_CHECKOUT_RESULT'; summary = 'Visa Unified Checkout Transaction Result'; break;
      
      // 5. customerInvoicing
      case 'invoicing.customer.invoice.cancel': action = 'VISA_INVOICE_CANCELLED'; summary = 'Visa Customer Invoice Cancelled'; break;
      case 'invoicing.customer.invoice.reminder': action = 'VISA_INVOICE_REMINDER'; summary = 'Visa Customer Invoice Reminder Sent'; break;
      case 'invoicing.customer.invoice.paid': action = 'VISA_INVOICE_PAID'; summary = 'Visa Customer Invoice Paid in Full'; break;
      case 'invoicing.customer.invoice.overdue-reminder': action = 'VISA_INVOICE_OVERDUE'; summary = 'Visa Customer Invoice Overdue Reminder Sent'; break;
      case 'invoicing.customer.invoice.send': action = 'VISA_INVOICE_SENT'; summary = 'Visa Customer Invoice Sent'; break;
      case 'invoicing.customer.invoice.partial-payment': action = 'VISA_INVOICE_PARTIAL_PAYMENT'; summary = 'Visa Customer Invoice Partial Payment Received'; break;
      
      default: 
        summary = `Visa Webhook Event: ${eventType}`;
        break;
    }

    const webhookRecord = {
      id: eventId,
      timestamp: new Date().toISOString(),
      eventType,
      headers: req.headers,
      signature,
      payload: eventPayload,
    };

    // Store in memory for UI viewing
    recentVisaWebhooks.unshift(webhookRecord);
    if (recentVisaWebhooks.length > 100) recentVisaWebhooks.pop();

    // Sync this webhook to the QuickBooks Bridge Ledger
    try {
      recordBridgeEvent({
        source: 'VISA_WEBHOOK',
        action,
        externalEntityId: eventId,
        amount: eventPayload?.amount || eventPayload?.transactionAmount || 0,
        currency: eventPayload?.currency || eventPayload?.currencyCode || 'USD',
        status: 'LOCKED_INTO_QUICKBOOKS',
        summary,
        rawPayload: webhookRecord,
      });
    } catch (bridgeErr: any) {
      console.warn('Bridge ledger notice (Visa Webhook):', bridgeErr.message);
    }

    // Acknowledge receipt to Visa (Visa generally requires 200 OK for successful delivery)
    return res.status(200).json({
      status: 'Success',
      message: 'Visa Webhook received and ingested successfully.',
      eventId,
      recognizedEventType: eventType
    });
  } catch (err: any) {
    console.error('Visa Webhook Processing Error:', err.message);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

/**
 * POST /api/visa/webhook
 * Visa Webhook Ingestion Endpoint
 */
visaApiRouter.post('/webhook', handleVisaWebhook);

/**
 * POST /api/visa/webhook/logs
 * Handle cases where the user explicitly registers the /webhook/logs URL as the POST receiver
 */
visaApiRouter.post('/webhook/logs', handleVisaWebhook);

/**
 * GET /api/visa/webhook/logs
 * Retrieve recent Visa Webhook logs
 */
visaApiRouter.get('/webhook/logs', (req: Request, res: Response) => {
  res.json({
    success: true,
    count: recentVisaWebhooks.length,
    events: recentVisaWebhooks
  });
});
