import React, { useState } from 'react';
import { Card, CardHeader, CardContent, Typography, Button, TextField, Select, MenuItem, Box, Chip } from '@mui/material';

export const WebhookSimulator: React.FC = () => {
  const [eventType, setEventType] = useState('payment_intent.succeeded');
  const [payload, setPayload] = useState(JSON.stringify({
    id: 'evt_' + Math.random().toString(36).substring(2, 11),
    object: 'event',
    type: 'payment_intent.succeeded',
    data: {
      object: {
        id: 'pi_' + Math.random().toString(36).substring(2, 11),
        amount: 50000,
        currency: 'usd',
        status: 'succeeded'
      }
    }
  }, null, 2));
  const [logs, setLogs] = useState<string[]>([]);

  const handleSimulate = () => {
    setLogs(prev => [
      `[${new Date().toLocaleTimeString()}] Simulated event: ${eventType} dispatched to internal bus`,
      ...prev
    ]);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Webhook Event Simulation & Dispatch Engine
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Simulate asynchronous Stripe, Plaid, Citibank, and ISO 20022 webhook deliveries.
      </Typography>

      <Card sx={{ bgcolor: '#111827', color: '#f3f4f6', border: '1px solid #374151', mb: 3 }}>
        <CardHeader title="Dispatch Webhook Payload" />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Select
            value={eventType}
            onChange={e => setEventType(e.target.value)}
            sx={{ bgcolor: '#1f2937', color: '#fff' }}
          >
            <MenuItem value="payment_intent.succeeded">payment_intent.succeeded</MenuItem>
            <MenuItem value="transfer.created">transfer.created</MenuItem>
            <MenuItem value="charge.dispute.created">charge.dispute.created</MenuItem>
            <MenuItem value="customer.subscription.updated">customer.subscription.updated</MenuItem>
            <MenuItem value="pacs.008.001.08">ISO 20022 pacs.008 Credit Transfer</MenuItem>
          </Select>

          <TextField
            multiline
            rows={8}
            value={payload}
            onChange={e => setPayload(e.target.value)}
            sx={{
              bgcolor: '#1f2937',
              '& .MuiInputBase-input': { color: '#38bdf8', fontFamily: 'monospace', fontSize: '13px' }
            }}
          />

          <Button variant="contained" color="primary" onClick={handleSimulate}>
            Trigger Webhook Event
          </Button>
        </CardContent>
      </Card>

      <Card sx={{ bgcolor: '#111827', color: '#f3f4f6', border: '1px solid #374151' }}>
        <CardHeader title="Simulated Event Log" />
        <CardContent>
          {logs.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No events dispatched yet.</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {logs.map((log, idx) => (
                <Chip key={idx} label={log} sx={{ bgcolor: '#1e293b', color: '#38bdf8', justifyContent: 'flex-start' }} />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default WebhookSimulator;
