export function canSubmitComposer(text: string, pending = false): boolean {
	return !pending && Boolean(text.trim());
}
