import Image from "next/image";
import { buildGalleryImageUrl } from "@/lib/utils/utils";
import type { GalleryImage } from "@/types/gallery";

interface GalleryTileProps {
	image: GalleryImage;
	onClick: () => void;
}

export function GalleryTile({ image, onClick }: GalleryTileProps) {
	const src = buildGalleryImageUrl(image.image_path);
	const alt = image.alt_text ?? image.title ?? "Gallery image";

	return (
		<button
			type="button"
			onClick={onClick}
			className="group relative aspect-square overflow-hidden rounded-xl border border-gray-mid hover:border-primary/40 transition-all duration-200 hover:-translate-y-0.5"
			aria-label={`View ${alt}`}
		>
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover transition-transform duration-300 group-hover:scale-105"
				sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
			/>
			{image.title && (
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<p className="text-text-light text-xs font-semibold truncate">
						{image.title}
					</p>
				</div>
			)}
		</button>
	);
}
