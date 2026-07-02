"use client";

import { Calendar, Image as ImageIcon, User } from "lucide-react";
import { useState } from "react";

interface BlogPostPreviewProps {
	titleSr: string;
	category: string;
	contentSr: string;
	imagePreviewUrl: string | null;
	author?: string;
	galleryCount?: number;
}

export function BlogPostPreview({
	titleSr,
	category,
	contentSr,
	imagePreviewUrl,
	author,
	galleryCount = 0,
}: BlogPostPreviewProps) {
	const [tab, setTab] = useState<"card" | "full">("card");
	const excerpt = contentSr
		.replace(/<[^>]+>/g, " ")
		.trim()
		.slice(0, 200);

	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<p className="font-heading text-[7px] tracking-[4px] uppercase text-[#333]">
					Live Preview
				</p>
				<div className="flex gap-1">
					{(["card", "full"] as const).map((t) => (
						<button
							key={t}
							type="button"
							onClick={() => setTab(t)}
							className="font-heading text-[6.5px] tracking-[2px] uppercase px-2 py-1 transition-colors"
							style={{
								border: tab === t ? "1px solid #ffd700" : "1px solid #222",
								background: tab === t ? "rgba(255,215,0,0.08)" : "transparent",
								color: tab === t ? "#ffd700" : "#444",
								clipPath:
									"polygon(0 0, calc(100% - 4px) 0, 100% 100%, 4px 100%)",
							}}
						>
							{t === "card" ? "Blog Card" : "Full Post"}
						</button>
					))}
				</div>
			</div>

			{tab === "card" ? (
				// Mirrors BlogPostCard
				<div className="bg-bg-panel rounded-sm border border-[#1e1e1e] border-t-2 border-t-primary/40 overflow-hidden flex flex-col">
					<div className="relative h-48 overflow-hidden shrink-0 bg-bg-dark">
						{imagePreviewUrl ? (
							// biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it
							<img
								src={imagePreviewUrl}
								alt={titleSr || "Preview"}
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full flex items-center justify-center">
								<ImageIcon
									size={28}
									strokeWidth={1.5}
									className="text-primary/15"
								/>
							</div>
						)}
						{category && (
							<div className="absolute bottom-2 left-2">
								<span
									className="font-body font-medium text-[6px] tracking-[1.5px] uppercase text-primary bg-primary/10 px-2 py-0.5"
									style={{
										clipPath:
											"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
									}}
								>
									{category}
								</span>
							</div>
						)}
					</div>
					<div className="p-5 flex flex-col flex-1 gap-2.5">
						<h2 className="font-heading text-[#e0e0e0] text-[10px] tracking-wide leading-snug">
							{titleSr || (
								<span className="text-[#444] italic normal-case">
									Post title…
								</span>
							)}
						</h2>
						<p className="text-text-gray text-[10px] leading-relaxed flex-1 line-clamp-3 font-body">
							{excerpt || (
								<span className="italic">Post content will appear here…</span>
							)}
						</p>
						<div className="flex items-center justify-between border-t border-[#1c1c1c] pt-2 mt-auto gap-2">
							<div className="flex gap-3 text-[9px] text-text-gray font-body flex-wrap">
								<span className="flex items-center gap-1">
									<Calendar size={9} strokeWidth={2} />
									Just now
								</span>
								<span className="flex items-center gap-1">
									<User size={9} strokeWidth={2} />
									{author || "Team Black Hornets"}
								</span>
							</div>
							<span className="font-heading text-[7px] tracking-[1px] text-primary/50 shrink-0">
								Read ›
							</span>
						</div>
					</div>
				</div>
			) : (
				// Mirrors /blog/[id] main column
				<div className="bg-bg-dark border border-[#1e1e1e] border-t-2 border-t-primary/40 rounded-sm overflow-hidden">
					<div className="p-8">
						{category && (
							<span
								className="inline-block font-body text-[7px] tracking-[1.5px] uppercase bg-primary/10 text-primary border border-primary/20 px-2.5 py-1.5 mb-4"
								style={{
									clipPath:
										"polygon(0 0, calc(100% - 5px) 0, 100% 100%, 5px 100%)",
								}}
							>
								{category}
							</span>
						)}
						{titleSr && (
							<h1 className="font-heading text-[clamp(1.6rem,4vw,2.4rem)] text-primary uppercase tracking-[1px] leading-tight mb-5">
								{titleSr}
							</h1>
						)}
						{imagePreviewUrl && (
							<div className="relative mb-8 border border-[#222] h-56 overflow-hidden">
								{/* biome-ignore lint/performance/noImgElement: blob preview URL, next/image can't handle it */}
								<img
									src={imagePreviewUrl}
									alt={titleSr || "Preview"}
									className="w-full h-full object-cover"
								/>
							</div>
						)}
						<div
							className="prose prose-invert prose-yellow max-w-none text-text-light leading-relaxed
								[&_h2]:font-heading [&_h2]:text-white [&_h2]:uppercase [&_h2]:tracking-[2px] [&_h2]:flex [&_h2]:items-center [&_h2]:gap-2.5 [&_h2]:before:content-[''] [&_h2]:before:w-[3px] [&_h2]:before:h-5 [&_h2]:before:bg-primary [&_h2]:before:flex-shrink-0
								[&_h3]:font-heading [&_h3]:text-primary
								[&_blockquote]:border-l-[3px] [&_blockquote]:border-primary [&_blockquote]:bg-primary/[0.04] [&_blockquote]:rounded-none [&_blockquote]:px-5 [&_blockquote]:py-4
								[&_img]:rounded-none [&_img]:border [&_img]:border-[#1e1e1e]
								[&_a]:text-primary [&_a]:no-underline [&_a]:border-b [&_a]:border-primary/30 [&_a]:hover:border-primary"
							// biome-ignore lint/security/noDangerouslySetInnerHtml: rendering trusted editor content preview
							dangerouslySetInnerHTML={{
								__html:
									contentSr ||
									"<p class='text-[#333] italic'>Post content will appear here…</p>",
							}}
						/>
					</div>
					{galleryCount > 0 && (
						<div className="border-t border-[#1e1e1e] px-5 py-3 flex items-center gap-2">
							<ImageIcon
								size={10}
								strokeWidth={1.5}
								className="text-primary/40"
							/>
							<span className="font-body text-[8px] text-[#333]">
								Gallery: {galleryCount} image{galleryCount !== 1 ? "s" : ""}{" "}
								queued
							</span>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
