import type { ContractCompileResult } from '../../contract/source-result.ts';
import type { ClauseRegistry } from '../../contract/model.ts';
import { createCompileState } from './compiler-context.ts';
import { compileSourceBlocks, parseSource } from './parse-contract-source.ts';
import {
	validateClauseReferences,
	validateClauses,
	validateDocumentShape
} from './validate-contract.ts';

export function compileContractSource(
	source: string,
	clauses: ClauseRegistry
): ContractCompileResult {
	const parsed = parseSource(source);
	if (!parsed.ok) return { ok: false, kind: 'source', issues: parsed.issues };

	const state = createCompileState(clauses);
	validateClauses(clauses, state);
	if (state.issues.length) return { ok: false, kind: 'source', issues: state.issues };

	const compiled = compileSourceBlocks(parsed.nodes, state);

	if (state.issues.length) return { ok: false, kind: 'source', issues: state.issues };

	const contractId = validateDocumentShape(compiled, state);
	if (state.issues.length) return { ok: false, kind: 'source', issues: state.issues };
	if (!contractId) throw new Error('Validated contract title is missing.');

	validateClauseReferences(clauses, state);
	if (state.issues.length) return { ok: false, kind: 'source', issues: state.issues };

	return {
		ok: true,
		contract: {
			document: {
				id: contractId,
				blocks: compiled.map((item) => item.block)
			},
			clauses
		}
	};
}
