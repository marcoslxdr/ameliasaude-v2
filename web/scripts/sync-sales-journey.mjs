import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname, basename, join } from 'node:path';
import { createHash } from 'node:crypto';
const source = process.argv.find(arg => arg.startsWith('--source='))?.slice(9);
if (!source || basename(source) !== 'engine.ts') throw new Error('Use --source=/path/to/crm/lib/ai/sales-journey/engine.ts [--check]');
const checking = process.argv.includes('--check');
// Read every source first; a missing companion must not leave a partial copy.
const files = await Promise.all(['engine.ts', 'materials.ts'].map(async name => ({
  name, contents: await readFile(join(dirname(resolve(source)), name)),
  target: resolve('src/lib/sales-journey', name),
})));
if (checking) {
  for (const file of files) {
    if (!file.contents.equals(await readFile(file.target))) throw new Error(`Simulator and bot ${file.name} differ. Run sync before release.`);
  }
} else {
  await mkdir(dirname(files[0].target), { recursive: true });
  for (const file of files) await writeFile(file.target, file.contents);
}
for (const file of files) console.log(`Journey ${file.name} ${checking ? 'verified' : 'synced'} SHA256 ${createHash('sha256').update(file.contents).digest('hex')}`);
