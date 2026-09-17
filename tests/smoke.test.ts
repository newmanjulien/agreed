import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, it } from 'node:test';
import JSZip from 'jszip';
import { contractClauses } from '../src/lib/content/contract/clauses.ts';
import type { ClauseRegistry } from '../src/lib/contract/model.ts';
import {
	createContractDocx,
	DOCX_MIME_TYPE
} from '../src/lib/document/export/docx/create-contract-docx.ts';
import { resolveContract } from '../src/lib/contract/resolve.ts';
import { compileContractSource } from '../src/lib/server/contract-source/compile-contract.ts';

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

	it('compiles, resolves, and exports the current contract', async () => {
		const source = await readFile(
			new URL('../src/lib/content/contract/document.html', import.meta.url),
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
		const blob = await createContractDocx(snapshot);
		const bytes = new Uint8Array(await blob.arrayBuffer());
		const archive = await JSZip.loadAsync(bytes);
		const documentXml = await archive.file('word/document.xml')?.async('string');

		assert.equal(blob.type, DOCX_MIME_TYPE);
		assert.equal(snapshot.id, 'agreed-street-talk-contract');
		assert.ok(documentXml);
		assert.match(documentXml, /COO and CRO/u);
		assert.doesNotMatch(documentXml, /CEO, COO, and CRO/u);
		assert.match(documentXml, /SIGNATURES/u);
		assert.match(documentXml, /AGREED/u);
		assert.match(documentXml, /STREET TALK/u);
	});
});
