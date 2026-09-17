import type { CompiledContract } from './model.ts';

export interface ContractSourceIssue {
	code: string;
	message: string;
	line?: number;
	column?: number;
}

export type ContractCompileResult =
	| { ok: true; contract: CompiledContract }
	| { ok: false; kind: 'source'; issues: ContractSourceIssue[] };

export type ContractLoadResult =
	| ContractCompileResult
	| { ok: false; kind: 'internal'; issues: ContractSourceIssue[] };
