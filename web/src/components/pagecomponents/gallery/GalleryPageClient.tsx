"use client";

import Image from "next/image";
import { useGalleryLightbox } from "@/hooks/gallery/useGalleryLightbox";
import type { GalleryImage } from "@/types/gallery";
import { GalleryLightbox } from "./components/GalleryLightbox";
import { GalleryTile } from "./components/GalleryTile";
import { GALLERY_SECTIONS } from "./constants";

interface GalleryPageClientProps {
	grouped: Record<string, GalleryImage[]>;
}

export function GalleryPageClient({ grouped }: GalleryPageClientProps) {
	const { lightbox, open, close, prev, next } = useGalleryLightbox();

	return (
		<>
			<div className="py-16 px-4 max-w-[1100px] mx-auto flex flex-col gap-20">
				{GALLERY_SECTIONS.map(({ category, title, icon, description }) => {
					const images = grouped[category] ?? [];

					return (
						<section key={category}>
							<div className="mb-6">
								<h2 className="font-heading text-[clamp(1.5rem,4vw,2.5rem)] uppercase tracking-[3px] text-primary flex items-center gap-3">
									{icon === "image" ? (
										<Image
											src="/images/f1-car.svg"
											alt=""
											width={40}
											height={16}
											className="h-6 w-auto"
											aria-hidden="true"
										/>
									) : (
										<i className={icon} aria-hidden="true" />
									)}
									{title}
								</h2>
								<p className="text-text-gray mt-2 max-w-2xl leading-relaxed">
									{description}
								</p>
							</div>

							{images.length === 0 ? (
								<div className="h-32 flex items-center justify-center border border-gray-mid rounded-xl text-text-gray">
									<i
										className="fas fa-image text-3xl text-primary/30 mr-3"
										aria-hidden="true"
									/>
									No images available
								</div>
							) : (
								<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
									{images.map((img, idx) => (
										<GalleryTile
											key={img.id}
											image={img}
											onClick={() => open(images, idx)}
										/>
									))}
								</div>
							)}
						</section>
					);
				})}
			</div>

			{lightbox && (
				<GalleryLightbox
					images={lightbox.images}
					index={lightbox.index}
					onClose={close}
					onPrev={prev}
					onNext={next}
				/>
			)}
		</>
	);
}
