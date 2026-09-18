import type { ClauseRegistry } from './model.ts';
import type { ContractDocument } from './types.ts';
import {
	changeFailed,
	changeSucceeded,
	type ContractChangeResult
} from './change-result.ts';
import {
	cloneContractControlValues,
	createDefaultControlValues,
	getChangesControl,
	normalizeControlValue,
	type ContractControlValues
} from './control-values.ts';
import { resolveContract, type ResolvedContractDocument } from './resolve.ts';

export interface PreparedContractChange {
	controlValues: ContractControlValues;
	document: ResolvedContractDocument;
}

export class ContractSession {
	controlValues = $state<ContractControlValues>({});

	currentControlValues(clauses: ClauseRegistry): ContractControlValues {
		const current = createDefaultControlValues(clauses);
		for (const [clauseId, storedValues] of Object.entries(this.controlValues)) {
			for (const [controlId, value] of Object.entries(storedValues)) {
				const normalized = normalizeControlValue(clauses, clauseId, controlId, value);
				if (normalized === null) continue;
				current[clauseId] = { ...current[clauseId], [controlId]: normalized };
			}
		}
		return current;
	}

	snapshot(template: ContractDocument, clauses: ClauseRegistry): ResolvedContractDocument {
		return resolveContract(template, clauses, this.currentControlValues(clauses));
	}

	prepareControlChange(
		template: ContractDocument,
		clauses: ClauseRegistry,
		clauseId: string,
		controlId: string,
		value: string
	): ContractChangeResult<PreparedContractChange> {
		const normalized = normalizeControlValue(clauses, clauseId, controlId, value);
		if (normalized === null) return changeFailed('invalid');
		const control = getChangesControl(clauses, clauseId, controlId);
		const selectedOption = control?.options.find((option) => option.value === normalized);
		if (!selectedOption) return changeFailed('invalid');
		const currentControlValues = this.currentControlValues(clauses);
		if (currentControlValues[clauseId]?.[controlId] === normalized) {
			return changeFailed('unchanged');
		}
		const controlValues = {
			...currentControlValues,
			[clauseId]: { ...currentControlValues[clauseId], [controlId]: normalized }
		};
		return changeSucceeded({
			controlValues,
			document: resolveContract(template, clauses, controlValues)
		});
	}

	commit(change: PreparedContractChange): void {
		this.controlValues = cloneContractControlValues(change.controlValues);
	}
}
