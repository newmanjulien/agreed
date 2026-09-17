import { dev } from '$app/environment';
import type { ContractLoadResult } from '$lib/contract/source-result';
import { contractClauses } from '$lib/content/contract/clauses';
import contractSource from '$lib/content/contract/document.html?raw';
import { compileContractSource } from '$lib/server/contract-source/compile-contract';
import type { PageServerLoad } from './$types';

export const load = (() => {
	try {
		return {
			contractResult: compileContractSource(contractSource, contractClauses)
		};
	} catch (error) {
		console.error('Contract compiler failed unexpectedly.', error);
		if (!dev) throw error;
		const contractResult = {
			ok: false,
			kind: 'internal',
			issues: [
				{
					code: 'internal-compiler-error',
					message: 'The contract compiler encountered an unexpected error.'
				}
			]
		} satisfies ContractLoadResult;
		return {
			contractResult
		};
	}
}) satisfies PageServerLoad;
