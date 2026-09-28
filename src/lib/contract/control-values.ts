import type { ChangesControlDefinition, ClauseRegistry } from './model.ts';

export type ContractControlValues = Record<string, Record<string, string>>;

export function getChangesControl(
	clauses: ClauseRegistry,
	clauseId: string,
	controlId: string
): ChangesControlDefinition | undefined {
	const widget = clauses[clauseId]?.widget;
	return widget?.type === 'changes' && widget.control.id === controlId
		? widget.control
		: undefined;
}

export function createDefaultControlValues(clauses: ClauseRegistry): ContractControlValues {
	const values: ContractControlValues = {};
	for (const [clauseId, clause] of Object.entries(clauses)) {
		if (clause.widget.type !== 'changes') continue;
		const { control } = clause.widget;
		values[clauseId] = { [control.id]: control.defaultValue };
	}
	return values;
}

export function normalizeControlValue(
	clauses: ClauseRegistry,
	clauseId: string,
	controlId: string,
	value: string
): string | null {
	const control = getChangesControl(clauses, clauseId, controlId);
	return control?.options.some((option) => option.value === value) ? value : null;
}

export function cloneContractControlValues(
	values: ContractControlValues
): ContractControlValues {
	return Object.fromEntries(
		Object.entries(values).map(([clauseId, clauseValues]) => [
			clauseId,
			{ ...clauseValues }
		])
	);
}
