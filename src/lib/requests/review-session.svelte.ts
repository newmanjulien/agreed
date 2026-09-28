import type { AcceptRequest } from './types';

const STARTING_POINTS = 10;

class ReviewSession {
	accepted = $state<Record<string, number>>({});

	readonly pointsLeft = $derived(
		STARTING_POINTS - Object.values(this.accepted).reduce((sum, points) => sum + points, 0)
	);

	isAccepted(id: string) {
		return this.accepted[id] !== undefined;
	}

	canAfford(points: number) {
		return this.pointsLeft >= points;
	}

	toggleAccept(request: AcceptRequest) {
		if (this.isAccepted(request.id)) {
			const { [request.id]: _removed, ...rest } = this.accepted;
			this.accepted = rest;
			return;
		}

		const cost = request.points;
		if (!this.canAfford(cost)) return;

		this.accepted = { ...this.accepted, [request.id]: cost };
	}
}

export const reviewSession = new ReviewSession();
