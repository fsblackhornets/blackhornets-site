import { mergeAttributes, Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { ImageBlockView } from "./ImageBlockView";

export interface ImageBlockAttrs {
	src: string;
	alt: string;
	caption: string;
	align: "left" | "center" | "right";
	galleryCategory: string;
}

export const ImageBlock = Node.create<object, object>({
	name: "imageBlock",
	group: "block",
	atom: true,
	draggable: true,

	addAttributes() {
		return {
			src: { default: "" },
			alt: { default: "" },
			caption: { default: "" },
			align: { default: "center" },
			galleryCategory: { default: "none" },
		};
	},

	parseHTML() {
		return [
			{
				tag: "figure[data-image-block]",
				getAttrs: (el) => {
					const fig = el as HTMLElement;
					const img = fig.querySelector("img");
					const figcap = fig.querySelector("figcaption");
					return {
						src: img?.getAttribute("src") ?? "",
						alt: img?.getAttribute("alt") ?? "",
						caption: figcap?.textContent ?? "",
						align: fig.getAttribute("data-align") ?? "center",
						galleryCategory:
							fig.getAttribute("data-gallery-category") ?? "none",
					};
				},
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		const { src, alt, caption, align, galleryCategory } =
			HTMLAttributes as ImageBlockAttrs;
		return [
			"figure",
			{
				"data-image-block": "",
				"data-align": align,
				"data-gallery-category": galleryCategory,
			},
			["img", mergeAttributes({ src, alt })],
			["figcaption", {}, caption],
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(ImageBlockView);
	},
});
