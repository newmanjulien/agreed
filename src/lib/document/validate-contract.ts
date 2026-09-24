import type { CompiledContract } from './contract-model';

// The document shape is checked by TypeScript; these relationships need value checks.
export function validateContract({ document, clauseBoxes, concessions }: CompiledContract): void {
	const clauseIds = new Set<string>();
	const provisionOwners = new Map<string, string>();
	const referencedConcessions = new Set<string>();

	for (const block of document.blocks) {
		if (block.type === 'table') continue;
		for (const node of block.content) {
			if (node.type !== 'clause') continue;
			if (clauseIds.has(node.id)) throw new Error(`Duplicate clause: ${node.id}`);
			clauseIds.add(node.id);
			if (!clauseBoxes[node.id]) throw new Error(`Missing clause box for clause: ${node.id}`);
			for (const child of node.content) {
				if (child.type !== 'provision') continue;
				if (provisionOwners.has(child.id)) throw new Error(`Duplicate provision: ${child.id}`);
				provisionOwners.set(child.id, node.id);
			}
		}
	}

	for (const [clauseId, box] of Object.entries(clauseBoxes)) {
		if (!clauseIds.has(clauseId)) throw new Error(`Orphan clause box: ${clauseId}`);
		const preferred = box.preferredConcessions;
		if (!preferred) continue;
		if (!box.negotiation) throw new Error(`Preferred concessions require negotiation: ${clauseId}`);
		if (!preferred.concessionIds.length) throw new Error(`Empty concession list: ${clauseId}`);
		const idsInBox = new Set<string>();
		for (const concessionId of preferred.concessionIds) {
			if (idsInBox.has(concessionId)) throw new Error(`Duplicate concession in ${clauseId}: ${concessionId}`);
			idsInBox.add(concessionId);
			const concession = concessions[concessionId];
			if (!concession) throw new Error(`Missing concession: ${concessionId}`);
			if (!concession.paragraph.length || !concession.paragraph.some((node) => node.value.trim())) {
				throw new Error(`Empty concession paragraph: ${concessionId}`);
			}
			if (provisionOwners.get(concession.targetProvisionId) !== clauseId) {
				throw new Error(`Concession ${concessionId} targets a missing or unrelated provision.`);
			}
			referencedConcessions.add(concessionId);
		}
	}

	for (const concessionId of Object.keys(concessions)) {
		if (!referencedConcessions.has(concessionId)) throw new Error(`Orphan concession: ${concessionId}`);
	}
}
