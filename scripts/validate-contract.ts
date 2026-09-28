import { readFile } from 'node:fs/promises';
import { contractClauses } from '../src/lib/contract/content/clauses.ts';
import { compileContractSource } from '../src/lib/server/contract/compile-contract.ts';

const sourceUrl = new URL('../src/lib/contract/content/document.html', import.meta.url);
const source = await readFile(sourceUrl, 'utf8');
const result = compileContractSource(source, contractClauses);

if (!result.ok) {
	console.error('Contract source validation failed:');
	for (const issue of result.issues) {
		const location =
			issue.line && issue.column ? `${issue.line}:${issue.column}` : 'document';
		console.error(`  ${location} ${issue.message}`);
	}
	process.exitCode = 1;
}
