import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import { contractClauses } from '../src/lib/contract/content/clauses.ts';
import type { ClauseRegistry } from '../src/lib/contract/model.ts';
import {
	resolveContract,
	type ResolvedContractDocument
} from '../src/lib/contract/resolve.ts';
import { compileContractSource } from '../src/lib/server/contract/compile-contract.ts';

const testClauses = {
	intro: {
		title: 'Introduction',
		highlightTone: 'informational',
		widget: {
			type: 'faq',
			intro: 'Test content.',
			items: [
				{
					id: 'test-question',
					question: 'Test question?',
					answer: [{ parts: [{ type: 'text', text: 'Test answer.' }] }]
				}
			]
		}
	}
} satisfies ClauseRegistry;

const validSource = `<h1 id="test-contract">Test Contract</h1>
<p><contract-clause id="intro">Text.</contract-clause></p>
<contract-signatures provider="Provider" customer="Customer"></contract-signatures>`;

function resolvedText(document: ResolvedContractDocument): string {
	const parts: string[] = [];
	for (const block of document.blocks) {
		if (block.type === 'signature-grid') {
			parts.push(block.title, ...block.parties.map((party) => party.name));
			continue;
		}
		parts.push(block.content.map((node) => node.value).join(''));
	}
	return parts.join('\n');
}

describe('contract smoke tests', () => {
	it('reports invalid markup and recovers in the same process', () => {
		assert.equal(compileContractSource(validSource, testClauses).ok, true);

		const failure = compileContractSource(
			`<h1 id="test-contract">Test Contract</h1>
<p><script>Not allowed.</script></p>
<contract-signatures provider="Provider" customer="Customer"></contract-signatures>`,
			testClauses
		);

		assert.equal(failure.ok, false);
		if (failure.ok) return;
		assert.equal(
			failure.issues.some((issue) => issue.code === 'unsupported-inline-content'),
			true
		);
		assert.equal(
			failure.issues.every((issue) => (issue.line ?? 0) > 0 && (issue.column ?? 0) > 0),
			true
		);
		assert.equal(compileContractSource(validSource, testClauses).ok, true);
	});

	it('compiles and resolves the current contract', async () => {
		const source = await readFile(
			new URL('../src/lib/contract/content/document.html', import.meta.url),
			'utf8'
		);
		const result = compileContractSource(source, contractClauses);

		assert.equal(
			result.ok,
			true,
			result.ok ? undefined : result.issues.map((issue) => issue.message).join('\n')
		);
		if (!result.ok) return;

		const snapshot = resolveContract(result.contract.document, result.contract.clauses, {
			'research-introductions': { 'introducer-titles': 'coo-cro' }
		});
		const text = resolvedText(snapshot);

		assert.equal(snapshot.id, 'agreed-street-talk-contract');
		assert.match(text, /COO and CRO/u);
		assert.doesNotMatch(text, /CEO, COO, and CRO/u);
		assert.match(text, /SIGNATURES/u);
		assert.match(text, /AGREED/u);
		assert.match(text, /STREET TALK/u);
	});
});
