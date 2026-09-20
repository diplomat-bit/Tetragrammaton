import { Router, Request, Response } from 'express';
import crypto from 'crypto';

export const ocallaghanRouter = Router();

interface BlockchainBlock {
  index: number;
  uuid: string;
  timestamp: string;
  hash: string;
  lap: string;
  bitmapSnippet: number[];
  publicKeyPem?: string;
  privateKeyPem?: string;
  signatureHex?: string;
  dataBase64: string;
}

const blockchainLedger: BlockchainBlock[] = [
  {
    index: 1,
    uuid: 'a4b89f21-7290-4c3e-8123-90d12e8736a1',
    timestamp: new Date().toISOString(),
    hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    lap: 'GENESIS_BLOCK',
    bitmapSnippet: [0, 1, 1, 0, 0, 0, 1, 1],
    dataBase64: Buffer.from('Genesis OCallaghan Ledger Root').toString('base64'),
  }
];

ocallaghanRouter.post('/process', async (req: Request, res: Response) => {
  try {
    const { inputContent = 'James OCallaghan Citibank Control Account 05329451 Balance $532,000,000' } = req.body;
    const dataBuffer = Buffer.from(inputContent, 'utf-8');

    const laps = ['PUBLIC_KEY', 'PRIVATE_KEY', 'ECDSA'];
    let privateKeyObj: crypto.KeyObject | null = null;
    let publicKeyObj: crypto.KeyObject | null = null;
    let generatedPrivateKeyPem = '';
    let generatedPublicKeyPem = '';

    const processedBlocks: BlockchainBlock[] = [];

    for (const lap of laps) {
      const hash = crypto.createHash('sha256').update(dataBuffer).digest('hex');
      const uuidVal = crypto.randomUUID();
      const timestamp = new Date().toISOString();
      const base64Data = dataBuffer.toString('base64');

      // Generate bitmap preview (first 32 bits)
      const bitmapSnippet: number[] = [];
      for (let i = 0; i < Math.min(dataBuffer.length, 16); i++) {
        const byte = dataBuffer[i];
        for (let b = 7; b >= 0; b--) {
          bitmapSnippet.push((byte >> b) & 1);
        }
      }

      const block: BlockchainBlock = {
        index: blockchainLedger.length + 1,
        uuid: uuidVal,
        timestamp,
        hash,
        lap,
        bitmapSnippet,
        dataBase64: base64Data,
      };

      if (lap === 'PUBLIC_KEY') {
        const { publicKey, privateKey } = crypto.generateKeyPairSync('ec', {
          namedCurve: 'secp256k1',
        });
        publicKeyObj = publicKey;
        privateKeyObj = privateKey;

        generatedPublicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString();
        block.publicKeyPem = generatedPublicKeyPem;
      } else if (lap === 'PRIVATE_KEY') {
        if (privateKeyObj) {
          generatedPrivateKeyPem = privateKeyObj.export({ type: 'pkcs8', format: 'pem' }).toString();
          block.privateKeyPem = generatedPrivateKeyPem;
        }
        if (generatedPublicKeyPem) {
          block.publicKeyPem = generatedPublicKeyPem;
        }
      } else if (lap === 'ECDSA') {
        if (privateKeyObj) {
          const sign = crypto.createSign('SHA256');
          sign.update(dataBuffer);
          sign.end();
          const signature = sign.sign(privateKeyObj);
          block.signatureHex = signature.toString('hex');
          if (generatedPublicKeyPem) block.publicKeyPem = generatedPublicKeyPem;
        }
      }

      blockchainLedger.push(block);
      processedBlocks.push(block);
    }

    return res.json({
      success: true,
      message: 'O\'Callaghan Algorithm executed successfully across all cryptographic laps and stored to blockchain ledger',
      blocks: processedBlocks,
      total_ledger_height: blockchainLedger.length,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

ocallaghanRouter.get('/ledger', (req: Request, res: Response) => {
  return res.json({
    success: true,
    ledger: blockchainLedger,
    height: blockchainLedger.length,
  });
});
