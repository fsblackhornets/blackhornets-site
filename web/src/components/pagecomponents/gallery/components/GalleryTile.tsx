import Image from "next/image";
import { buildGalleryImageUrl } from "@/lib/utils/utils";
import type { GalleryImage } from "@/types/gallery";

interface GalleryTileProps {
	image: GalleryImage;
	onClick: () => void;
	featured?: boolean;
}

export function GalleryTile({
	image,
	onClick,
	featured = false,
}: GalleryTileProps) {
	const src = buildGalleryImageUrl(image.image_path);
	const alt = image.alt_text ?? image.title ?? "Gallery image";

	return (
		<button
			type="button"
			onClick={onClick}
			className={`group relative aspect-square overflow-hidden rounded-none border border-[#1e1e1e] hover:border-primary/50 hover:border-t-2 hover:border-t-primary transition-all duration-200 ${featured ? "col-span-2 row-span-2" : ""}`}
			aria-label={`View ${alt}`}
		>
			<Image
				src={src}
				alt={alt}
				fill
				className="object-cover transition-transform duration-300 group-hover:scale-105"
				sizes={
					featured
						? "(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
						: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
				}
			/>
			{image.title && (
				<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
					<p className="font-heading text-[9px] tracking-[1px] text-primary truncate">
						{image.title}
					</p>
				</div>
			)}
		</button>
	);
}
