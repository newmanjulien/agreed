function afterNextPaint(): Promise<void> {
	return new Promise((resolve) => {
		requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
	});
}

export async function printContract(
	documentRoot: HTMLElement | undefined,
	documentId: string
): Promise<void> {
	if (typeof window === 'undefined' || typeof document === 'undefined') {
		throw new Error('Printing is only available in the browser.');
	}

	if (
		!documentRoot?.hasAttribute('data-print-document') ||
		!documentRoot.closest('[data-pagination-status="ready"]')
	) {
		throw new Error('The paginated contract is not ready to print.');
	}

	await document.fonts.ready;
	await afterNextPaint();

	const originalTitle = document.title;
	document.title = documentId;

	try {
		window.print();
	} finally {
		document.title = originalTitle;
	}
}
