import Image from "next/image";
import { toggleGalleryImageAction } from "@/app/actions/gallery";
import { GALLERY_SECTIONS } from "@/components/pagecomponents/gallery/constants";
import { Switch } from "@/components/ui/components/Switch";
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
				<h1 className="font-heading text-xl text-primary tracking-widest uppercase">
					Gallery
				</h1>
				<div className="flex-1 h-px bg-primary/12" />
				<span className="text-text-gray text-sm">{images.length} images</span>
			</div>

			{/* Upload */}
			<div className="bg-[#111] border border-primary/12 rounded-2xl p-6 mb-8">
				<h2 className="font-heading text-sm tracking-widest text-primary uppercase mb-4">
					Upload Image
				</h2>
				<GalleryUploadForm />
			</div>

			{/* Gallery by category */}
			{GALLERY_SECTIONS.map(({ category, title }) => {
				const items = byCategory[category] ?? [];
				return (
					<section key={category} className="mb-10">
						<div className="flex items-center gap-3 mb-4">
							<h2 className="font-heading text-sm tracking-widest text-primary uppercase">
								{title}
							</h2>
							<div className="flex-1 h-px bg-primary/12" />
							<span className="text-text-gray text-xs">{items.length}</span>
						</div>

						{items.length === 0 ? (
							<p className="text-text-gray text-sm">
								No images in this category.
							</p>
						) : (
							<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
								{items.map((img) => (
									<div
										key={img.id}
										className={`group relative rounded-xl overflow-hidden border ${img.is_active ? "border-primary/20" : "border-gray-mid opacity-50"}`}
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
													onCheckedChange={() => {}}
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
												<span className="text-[10px] text-white/70 bg-black/60 rounded px-1 truncate block">
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
