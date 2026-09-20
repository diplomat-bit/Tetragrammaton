import fs from 'fs';

const targetFiles = [
  'components/StructuredPurposeInput.tsx',
  'components/SubscriptionList.tsx',
  'components/TheVisionView.tsx',
  'components/VirtualAccountForm.tsx',
  'hooks/useNotifications.ts',
  'hooks/useSettings.ts',
  'integrations/wellsfargo/hooks/useWellsFargoData.ts',
  'packages/shared-kernel/src/event-bus/InternalEventEmitter.ts'
];

for (const file of targetFiles) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const orig = content;
    // Strip leading ```typescript / ```tsx / ```ts / ```javascript / ```js / ```
    content = content.replace(/^```[a-zA-Z0-9_-]*\r?\n/, '');
    // Strip trailing ```
    content = content.replace(/\r?\n```\s*$/, '');
    // If there are any stray ``` at start/end of file lines
    const lines = content.split('\n');
    while (lines.length > 0 && lines[0].trim().startsWith('```')) {
      lines.shift();
    }
    while (lines.length > 0 && lines[lines.length - 1].trim().startsWith('```')) {
      lines.pop();
    }
    content = lines.join('\n');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned ${file}`);
  }
}
