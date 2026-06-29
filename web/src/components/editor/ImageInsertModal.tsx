"use client";

import { useRef, useState } from "react";
import { ImageIcon, XIcon } from "@/components/icons";
import { ALIGNMENTS, GALLERY_CATS } from "./constants";

interface Props {
	onInsert: (attrs: {
		src: string;
		alt: string;
		caption: string;
		align: "left" | "center" | "right";
		galleryCategory: string;
	}) => void;
	onClose: () => void;
}

export function ImageInsertModal({ onInsert, onClose }: Props) {
	const [preview, setPreview] = useState<string | null>(null);
	const [alt, setAlt] = useState("");
	const [caption, setCaption] = useState("");
	const [align, setAlign] = useState<"left" | "center" | "right">("center");
	const [galleryCategory, setGalleryCategory] = useState("none");
	const [dragging, setDragging] = useState(false);
	const fileRef = useRef<HTMLInputElement>(null);

	function handleFile(file: File) {
		const url = URL.createObjectURL(file);
		setPreview(url);
		if (!alt) setAlt(file.name.replace(/\.[^.]+$/, ""));
	}

	function handleDrop(e: React.DragEvent) {
		e.preventDefault();
		setDragging(false);
		const file = e.dataTransfer.files[0];
		if (file?.type.startsWith("image/")) handleFile(file);
	}

	function handleInsert() {
		if (!preview) return;
		onInsert({ src: preview, alt, caption, align, galleryCategory });
	}

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
			<div className="bg-[#111] border border-[#1e1e1e] border-t-2 border-t-primary rounded-sm w-full max-w-[520px] mx-4 p-5 max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-5 pb-3 border-b border-[#1e1e1e]">
					<div className="flex items-center gap-2">
						<ImageIcon size={13} strokeWidth={1.5} className="text-primary" />
						<span className="font-heading text-[8px] tracking-[4px] uppercase text-primary">
							Insert Image
						</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-[#444] hover:text-[#888] transition-colors"
					>
						<XIcon size={14} />
					</button>
				</div>

				{/* Drop zone */}
				<button
					type="button"
					className={`border-2 border-dashed rounded-sm p-6 mb-4 text-center cursor-pointer transition-colors ${dragging ? "border-primary/60 bg-primary/5" : "border-[#2a2a2a] hover:border-[#444]"}`}
					onDragOver={(e) => {
						e.preventDefault();
						setDragging(true);
					}}
					onDragLeave={() => setDragging(false)}
					onDrop={handleDrop}
					onClick={() => fileRef.current?.click()}
				>
					{preview ? (
						// biome-ignore lint/performance/noImgElement: preview uses object URL
						<img
							src={preview}
							alt="preview"
							className="max-h-40 mx-auto object-contain border border-[#1e1e1e]"
						/>
					) : (
						<>
							<ImageIcon
								size={24}
								strokeWidth={1.5}
								className="mx-auto mb-2 text-primary/25"
							/>
							<p className="font-body text-[9px] text-[#444]">
								Drag & drop or click to browse
							</p>
						</>
					)}
				</button>
				<input
					ref={fileRef}
					type="file"
					accept="image/*"
					className="sr-only"
					onChange={(e) => {
						const f = e.target.files?.[0];
						if (f) handleFile(f);
					}}
				/>

				{/* Gallery category */}
				<div className="mb-4">
					<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-2">
						Gallery Category
					</p>
					<div className="grid grid-cols-3 gap-1.5">
						{GALLERY_CATS.map((cat) => (
							<button
								key={cat.value}
								type="button"
								onClick={() => setGalleryCategory(cat.value)}
								className={`border rounded-sm p-2 flex items-center gap-1.5 cursor-pointer transition-colors text-left ${galleryCategory === cat.value ? "border-primary bg-primary/6 text-primary" : "border-[#2a2a2a] text-[#555] hover:border-[#444] hover:text-[#888]"}`}
							>
								<span className="font-body text-[8px] truncate">
									{cat.label}
								</span>
							</button>
						))}
					</div>
					{galleryCategory !== "none" && (
						<p className="font-body text-[8px] text-[#444] mt-2">
							This image will also be submitted as a gallery request in the{" "}
							<span className="text-primary/60">
								{GALLERY_CATS.find((c) => c.value === galleryCategory)?.label}
							</span>{" "}
							category.
						</p>
					)}
				</div>

				{/* Alignment */}
				<div className="mb-4">
					<p className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] mb-2">
						Alignment
					</p>
					<div className="grid grid-cols-3 gap-1.5">
						{ALIGNMENTS.map((a) => (
							<button
								key={a.value}
								type="button"
								onClick={() => setAlign(a.value)}
								className={`border rounded-sm p-2 cursor-pointer transition-colors ${align === a.value ? "border-primary bg-primary/6 text-primary" : "border-[#2a2a2a] text-[#555] hover:border-[#444]"}`}
							>
								{a.diagram}
								<p className="font-heading text-[7px] tracking-[2px] uppercase mt-1 text-center">
									{a.label}
								</p>
							</button>
						))}
					</div>
				</div>

				{/* Alt text + Caption */}
				<div className="flex flex-col gap-3 mb-5">
					<div>
						<label
							htmlFor="img-modal-alt"
							className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] block mb-1"
						>
							Alt Text
						</label>
						<input
							id="img-modal-alt"
							value={alt}
							onChange={(e) => setAlt(e.target.value)}
							placeholder="Brief image description"
							className="w-full bg-[#0e0e0e] border border-[#2a2a2a] px-3 py-2 text-[10px] font-body text-[#e0e0e0] focus:outline-none focus:border-primary/40"
						/>
					</div>
					<div>
						<label
							htmlFor="img-modal-caption"
							className="font-heading text-[7px] tracking-[3px] uppercase text-[#444] block mb-1"
						>
							Caption (optional)
						</label>
						<input
							id="img-modal-caption"
							value={caption}
							onChange={(e) => setCaption(e.target.value)}
							placeholder="Caption shown below image"
							className="w-full bg-[#0e0e0e] border border-[#2a2a2a] px-3 py-2 text-[10px] font-body text-[#e0e0e0] focus:outline-none focus:border-primary/40"
						/>
					</div>
				</div>

				{/* Insert button */}
				<button
					type="button"
					disabled={!preview}
					onClick={handleInsert}
					className="bg-primary text-black font-heading text-[9px] tracking-[3px] uppercase py-3 px-6 flex items-center gap-2 transition-opacity disabled:opacity-40"
					style={{
						clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)",
					}}
				>
					<ImageIcon size={12} />
					Insert Image into Post
				</button>
			</div>
		</div>
	);
}
