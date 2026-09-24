import type { ConcessionRegistry } from './contract-model';
import type { ResolvedContract, ResolvedInlineNode } from './resolved-types';
import type { ContractDocument } from './types';

export type ContractView = 'effective' | 'redline';

export function resolveContract(
	source: ContractDocument,
	concessions: ConcessionRegistry,
	active: Readonly<Record<string, string>>,
	view: ContractView
): ResolvedContract {
	return {
		id: source.id,
		blocks: source.blocks.map((block) => {
			if (block.type === 'table') return block;
			const content: ResolvedInlineNode[] = block.content.map((node) => {
				if (node.type === 'text') return node;
				return {
					...node,
					content: node.content.flatMap((child) => {
						if (child.type === 'text') return [child];
						const selectedId = active[child.id];
						if (!selectedId) return child.content;
						const selected = concessions[selectedId];
						if (!selected || selected.targetProvisionId !== child.id) {
							throw new Error(`Invalid concession selection for ${child.id}: ${selectedId}`);
						}
						if (view === 'effective') return selected.paragraph;
						return [
							...child.content.map((text) => ({ ...text, removed: true as const })),
							{ type: 'text' as const, value: ' ' },
							...selected.paragraph
						];
					})
				};
			});
			return { ...block, content };
		})
	};
}
