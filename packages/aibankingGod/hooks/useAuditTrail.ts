import { useCallback } from 'react';

/**
 * Custom hook for writing to the Forensic Obsidian Ledger (Git-backed simulation).
 */
export const useAuditTrail = () => {
  const logEvent = useCallback(async (actor: string, action: string, details: string, level: 'INFO' | 'WARNING' | 'CRITICAL' = 'INFO') => {
    const timestamp = new Date().toISOString();
    const forensicBlock = {
      timestamp,
      actor,
      action,
      details,
      level,
      hash: await generateForensicHash(timestamp + actor + action + details),
      integrity: 'VERIFIED'
    };

    console.log('Forensic Obsidian Ledger Entry:', forensicBlock);
    
    // Simulate writing to a persistent Git-backed storage
    try {
      await fetch('/api/audit/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(forensicBlock)
      });
    } catch (e) {
      // Fallback for demo
      const existingLogs = JSON.parse(localStorage.getItem('FORENSIC_LEDGER') || '[]');
      existingLogs.push(forensicBlock);
      localStorage.setItem('FORENSIC_LEDGER', JSON.stringify(existingLogs));
    }
  }, []);

  return { logEvent };
};

async function generateForensicHash(data: string) {
  const msgBuffer = new TextEncoder().encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}
