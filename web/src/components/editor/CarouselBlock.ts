import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CarouselBlockView } from "./CarouselBlockView";

export interface CarouselSlide {
	src: string;
	alt: string;
	galleryCategory: string;
}

export const CarouselBlock = Node.create({
	name: "carouselBlock",
	group: "block",
	atom: true,
	draggable: true,

	addAttributes() {
		return {
			slides: { default: [] },
			galleryCategory: { default: "team" },
		};
	},

	parseHTML() {
		return [
			{
				tag: "div[data-carousel]",
				getAttrs: (el) => {
					const div = el as HTMLElement;
					const imgs = Array.from(div.querySelectorAll("img")).map((img) => ({
						src: img.getAttribute("src") ?? "",
						alt: img.getAttribute("alt") ?? "",
						galleryCategory:
							div.getAttribute("data-gallery-category") ?? "team",
					}));
					return {
						slides: imgs,
						galleryCategory:
							div.getAttribute("data-gallery-category") ?? "team",
					};
				},
			},
		];
	},

	renderHTML({ HTMLAttributes }) {
		const { slides, galleryCategory } = HTMLAttributes as {
			slides: CarouselSlide[];
			galleryCategory: string;
		};
		return [
			"div",
			{ "data-carousel": "true", "data-gallery-category": galleryCategory },
			...slides.map(
				(s) =>
					["img", { src: s.src, alt: s.alt }] as [
						string,
						Record<string, string>,
					],
			),
		];
	},

	addNodeView() {
		return ReactNodeViewRenderer(CarouselBlockView);
	},
});
