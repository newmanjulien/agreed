export type ContractChangeFailureReason =
	| 'invalid'
	| 'unchanged'
	| 'conflict'
	| 'layout';

export type ContractChangeResult<Value = undefined> =
	| { ok: true; value: Value }
	| { ok: false; reason: ContractChangeFailureReason };

export function changeSucceeded<Value>(value: Value): ContractChangeResult<Value> {
	return { ok: true, value };
}

export function changeFailed(
	reason: ContractChangeFailureReason
): ContractChangeResult<never> {
	return { ok: false, reason };
}
