import { useState } from "react";
import type { GalleryImage } from "@/types/gallery";

interface LightboxState {
	images: GalleryImage[];
	index: number;
}

export function useGalleryLightbox() {
	const [state, setState] = useState<LightboxState | null>(null);

	const open = (images: GalleryImage[], index: number) =>
		setState({ images, index });

	const close = () => setState(null);

	const prev = () =>
		setState((s) => s && { ...s, index: Math.max(0, s.index - 1) });

	const next = () =>
		setState(
			(s) => s && { ...s, index: Math.min(s.images.length - 1, s.index + 1) },
		);

	return {
		lightbox: state,
		open,
		close,
		prev,
		next,
	};
}
