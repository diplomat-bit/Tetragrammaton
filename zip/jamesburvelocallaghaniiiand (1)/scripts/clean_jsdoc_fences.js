import fs from 'fs';

const files = [
  'hooks/useNotifications.ts',
  'hooks/useSettings.ts',
  'integrations/wellsfargo/hooks/useWellsFargoData.ts',
  'packages/shared-kernel/src/event-bus/InternalEventEmitter.ts'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/```[a-zA-Z0-9_-]*/g, '').replace(/```/g, '');
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Cleaned JSDoc backticks in ${file}`);
  }
}
