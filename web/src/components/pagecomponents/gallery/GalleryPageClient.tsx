"use client";

import { useRef } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useGalleryLightbox } from "@/hooks/gallery/useGalleryLightbox";
import type { GalleryImage } from "@/types/gallery";
import { GalleryLightbox } from "./components/GalleryLightbox";
import { GalleryTile } from "./components/GalleryTile";
import { GALLERY_SECTIONS } from "@/constants/gallery";

interface GalleryPageClientProps {
	grouped: Record<string, GalleryImage[]>;
}

export function GalleryPageClient({ grouped }: GalleryPageClientProps) {
	const { lightbox, open, close, prev, next } = useGalleryLightbox();
	const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

	const goTo = (index: number) => lightbox && open(lightbox.images, index);

	const scrollTo = (category: string) => {
		sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth" });
	};

	return (
		<>
			{/* Section nav tab bar */}
			<nav
				className="sticky top-0 z-30 flex border-b border-[#1a1a1a] bg-[#0a0a0a] px-14 overflow-x-auto"
				aria-label="Gallery sections"
			>
				{GALLERY_SECTIONS.map(({ category, title }) => (
					<button
						key={category}
						type="button"
						onClick={() => scrollTo(category)}
						className="font-heading text-[8px] tracking-[3px] uppercase px-5 py-4 border-b-2 border-transparent text-[#444] hover:text-primary transition-colors duration-200 shrink-0"
						style={
							/* ponytail: inline style to avoid needing group/peer tricks for active state — no active state from scroll position, only click-driven */
							undefined
						}
					>
						{title}
					</button>
				))}
			</nav>

			<div className="py-16 px-4 max-w-screen-2xl mx-auto flex flex-col gap-12">
				{GALLERY_SECTIONS.map(
					({ category, title, description }, sectionIdx) => {
						const images = grouped[category] ?? [];
						const words = title.split(" ");
						const lastWord = words.pop() ?? title;
						const rest = words.join(" ");
						const isFeatured = category === "race_cars" && images.length >= 5;

						return (
							<section
								key={category}
								ref={(el) => {
									sectionRefs.current[category] = el;
								}}
								className={
									sectionIdx > 0 ? "border-t border-[#1a1a1a] pt-10" : ""
								}
							>
								{/* Section header */}
								<div className="flex items-start justify-between gap-4 mb-6">
									<div>
										<span className="font-heading text-[9px] tracking-[5px] uppercase text-primary block mb-2">
											Category
										</span>
										<h2 className="font-heading font-black text-white leading-tight text-2xl">
											{rest && `${rest} `}
											<span
												style={{
													background:
														"linear-gradient(90deg, #ffd700, #ffc107)",
													WebkitBackgroundClip: "text",
													WebkitTextFillColor: "transparent",
													backgroundClip: "text",
												}}
											>
												{lastWord}
											</span>
										</h2>
										{description && (
											<p className="font-body text-text-gray text-sm leading-relaxed mt-2 max-w-2xl">
												{description}
											</p>
										)}
									</div>
									<span
										className="font-heading text-[9px] tracking-[2px] uppercase shrink-0 mt-1"
										style={{ color: "#3a3a3a" }}
									>
										{images.length} photo{images.length !== 1 ? "s" : ""}
									</span>
								</div>

								{/* Grid or empty state */}
								{images.length === 0 ? (
									<div className="h-32 flex flex-col items-center justify-center gap-3 border border-[#1e1e1e] rounded-sm bg-bg-dark">
										<ImageIcon size={28} strokeWidth={1.5} stroke="rgba(255,215,0,.25)" aria-hidden="true" />
										<p
											className="font-heading text-[9px] tracking-[3px] uppercase"
											style={{ color: "#333" }}
										>
											No Images Available
										</p>
										<p className="font-body text-[9px] text-text-gray/40">
											Check back soon.
										</p>
									</div>
								) : (
									<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
										{images.map((img, idx) => (
											<GalleryTile
												key={img.id}
												image={img}
												featured={isFeatured && idx === 0}
												onClick={() => open(images, idx)}
											/>
										))}
									</div>
								)}
							</section>
						);
					},
				)}
			</div>

			{lightbox && (
				<GalleryLightbox
					images={lightbox.images}
					index={lightbox.index}
					onClose={close}
					onPrev={prev}
					onNext={next}
					onGoTo={goTo}
				/>
			)}
		</>
	);
}
