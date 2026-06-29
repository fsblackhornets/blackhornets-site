"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { ImageIcon, PlusIcon, XIcon } from "@/components/icons";
import { GALLERY_CATEGORY_OPTIONS } from "@/constants/gallery";
import type { CarouselSlide } from "@/hooks/CarouselBlock";

const CATEGORY_OPTIONS = GALLERY_CATEGORY_OPTIONS;

export function CarouselBlockView({
	node,
	updateAttributes,
	deleteNode,
	selected,
}: NodeViewProps) {
	const slides = (node.attrs.slides ?? []) as CarouselSlide[];
	const galleryCategory = node.attrs.galleryCategory as string;
	const [activeIdx, setActiveIdx] = useState(0);

	function addSlide() {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = "image/*";
		input.multiple = true;
		input.onchange = () => {
			const files = Array.from(input.files ?? []);
			const newSlides = files.map((f) => ({
				src: URL.createObjectURL(f),
				alt: f.name,
				galleryCategory,
			}));
			updateAttributes({ slides: [...slides, ...newSlides] });
		};
		input.click();
	}

	function removeSlide(idx: number) {
		const next = slides.filter((_, i) => i !== idx);
		updateAttributes({ slides: next });
		if (activeIdx >= next.length) setActiveIdx(Math.max(0, next.length - 1));
	}

	return (
		<NodeViewWrapper>
			<div
				className={`border border-[#1e1e1e] rounded-sm p-3 my-3 bg-[#0d0d0d] ${selected ? "ring-2 ring-primary/60" : ""}`}
				data-drag-handle
			>
				{/* Header */}
				<div className="flex items-center justify-between mb-2">
					<div className="flex items-center gap-2">
						<ImageIcon
							size={11}
							strokeWidth={1.5}
							className="text-primary/50"
						/>
						<span className="font-heading text-[7px] tracking-[3px] uppercase text-primary/60">
							Carousel
						</span>
						<span
							className="font-heading text-[6px] tracking-[2px] uppercase border border-primary/20 text-primary/50 px-1.5 py-0.5"
							style={{
								clipPath:
									"polygon(0 0, calc(100% - 3px) 0, 100% 100%, 3px 100%)",
							}}
						>
							{CATEGORY_OPTIONS.find((c) => c.value === galleryCategory)
								?.label ?? galleryCategory}
						</span>
					</div>
					<div className="flex gap-1">
						<select
							value={galleryCategory}
							onChange={(e) =>
								updateAttributes({ galleryCategory: e.target.value })
							}
							className="bg-[#111] border border-[#2a2a2a] text-[8px] text-[#888] px-1.5 py-0.5 font-body"
						>
							{CATEGORY_OPTIONS.map((o) => (
								<option key={o.value} value={o.value}>
									{o.label}
								</option>
							))}
						</select>
						<button
							type="button"
							onClick={deleteNode}
							className="w-5 h-5 flex items-center justify-center text-[#333] hover:text-red-400"
						>
							<XIcon size={10} />
						</button>
					</div>
				</div>

				{/* Active preview */}
				{slides.length > 0 ? (
					<div className="mb-2">
						{/* biome-ignore lint/performance/noImgElement: editor uses dynamic object URLs */}
						<img
							src={slides[activeIdx]?.src}
							alt={slides[activeIdx]?.alt}
							className="w-full h-40 object-cover border border-[#1e1e1e]"
						/>
					</div>
				) : (
					<div className="w-full h-32 bg-[#0f0f0f] border border-dashed border-[#2a2a2a] flex items-center justify-center mb-2">
						<span className="font-heading text-[8px] tracking-[2px] uppercase text-[#333]">
							No slides yet
						</span>
					</div>
				)}

				{/* Thumbnails */}
				<div className="flex gap-1.5 flex-wrap">
					{slides.map((s, i) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: slides have no stable ID
						<div key={`slide-${i}`} className="relative group">
							{/* biome-ignore lint/performance/noImgElement: editor uses dynamic object URLs */}
							<img
								src={s.src}
								alt={s.alt}
								className={`w-12 h-12 object-cover cursor-pointer border-2 transition-colors ${i === activeIdx ? "border-primary" : "border-[#1e1e1e] hover:border-[#333]"}`}
								onClick={() => setActiveIdx(i)}
								onKeyDown={(e) => {
									if (e.key === "Enter" || e.key === " ") setActiveIdx(i);
								}}
							/>
							<button
								type="button"
								onClick={() => removeSlide(i)}
								className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<XIcon size={6} strokeWidth={3} className="text-white" />
							</button>
						</div>
					))}
					<button
						type="button"
						onClick={addSlide}
						className="w-12 h-12 border border-dashed border-[#2a2a2a] flex items-center justify-center text-[#333] hover:text-[#555] hover:border-[#444] transition-colors"
					>
						<PlusIcon size={14} />
					</button>
				</div>

				<p className="font-body text-[8px] text-[#333] mt-2">
					{slides.length} slide{slides.length !== 1 ? "s" : ""} · Gallery:{" "}
					{galleryCategory}
				</p>
			</div>
		</NodeViewWrapper>
	);
}
