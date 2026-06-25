interface HandleDeleteOptions {
	action: () => Promise<{ error?: string }>;
	onLoadingChange: (loading: boolean) => void;
	onSuccess: () => void;
	onError: (message: string) => void;
}

export async function handleDeleteAction({
	action,
	onLoadingChange,
	onSuccess,
	onError,
}: HandleDeleteOptions): Promise<void> {
	onLoadingChange(true);
	const res = await action();
	onLoadingChange(false);
	if (res.error) {
		onError(res.error);
	} else {
		onSuccess();
	}
}
