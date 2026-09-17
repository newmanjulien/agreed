import { tick } from 'svelte';
import type { ResolvedContractDocument } from '../../contract/resolve.ts';
import { createPageMeasurement } from './measure.ts';
import { paginateDocument } from './paginate.ts';
import type { PageLayout } from './types.ts';

export type PaginationStatus = 'loading' | 'ready' | 'error';

export class PaginationController {
	status = $state<PaginationStatus>('loading');
	pages = $state<PageLayout[]>([]);
	measurementElement = $state<HTMLDivElement>();
	#runId = 0;

	constructor(
		private readonly onReadyChange: (isReady: boolean) => void,
		private readonly afterLayout: () => void
	) {}

	async apply(snapshot: ResolvedContractDocument, showLoading: boolean): Promise<boolean> {
		const runId = ++this.#runId;

		try {
			if (showLoading) {
				this.setStatus('loading');
				await tick();
				await document.fonts.ready;
			}

			if (!this.measurementElement) {
				throw new Error('The measurement surface is unavailable.');
			}

			const measurement = createPageMeasurement(this.measurementElement);
			const pages = paginateDocument(snapshot, measurement);
			if (runId !== this.#runId) return false;

			this.pages = pages;
			this.setStatus('ready');
			this.afterLayout();
			return true;
		} catch (error) {
			if (runId !== this.#runId) return false;
			console.error('Contract pagination failed.', error);
			if (showLoading) this.setStatus('error');
			return false;
		}
	}

	destroy(): void {
		this.#runId += 1;
		this.onReadyChange(false);
	}

	private setStatus(status: PaginationStatus): void {
		this.status = status;
		this.onReadyChange(status === 'ready');
	}
}
