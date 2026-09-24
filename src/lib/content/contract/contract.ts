import type { CompiledContract } from '$lib/document/contract-model';
import { validateContract } from '$lib/document/validate-contract';
import { contractDocument } from './contract-data';
import { contractClauseBoxes } from './clause-boxes';
import { contractConcessions } from './concessions';

export const contract: CompiledContract = {
	document: contractDocument,
	clauseBoxes: contractClauseBoxes,
	concessions: contractConcessions
};

validateContract(contract);
