import Image from "next/image";
import { useEffect } from "react";
import { buildGalleryImageUrl } from "@/lib/utils/utils";
import type { GalleryImage } from "@/types/gallery";

interface GalleryLightboxProps {
	images: GalleryImage[];
	index: number;
	onClose: () => void;
	onPrev: () => void;
	onNext: () => void;
	onGoTo: (index: number) => void;
}

export function GalleryLightbox({
	images,
	index,
	onClose,
	onPrev,
	onNext,
	onGoTo,
}: GalleryLightboxProps) {
	const image = images[index];
	const category = image?.category ?? "";

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
			className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center"
			role="dialog"
			aria-modal="true"
			aria-label="Image viewer"
		>
			{/* Racing stripe */}
			<div className="flex h-[2px] absolute top-0 inset-x-0 z-10">
				<div className="flex-1 bg-primary" />
				<div className="w-12 bg-transparent" />
				<div className="w-5 bg-primary" />
			</div>

			{/* Top bar */}
			<div className="absolute top-0 inset-x-0 flex items-center justify-between px-6 pt-5 z-10">
				<span className="font-heading text-[7px] tracking-[4px] uppercase text-primary/40">
					{category.replace(/_/g, " ")} · {index + 1} / {images.length}
				</span>
				<button
					type="button"
					onClick={onClose}
					className="w-[26px] h-[26px] rounded-full border border-[#2a2a2a] flex items-center justify-center text-text-gray hover:text-primary hover:border-primary transition-colors"
					aria-label="Close"
				>
					<svg
						width="10"
						height="10"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.5}
						strokeLinecap="round"
						aria-hidden="true"
					>
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>
			</div>

			{/* Main image + arrows */}
			<div className="relative flex items-center justify-center w-full px-16 flex-1">
				{/* Prev */}
				<button
					type="button"
					onClick={onPrev}
					disabled={index === 0}
					className="absolute left-4 w-8 h-8 border border-primary/25 bg-black/60 flex items-center justify-center text-primary hover:border-primary/60 transition-colors disabled:opacity-20 disabled:pointer-events-none"
					aria-label="Previous image"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,.7)"
						strokeWidth={2.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polyline points="15 18 9 12 15 6" />
					</svg>
				</button>

				{/* Image */}
				<div className="relative w-full max-w-4xl max-h-[65vh]">
					<div className="relative aspect-video">
						<Image
							src={buildGalleryImageUrl(image.image_path)}
							alt={image.alt_text ?? image.title ?? "Gallery image"}
							fill
							className="object-contain"
							priority
						/>
					</div>

					{/* Caption */}
					{(image.title || image.description_en || image.description) && (
						<div className="mt-3 text-center">
							{image.title && (
								<p className="font-heading text-[10px] text-[#e0e0e0] tracking-wide">
									{image.title}
								</p>
							)}
							{(image.description_en ?? image.description) && (
								<p className="font-body text-[9px] text-text-gray mt-1">
									{image.description_en ?? image.description}
								</p>
							)}
						</div>
					)}
				</div>

				{/* Next */}
				<button
					type="button"
					onClick={onNext}
					disabled={index === images.length - 1}
					className="absolute right-4 w-8 h-8 border border-primary/25 bg-black/60 flex items-center justify-center text-primary hover:border-primary/60 transition-colors disabled:opacity-20 disabled:pointer-events-none"
					aria-label="Next image"
				>
					<svg
						width="14"
						height="14"
						viewBox="0 0 24 24"
						fill="none"
						stroke="rgba(255,215,0,.7)"
						strokeWidth={2.5}
						strokeLinecap="round"
						strokeLinejoin="round"
						aria-hidden="true"
					>
						<polyline points="9 18 15 12 9 6" />
					</svg>
				</button>
			</div>

			{/* Thumbnail strip */}
			{images.length > 1 && (
				<div className="flex gap-1.5 pb-6 pt-3 overflow-x-auto max-w-full px-6">
					{images.map((img, i) => (
						<button
							key={img.id}
							type="button"
							onClick={() => onGoTo(i)}
							className={`relative w-9 h-7 shrink-0 bg-bg-panel border transition-all duration-150 ${
								i === index
									? "border-2 border-primary opacity-100"
									: "border border-[#2a2a2a] opacity-50 hover:opacity-75"
							}`}
							aria-label={`Go to image ${i + 1}`}
						>
							<Image
								src={buildGalleryImageUrl(img.image_path)}
								alt=""
								fill
								className="object-cover"
								sizes="36px"
							/>
						</button>
					))}
				</div>
			)}
		</div>
	);
}
