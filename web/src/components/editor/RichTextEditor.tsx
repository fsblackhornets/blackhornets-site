"use client";

import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";
import {
	CarouselIcon,
	ImageIcon,
	LinkIcon,
	ListIcon,
	QuoteIcon,
} from "@/components/icons";
import { CarouselBlock } from "@/hooks/CarouselBlock";
import { ImageBlock } from "@/hooks/ImageBlock";
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
					<ListIcon size={12} />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("blockquote")}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					title="Blockquote"
				>
					<QuoteIcon size={12} />
				</ToolbarButton>

				<div className="w-px h-5 bg-[#1e1e1e] mx-0.5" />

				<ToolbarButton
					onClick={() => setShowImageModal(true)}
					title="Insert image"
				>
					<ImageIcon size={12} />
				</ToolbarButton>
				<ToolbarButton onClick={insertCarousel} title="Insert carousel">
					<CarouselIcon size={12} />
				</ToolbarButton>
				<ToolbarButton
					active={editor.isActive("link")}
					onClick={setLink}
					title="Insert link"
				>
					<LinkIcon size={12} />
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
