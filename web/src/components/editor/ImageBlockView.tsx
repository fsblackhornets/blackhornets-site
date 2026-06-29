"use client";

import type { NodeViewProps } from "@tiptap/react";
import { NodeViewWrapper } from "@tiptap/react";
import { useState } from "react";
import { ImageIcon, XIcon } from "@/components/icons";
import { ALIGN_CLASSES } from "./constants";

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
							<XIcon size={10} />
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
						<ImageIcon
							size={28}
							strokeWidth={1.5}
							className="text-primary/15"
						/>
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
