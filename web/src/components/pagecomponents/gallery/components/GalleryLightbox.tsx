import Image from "next/image";
import { useEffect } from "react";
import { NavArrow } from "@/components/ui/components/NavArrow";
import { buildGalleryImageUrl } from "@/lib/utils/utils";
import type { GalleryImage } from "@/types/gallery";

interface GalleryLightboxProps {
	images: GalleryImage[];
	index: number;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
}

export function GalleryLightbox({
	images,
	index,
	onClose,
	onPrev,
	onNext,
}: GalleryLightboxProps) {
	const image = images[index];

	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
			if (e.key === "ArrowLeft") onPrev();
			if (e.key === "ArrowRight") onNext();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [onClose, onPrev, onNext]);

	if (!image) return null;

	return (
		<div
			className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label="Image viewer"
		>
			{/* Close */}
			<button
				type="button"
				onClick={onClose}
				className="absolute top-4 right-4 text-text-gray hover:text-primary transition-colors z-10"
				aria-label="Close"
			>
				<i className="fas fa-times text-2xl" aria-hidden="true" />
			</button>

			<NavArrow
				direction="left"
				onClick={onPrev}
				disabled={index === 0}
				label="Previous image"
				className="absolute left-4 z-10"
			/>

			{/* Image */}
			<div className="relative w-full max-w-4xl max-h-[80vh] mx-16">
				<div className="relative aspect-video">
					<Image
						src={buildGalleryImageUrl(image.image_path)}
						alt={image.alt_text ?? image.title ?? "Gallery image"}
						fill
						className="object-contain"
						priority
					/>
				</div>
				{(image.title || image.description_en || image.description) && (
					<div className="mt-3 text-center">
						{image.title && (
							<p className="text-text-light font-semibold">{image.title}</p>
						)}
						{(image.description_en ?? image.description) && (
							<p className="text-text-gray text-sm mt-1">
								{image.description_en ?? image.description}
							</p>
						)}
					</div>
				)}
			</div>

			<NavArrow
				direction="right"
				onClick={onNext}
				disabled={index === images.length - 1}
				label="Next image"
				className="absolute right-4 z-10"
			/>

			{/* Counter */}
			<p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-text-gray text-sm">
				{index + 1} / {images.length}
			</p>
		</div>
	);
}
