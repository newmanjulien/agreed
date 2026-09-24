import type { ConcessionRegistry } from '$lib/document/contract-model';

export const contractConcessions = {
	'resale-ordinary-course-billing': {
		targetProvisionId: 'resale-payment-restriction',
		paragraph: [{
			type: 'text',
			value: 'For the avoidance of any doubt, Customer billing their clients in the ordinary course of business shall not be considered a breach of Section 1(b).'
		}]
	}
} satisfies ConcessionRegistry;
