import type { ChangeRequest } from './types';

const STARTING_POINTS = 10;

export type BagItem = {
	id: string;
	requestedChange: string;
	justification: string;
};

class ReviewSession {
	accepted = $state<Record<string, number>>({});
	bag = $state<BagItem[]>([]);

	readonly pointsLeft = $derived(
		STARTING_POINTS - Object.values(this.accepted).reduce((sum, points) => sum + points, 0)
	);

	readonly canSubmit = $derived(this.bag.every((item) => item.justification.trim() !== ''));

	isAccepted(id: string) {
		return this.accepted[id] !== undefined;
	}

	isInBag(id: string) {
		return this.bag.some((item) => item.id === id);
	}

	canAfford(points: number) {
		return this.pointsLeft >= points;
	}

	toggleAccept(request: ChangeRequest) {
		if (this.isAccepted(request.id)) {
			const { [request.id]: _removed, ...rest } = this.accepted;
			this.accepted = rest;
			return;
		}

		const cost = request.points ?? 0;
		if (!this.canAfford(cost)) return;

		this.accepted = { ...this.accepted, [request.id]: cost };
	}

	toggleBag(request: ChangeRequest) {
		if (request.action !== 'Add') return;

		if (this.isInBag(request.id)) {
			this.bag = this.bag.filter((item) => item.id !== request.id);
			return;
		}

		this.bag = [
			...this.bag,
			{
				id: request.id,
				requestedChange: request.requestedChange,
				justification: ''
			}
		];
	}
}

export const reviewSession = new ReviewSession();
