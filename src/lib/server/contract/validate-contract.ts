import type { ChangesControlDefinition, ClauseRegistry } from '../../contract/model.ts';
import {
	CLAUSE_HIGHLIGHT_TONES,
	SLUG,
	addIssue,
	type CompileState,
	type CompiledBlock
} from './compiler-context.ts';

function validateChangesControl(
	clauseId: string,
	control: ChangesControlDefinition,
	state: CompileState
): void {
	const controlId = typeof control.id === 'string' ? control.id : '';
	if (!controlId || !SLUG.test(controlId)) {
		addIssue(
			state,
			'invalid-control-definition-id',
			`The control in clause "${clauseId}" must have a lowercase slug id.`
		);
	}

	if (typeof control.label !== 'string' || !control.label.trim()) {
		addIssue(state, 'missing-control-label', `Control "${clauseId}.${controlId}" must have a label.`);
	}

	const options = Array.isArray(control.options) ? control.options : [];
	const optionIds = options.map((option) => option?.value);
	if (optionIds.length < 2) {
		addIssue(
			state,
			'missing-control-options',
			`Control "${clauseId}.${controlId}" must define at least two options.`
		);
	} else if (new Set(optionIds).size !== optionIds.length) {
		addIssue(
			state,
			'duplicate-control-option',
			`Control "${clauseId}.${controlId}" contains duplicate options.`
		);
	}

	for (const option of options) {
		if (!option || typeof option.value !== 'string' || !option.value.trim()) {
			addIssue(
				state,
				'invalid-control-option',
				`Control "${clauseId}.${controlId}" contains an empty option.`
			);
		}
		if (!option || typeof option.controlLabel !== 'string' || !option.controlLabel.trim()) {
			addIssue(
				state,
				'missing-control-option-label',
				`Every option for "${clauseId}.${controlId}" must have a control label.`
			);
		}
		if (!option || !['value', 'deactivate'].includes(option.kind)) {
			addIssue(
				state,
				'invalid-control-option-kind',
				`Every option for "${clauseId}.${controlId}" must have a valid kind.`
			);
		}
		if (typeof option?.documentLabel !== 'string' || !option.documentLabel.trim()) {
			addIssue(
				state,
				'missing-control-option-document-label',
				`Every option for "${clauseId}.${controlId}" must have a document label.`
			);
		}
	}

	if (typeof control.defaultValue !== 'string' || !optionIds.includes(control.defaultValue)) {
		addIssue(
			state,
			'invalid-default-value',
			`Default value "${control.defaultValue}" is not an option for "${clauseId}.${controlId}".`
		);
	}
}

function validateDocumentValues(
	clauseId: string,
	clause: ClauseRegistry[string],
	state: CompileState
): void {
	for (const [valueId, value] of Object.entries(clause.values ?? {})) {
		if (!SLUG.test(valueId)) {
			addIssue(
				state,
				'invalid-value-definition-id',
				`Value id "${clauseId}.${valueId}" must be a lowercase slug.`
			);
		}
		if (!value || typeof value.defaultLabel !== 'string' || !value.defaultLabel.trim()) {
			addIssue(
				state,
				'missing-value-label',
				`Value "${clauseId}.${valueId}" must have a default label.`
			);
		}
	}
}

export function validateClauses(clauses: ClauseRegistry, state: CompileState): void {
	if (!clauses || typeof clauses !== 'object') {
		addIssue(state, 'missing-clause-registry', 'The contract must define its clauses.');
		return;
	}

	for (const [clauseId, clause] of Object.entries(clauses)) {
		if (!clause || typeof clause !== 'object') {
			addIssue(state, 'invalid-clause-definition', `Clause "${clauseId}" must be an object.`);
			continue;
		}
		if (!SLUG.test(clauseId)) {
			addIssue(
				state,
				'invalid-clause-definition-id',
				`Clause id "${clauseId}" must be a lowercase slug.`
			);
		}
		if (typeof clause.title !== 'string' || !clause.title.trim()) {
			addIssue(state, 'missing-clause-title', `Clause "${clauseId}" must have a title.`);
		}
		if (!CLAUSE_HIGHLIGHT_TONES.has(clause.highlightTone)) {
			addIssue(
				state,
				'invalid-clause-highlight-tone',
				`Clause "${clauseId}" has an unsupported highlight tone.`
			);
		}
		validateDocumentValues(clauseId, clause, state);
		if (!clause.widget || typeof clause.widget !== 'object') {
			addIssue(state, 'missing-clause-widget', `Clause "${clauseId}" must define a widget.`);
			continue;
		}
		const widget = clause.widget;
		if (widget.type !== 'changes' && widget.type !== 'faq') {
			addIssue(state, 'invalid-widget-type', `Clause "${clauseId}" has an unsupported widget type.`);
			continue;
		}

		if (widget.type === 'changes') {
			if (typeof widget.prompt !== 'string' || !widget.prompt.trim()) {
				addIssue(state, 'missing-changes-prompt', `Changes widget for clause "${clauseId}" must have a prompt.`);
			}
			if (typeof widget.appliedMessage !== 'string' || !widget.appliedMessage.trim()) {
				addIssue(
					state,
					'missing-changes-applied-message',
					`Changes widget for clause "${clauseId}" must have an applied message.`
				);
			}
			if (!widget.control || typeof widget.control !== 'object') {
				addIssue(
					state,
					'missing-changes-control',
					`Changes widget for clause "${clauseId}" must define one control.`
				);
			} else {
				validateChangesControl(clauseId, widget.control, state);
			}
			continue;
		}

		if (typeof widget.intro !== 'string' || !widget.intro.trim()) {
			addIssue(state, 'missing-faq-intro', `FAQ widget for clause "${clauseId}" must have introductory text.`);
		}
		if (!Array.isArray(widget.items) || widget.items.length === 0) {
			addIssue(state, 'missing-faq-items', `FAQ widget for clause "${clauseId}" must contain at least one item.`);
		}

		const itemIds = new Set<string>();
		for (const item of Array.isArray(widget.items) ? widget.items : []) {
			if (!item || typeof item !== 'object') {
				addIssue(state, 'invalid-faq-item', `Every item in FAQ widget for clause "${clauseId}" must be an object.`);
				continue;
			}
			const itemId = typeof item.id === 'string' ? item.id : '';
			if (!itemId || !SLUG.test(itemId)) {
				addIssue(
					state,
					'invalid-faq-item-id',
					`Every item in FAQ widget for clause "${clauseId}" must have a lowercase slug id.`
				);
			} else if (itemIds.has(itemId)) {
				addIssue(
					state,
					'duplicate-faq-item-id',
					`FAQ widget for clause "${clauseId}" contains duplicate item id "${itemId}".`
				);
			}
			if (itemId) itemIds.add(itemId);

			if (typeof item.question !== 'string' || !item.question.trim()) {
				addIssue(state, 'missing-faq-question', `FAQ item "${itemId}" must have a question.`);
			}
			if (!Array.isArray(item.answer) || item.answer.length === 0) {
				addIssue(state, 'missing-faq-answer', `FAQ item "${itemId}" must have an answer.`);
			}
			for (const paragraph of Array.isArray(item.answer) ? item.answer : []) {
				if (!paragraph || !Array.isArray(paragraph.parts) || paragraph.parts.length === 0) {
					addIssue(
						state,
						'missing-faq-answer-text',
						`Every answer paragraph in FAQ item "${itemId}" must contain text.`
					);
				}
				for (const part of paragraph && Array.isArray(paragraph.parts) ? paragraph.parts : []) {
					if (!part || (part.type !== 'text' && part.type !== 'clause-reference')) {
						addIssue(
							state,
							'invalid-faq-answer-part',
							`Every answer part in FAQ item "${itemId}" must be text or a clause reference.`
						);
						continue;
					}
					if (typeof part.text !== 'string' || !part.text.trim()) {
						addIssue(
							state,
							'missing-faq-answer-part-text',
							`Every answer part in FAQ item "${itemId}" must contain text.`
						);
					}
					if (part.type !== 'clause-reference') continue;
					if (typeof part.clauseId !== 'string' || !SLUG.test(part.clauseId)) {
						addIssue(
							state,
							'invalid-faq-clause-reference',
							`FAQ clause reference ids must be lowercase slugs.`
						);
					}
				}
			}
		}
	}
}

export function validateDocumentShape(
	compiled: CompiledBlock[],
	state: CompileState
): string | null {
	const titles = compiled.filter(
		(item) => item.block.type === 'heading' && item.block.level === 1
	);
	if (titles.length !== 1) {
		addIssue(state, 'title-count', 'Contract must contain exactly one level-one title.');
	} else {
		const title = titles[0];
		if (compiled[0] !== title) {
			addIssue(
				state,
				'title-position',
				'The level-one title must be the first document block.',
				title.source
			);
		}
	}

	const signatures = compiled.filter((item) => item.block.type === 'signature-grid');
	if (signatures.length !== 1) {
		addIssue(state, 'signature-count', 'Contract must contain exactly one signature section.');
	} else if (compiled.at(-1) !== signatures[0]) {
		addIssue(
			state,
			'signature-position',
			'The signature section must be the final document block.',
			signatures[0].source
		);
	}

	const title = titles[0]?.block;
	return title?.type === 'heading' ? title.anchor : null;
}

export function validateClauseReferences(
	clauses: ClauseRegistry,
	state: CompileState
): void {
	const missingClauseReferences = new Set<string>();

	for (const clauseId of state.clauseIds) {
		const clause = clauses[clauseId];
		if (!clause) {
			addIssue(
				state,
				'missing-clause-definition',
				`Clause "${clauseId}" must have a definition in clauses.ts.`
			);
			continue;
		}

		for (const valueId of Object.keys(clause.values ?? {})) {
			if (!state.clauseDocumentValueIds.get(clauseId)?.has(valueId)) {
				addIssue(
					state,
					'missing-clause-value',
					`Clause "${clauseId}" must contain <contract-value id="${valueId}"></contract-value>.`
				);
			}
		}

		if (
			clause.widget.type === 'changes' &&
			!clause.values?.[clause.widget.control.id]
		) {
			addIssue(
				state,
				'missing-control-value',
				`Changes control "${clauseId}.${clause.widget.control.id}" must have a matching document value.`
			);
		}
	}

	for (const [clauseId, clause] of Object.entries(clauses)) {
		if (!state.clauseIds.has(clauseId)) {
			addIssue(
				state,
				'unknown-clause-definition',
				`Clause definitions reference unknown clause "${clauseId}".`
			);
		}

		if (clause.widget.type !== 'faq') continue;
		for (const item of clause.widget.items) {
			for (const paragraph of item.answer) {
				for (const part of paragraph.parts) {
					if (
						part.type === 'clause-reference' &&
						!state.clauseIds.has(part.clauseId)
					) {
						missingClauseReferences.add(part.clauseId);
					}
				}
			}
		}
	}

	for (const clauseId of missingClauseReferences) {
		addIssue(
			state,
			'unknown-clause-reference',
			`Clause definitions reference unknown clause "${clauseId}".`
		);
	}
}
