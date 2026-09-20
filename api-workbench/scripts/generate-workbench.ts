import fs from 'fs';
import path from 'path';
import { parseSpecFile, WorkbenchCatalog, ParsedSpec } from './parser';
import { generateAllArtifacts } from './codegen';

async function main() {
  console.log('================================================================');
  console.log('🚀 Automated Multi-Spec API & XSD Documentation Workbench Generator');
  console.log('================================================================');

  const rootDir = process.cwd();
  const sourceSpecsDir = path.join(rootDir, 'api-workbench', 'source_specs');
  const generatedDir = path.join(rootDir, 'api-workbench', 'generated');

  if (!fs.existsSync(sourceSpecsDir)) {
    console.error(`❌ Source specs directory not found: ${sourceSpecsDir}`);
    process.exit(1);
  }

  console.log(`📁 Scanning directory: ${sourceSpecsDir}...`);
  const files = fs.readdirSync(sourceSpecsDir);
  console.log(`Found ${files.length} potential specification files.`);

  const parsedSpecs: ParsedSpec[] = [];
  let totalEndpoints = 0;
  let totalXsdTypes = 0;
  let totalServers = 0;

  for (const file of files) {
    const filePath = path.join(sourceSpecsDir, file);
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) continue;

      process.stdout.write(`  - Parsing: ${file.padEnd(50)} `);
      const parsed = parseSpecFile(filePath);
      if (parsed) {
        parsedSpecs.push(parsed);
        const epCount = parsed.endpoints.length;
        const srvCount = parsed.servers.length;
        const xsdCount = parsed.xsdDetails
          ? (parsed.xsdDetails.complexTypes.length +
             parsed.xsdDetails.simpleTypes.length +
             parsed.xsdDetails.elements.length +
             parsed.xsdDetails.groups.length +
             (parsed.xsdDetails.attributeGroups?.length || 0))
          : 0;

        totalEndpoints += epCount;
        totalServers += srvCount;
        totalXsdTypes += xsdCount;

        console.log(`✅ [${parsed.format.toUpperCase()}] ${epCount} endpoints | ${xsdCount} XSD types | ${srvCount} servers`);
      } else {
        console.log(`⚠️ (Skipped: unsupported format)`);
      }
    } catch (err: any) {
      console.log(`❌ (Error: ${err.message})`);
    }
  }

  const catalog: WorkbenchCatalog = {
    generatedAt: new Date().toISOString(),
    totalSpecs: parsedSpecs.length,
    totalEndpoints,
    totalXsdTypes,
    totalServers,
    specs: parsedSpecs,
  };

  console.log('\n📦 Generating automated artifacts into api-workbench/generated/...');
  const { filesGenerated } = generateAllArtifacts(catalog, generatedDir);

  console.log('✅ Generated files:');
  filesGenerated.forEach(f => console.log(`   - ${path.relative(rootDir, f)}`));

  console.log('\n================================================================');
  console.log('🎉 WORKBENCH GENERATION COMPLETE');
  console.log(`📊 Total Specifications Parsed: ${parsedSpecs.length}`);
  console.log(`🌐 Total API Endpoints Indexed: ${totalEndpoints}`);
  console.log(`📑 Total XSD Schema Types:      ${totalXsdTypes}`);
  console.log(`🖥️ Total Server Base URLs:      ${totalServers}`);
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('Fatal error running workbench generator:', err);
  process.exit(1);
});
