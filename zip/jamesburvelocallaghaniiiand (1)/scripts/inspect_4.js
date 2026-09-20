import fs from 'fs';
import { transformSync } from 'esbuild';

const files = [
  'components/StructuredPurposeInput.tsx',
  'components/SubscriptionList.tsx',
  'components/TheVisionView.tsx',
  'components/VirtualAccountForm.tsx'
];

for (const file of files) {
  const content = fs.readFileSync(file, 'utf8');
  try {
    transformSync(content, { loader: 'tsx', jsx: 'automatic' });
  } catch (err) {
    console.log(`\n================= ${file} =================`);
    console.log(err.errors ? err.errors.map(e => `${e.location?.line}:${e.location?.column} - ${e.text}`).join('\n') : err.message);
  }
}
