import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createHash } from 'node:crypto';
const source = process.argv.find(arg => arg.startsWith('--source='))?.slice(9);
if (!source) throw new Error('Use --source=/path/to/crm/lib/ai/sales-journey/engine.ts [--check]');
const target = resolve('src/lib/sales-journey/engine.ts');
const contents = await readFile(resolve(source));
if (process.argv.includes('--check')) {
  if (!contents.equals(await readFile(target))) throw new Error('Simulator and bot journey differ. Run sync before release.');
} else { await mkdir(dirname(target), { recursive: true }); await writeFile(target, contents); }
console.log(`Journey ${process.argv.includes('--check') ? 'verified' : 'synced'} SHA256 ${createHash('sha256').update(contents).digest('hex')}`);
