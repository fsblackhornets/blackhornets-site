import Image from "next/image";
import { toggleGalleryImageAction } from "@/app/actions/gallery";
import { Switch } from "@/components/ui/components/Switch";
import { GALLERY_SECTIONS } from "@/constants/gallery";
import { buildAdminMeta } from "@/helpers/buildAdminMeta";
import { fetchAdminGallery } from "@/lib/api/admin";
import { buildGalleryImageUrl } from "@/lib/utils/utils";
import { GalleryDeleteButton } from "./GalleryDeleteButton";
import { GalleryUploadForm } from "./GalleryUploadForm";

export const metadata = buildAdminMeta("Gallery");

export default async function GalleryPage() {
	const images = await fetchAdminGallery();
	const byCategory = Object.fromEntries(
		GALLERY_SECTIONS.map(({ category }) => [
			category,
			images.filter((img) => img.category === category),
		]),
	);

	return (
		<div className="max-w-[1100px]">
			<div className="flex items-center gap-3 mb-6">
				<h1 className="font-heading text-[14px] tracking-[2px] uppercase text-primary">
					Gallery
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<span className="font-body text-[8.5px] text-[#444]">
					{images.length} images
				</span>
			</div>

			{/* Upload */}
			<div className="bg-[#111] border border-[#1e1e1e] rounded-sm p-6 mb-8">
				<h2 className="font-heading text-[9px] tracking-[4px] uppercase text-primary mb-4">
					Upload Image
				</h2>
				<GalleryUploadForm />
			</div>

			{/* Gallery by category */}
			{GALLERY_SECTIONS.map(({ category, title }) => {
				const items = byCategory[category] ?? [];
				return (
					<section key={category} className="mb-10">
						<div className="flex items-center gap-3 mb-3">
							<h2 className="font-heading text-[9px] tracking-[4px] uppercase text-primary/70">
								{title}
							</h2>
							<div className="flex-1 h-px bg-[#1e1e1e]" />
							<span className="font-body text-[8px] text-[#333]">
								{items.length}
							</span>
						</div>

						{items.length === 0 ? (
							<p className="font-body text-[9px] text-[#333]">
								No images in this category.
							</p>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
								{items.map((img) => (
									<div
										key={img.id}
										className={`group relative rounded-sm overflow-hidden border ${img.is_active ? "border-primary/30" : "border-[#1e1e1e] opacity-40"}`}
									>
										<div className="relative aspect-square">
											<Image
												src={buildGalleryImageUrl(img.image_path)}
												alt={img.alt_text ?? img.title ?? ""}
												fill
												className="object-cover"
												sizes="(max-width: 640px) 50vw, 20vw"
											/>
										</div>

										{/* Overlay controls */}
										<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-2 flex items-center justify-between gap-1">
											<form
												action={async () => {
													"use server";
													await toggleGalleryImageAction(img.id);
												}}
											>
												<Switch
													checked={img.is_active === 1}
													label="Toggle visibility"
												/>
												<button type="submit" className="sr-only">
													Toggle
												</button>
											</form>
											<GalleryDeleteButton id={img.id} />
										</div>

										{img.title && (
											<div className="absolute top-1 left-1 right-1">
												<span className="bg-black/70 font-body text-[7px] text-white/60 px-1.5 py-0.5 truncate block">
													{img.title}
												</span>
											</div>
										)}
									</div>
								))}
							</div>
						)}
					</section>
				);
			})}
		</div>
	);
}
