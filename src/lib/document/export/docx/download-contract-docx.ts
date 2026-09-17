import type { ResolvedContractDocument } from '../../../contract/resolve.ts';
import { createContractDocx } from './create-contract-docx.ts';

const OBJECT_URL_LIFETIME_MS = 60_000;

export async function downloadContractDocx(
	document: ResolvedContractDocument,
	filename = `${document.id}.docx`
): Promise<void> {
	const blob = await createContractDocx(document);
	const url = URL.createObjectURL(blob);
	const anchor = window.document.createElement('a');

	anchor.href = url;
	anchor.download = filename;
	anchor.hidden = true;
	window.document.body.appendChild(anchor);
	anchor.click();
	anchor.remove();
	window.setTimeout(() => URL.revokeObjectURL(url), OBJECT_URL_LIFETIME_MS);
}
