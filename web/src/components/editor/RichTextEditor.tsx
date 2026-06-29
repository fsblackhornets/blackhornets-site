"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import { CarouselBlock } from "./CarouselBlock";
import { ImageBlock } from "./ImageBlock";
import { ImageInsertModal } from "./ImageInsertModal";

interface Props {
	content?: string;
	placeholder?: string;
	onChange?: (html: string) => void;
}

function ToolbarButton({
	active,
	onClick,
	title,
	children,
}: {
	active?: boolean;
	onClick: () => void;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			className={`w-7 h-7 flex items-center justify-center text-[10px] transition-colors rounded-none ${active ? "bg-primary/12 text-primary" : "text-[#555] hover:bg-primary/8 hover:text-primary"}`}
		>
			{children}
		</button>
	);
}

export function RichTextEditor({
	content = "",
	placeholder = "Start writing…",
	onChange,
}: Props) {
	const [showImageModal, setShowImageModal] = useState(false);

	const editor = useEditor({
		extensions: [
			StarterKit.configure({ heading: { levels: [2, 3] } }),
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({ placeholder }),
			Link.configure({ openOnClick: false }),
			ImageBlock,
			CarouselBlock,
		],
		content,
		editorProps: {
			attributes: {
				class:
					"min-h-[280px] px-4 py-3 text-[11px] font-body text-[#e0e0e0] leading-relaxed focus:outline-none",
			},
		},
		onUpdate({ editor: e }) {
			onChange?.(e.getHTML());
		},
	});

	if (!editor) return null;

	function insertImage(attrs: {
		src: string;
		alt: string;
		caption: string;
		align: "left" | "center" | "right";
		galleryCategory: string;
	}) {
		editor?.chain().focus().insertContent({ type: "imageBlock", attrs }).run();
		setShowImageModal(false);
	}

	function insertCarousel() {
		editor
			?.chain()
			.focus()
			.insertContent({
				type: "carouselBlock",
				attrs: { slides: [], galleryCategory: "team" },
			})
			.run();
	}

	function setLink() {
		const url = window.prompt("Enter URL");
		if (url) editor.chain().focus().setLink({ href: url }).run();
	}

	return (
		<div className="border border-[#2a2a2a] rounded-none bg-[#0e0e0e]">
			{/* Toolbar */}
			<div className="bg-[#0a0a0a] border-b border-[#1a1a1a] px-1 py-0.5 flex items-center gap-0.5 flex-wrap">
				<ToolbarButton
					active={editor.isActive("bold")}
					onClick={() => editor.chain().focus().toggleBold().run()}
					title="Bold"
				>
					<strong>B</strong>
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("italic")}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					title="Italic"
				>
					<em>I</em>
				</ToolbarButton>

				<div className="w-px h-5 bg-[#1e1e1e] mx-0.5" />

				<ToolbarButton
					active={editor.isActive("heading", { level: 2 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 2 }).run()
					}
					title="Heading 2"
				>
					H2
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("heading", { level: 3 })}
					onClick={() =>
						editor.chain().focus().toggleHeading({ level: 3 }).run()
					}
					title="Heading 3"
				>
					H3
				</ToolbarButton>

				<div className="w-px h-5 bg-[#1e1e1e] mx-0.5" />

				<ToolbarButton
					active={editor.isActive("bulletList")}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					title="Bullet list"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<line x1="9" y1="6" x2="20" y2="6" />
						<line x1="9" y1="12" x2="20" y2="12" />
						<line x1="9" y1="18" x2="20" y2="18" />
						<circle cx="4" cy="6" r="1" fill="currentColor" />
						<circle cx="4" cy="12" r="1" fill="currentColor" />
						<circle cx="4" cy="18" r="1" fill="currentColor" />
					</svg>
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("blockquote")}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					title="Blockquote"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
						<path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
					</svg>
				</ToolbarButton>

				<div className="w-px h-5 bg-[#1e1e1e] mx-0.5" />

				<ToolbarButton
					onClick={() => setShowImageModal(true)}
					title="Insert image"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<rect x="3" y="3" width="18" height="18" rx="2" />
						<circle cx="8.5" cy="8.5" r="1.5" />
						<polyline points="21 15 16 10 5 21" />
					</svg>
				</ToolbarButton>
				<ToolbarButton onClick={insertCarousel} title="Insert carousel">
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<rect x="2" y="7" width="20" height="15" rx="2" />
						<path d="M16 3l4 4-4 4" />
						<path d="M8 3l-4 4 4 4" />
					</svg>
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("link")}
					onClick={setLink}
					title="Insert link"
				>
					<svg
						width="12"
						height="12"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2}
						aria-hidden="true"
					>
						<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
						<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
					</svg>
				</ToolbarButton>
			</div>

			<EditorContent editor={editor} />

			{showImageModal && (
				<ImageInsertModal
					onInsert={insertImage}
					onClose={() => setShowImageModal(false)}
				/>
			)}
		</div>
	);
}

export function extractGalleryItems(html: string): Array<{
	src: string;
	galleryCategory: string;
	alt: string;
	caption: string;
}> {
	if (typeof window === "undefined") return [];
	const div = document.createElement("div");
	div.innerHTML = html;
	const items: Array<{
		src: string;
		galleryCategory: string;
		alt: string;
		caption: string;
	}> = [];

	for (const fig of Array.from(
		div.querySelectorAll("figure[data-image-block]"),
	)) {
		const el = fig as HTMLElement;
		const cat = el.getAttribute("data-gallery-category") ?? "none";
		if (cat === "none") continue;
		const img = el.querySelector("img");
		const cap = el.querySelector("figcaption");
		items.push({
			src: img?.getAttribute("src") ?? "",
			galleryCategory: cat,
			alt: img?.getAttribute("alt") ?? "",
			caption: cap?.textContent ?? "",
		});
	}

	for (const carousel of Array.from(
		div.querySelectorAll("div[data-carousel]"),
	)) {
		const el = carousel as HTMLElement;
		const cat = el.getAttribute("data-gallery-category") ?? "team";
		for (const img of Array.from(el.querySelectorAll("img"))) {
			items.push({
				src: (img as HTMLImageElement).src ?? "",
				galleryCategory: cat,
				alt: (img as HTMLImageElement).alt ?? "",
				caption: "",
			});
		}
	}

	return items;
}
