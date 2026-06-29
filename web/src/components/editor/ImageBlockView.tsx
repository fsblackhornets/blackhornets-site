"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";

const ALIGN_CLASSES = {
	left: "float-left w-[44%] mr-4 mb-2 clear-left",
	center: "w-full clear-both my-3",
	right: "float-right w-[44%] ml-4 mb-2 clear-right",
};

export function ImageBlockView({
	node,
	updateAttributes,
	deleteNode,
	selected,
}: NodeViewProps) {
	const { src, alt, caption, align, galleryCategory } = node.attrs as {
		src: string;
		alt: string;
		caption: string;
		align: "left" | "center" | "right";
		galleryCategory: string;
	};
	const [hovered, setHovered] = useState(false);

	return (
		<NodeViewWrapper
			className={
				ALIGN_CLASSES[align as keyof typeof ALIGN_CLASSES] ??
				ALIGN_CLASSES.center
			}
		>
			<figure
				className={`relative group ${selected ? "ring-2 ring-primary/60" : ""}`}
				onMouseEnter={() => setHovered(true)}
				onMouseLeave={() => setHovered(false)}
				data-drag-handle
			>
				{/* Hover toolbar */}
				{hovered && (
					<div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-[#0a0a0a]/90 border border-[#2a2a2a] px-1.5 py-1">
						{(["left", "center", "right"] as const).map((a) => (
							<button
								key={a}
								type="button"
								onClick={() => updateAttributes({ align: a })}
								className={`w-5 h-5 flex items-center justify-center text-[8px] transition-colors ${align === a ? "text-primary" : "text-[#555] hover:text-[#888]"}`}
								title={`Align ${a}`}
							>
								{a === "left" ? "⬅" : a === "center" ? "⬛" : "➡"}
							</button>
						))}
						<div className="w-px h-3 bg-[#2a2a2a]" />
						<button
							type="button"
							onClick={deleteNode}
							className="w-5 h-5 flex items-center justify-center text-[#555] hover:text-red-400 transition-colors"
							title="Delete"
						>
							<svg
								width="10"
								height="10"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={2}
								aria-hidden="true"
							>
								<line x1="18" y1="6" x2="6" y2="18" />
								<line x1="6" y1="6" x2="18" y2="18" />
							</svg>
						</button>
					</div>
				)}

				{src ? (
					// biome-ignore lint/performance/noImgElement: editor uses dynamic object URLs
					<img
						src={src}
						alt={alt}
						className="w-full block border border-[#1e1e1e]"
					/>
				) : (
					<div className="w-full aspect-video bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center">
						<svg
							width="28"
							height="28"
							viewBox="0 0 24 24"
							fill="none"
							stroke="rgba(255,215,0,0.15)"
							strokeWidth={1.5}
							aria-hidden="true"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<polyline points="21 15 16 10 5 21" />
						</svg>
					</div>
				)}

				{caption && (
					<figcaption className="text-[9px] text-[#555] font-body text-center mt-1 italic">
						{caption}
					</figcaption>
				)}

				{galleryCategory && galleryCategory !== "none" && (
					<span className="absolute bottom-2 left-2 font-heading text-[6px] tracking-[2px] uppercase bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5">
						Gallery: {galleryCategory}
					</span>
				)}
			</figure>
		</NodeViewWrapper>
	);
}
