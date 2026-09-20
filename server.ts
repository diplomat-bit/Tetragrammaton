import dotenv from 'dotenv';
dotenv.config();

import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { app } from './src/server/app';

const PORT = 3000;

async function startServer() {
  // Guarantee ANY unmatched /api/* or /intuit/* request ALWAYS returns JSON and NEVER falls through to Vite SPA index.html
  app.all(['/api', '/api/*', '/intuit', '/intuit/*'], (req, res) => {
    res.status(404).json({
      error: `API route not found: ${req.method} ${req.originalUrl || req.url}`,
      path: req.originalUrl || req.url,
      method: req.method,
      status: 404,
      suggestion: 'Ensure the endpoint URL and HTTP method match the backend API router definition.',
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`QuickBooks OAuth Server running on http://localhost:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error(`Server error on port ${PORT}:`, err);
  });
}

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

startServer();
