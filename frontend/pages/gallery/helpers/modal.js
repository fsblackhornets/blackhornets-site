window.showGalleryDetail = (image, imagePath) => {
	const modal = document.getElementById("galleryModal");
	if (!modal) return;

	const t = window.getTranslations?.();
	const lang = window.getCurrentLanguage?.() || "en";

	document.getElementById("galleryModalImage").src = imagePath;
	document.getElementById("galleryModalImage").alt =
		image.alt_text || image.title;
	document.getElementById("galleryModalTitle").textContent = image.title;

	const categoryLabel = t?.galleryCategory || "Category";
	document.getElementById("galleryModalCategory").innerHTML =
		`<i class="fas fa-tag"></i> <span>${categoryLabel}: ${window.getCategoryName(image.category)}</span>`;

	const dateLabel = t?.galleryDate || "Added";
	const locale = lang === "sr" ? "sr-Latn-RS" : "en-US";
	const formatted = new Date(image.created_at).toLocaleDateString(locale, {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
	document.getElementById("galleryModalDate").innerHTML =
		`<i class="fas fa-calendar-alt"></i> <span>${dateLabel}: ${formatted}</span>`;

	document.getElementById("galleryModalDescription").textContent =
		window.getImageDescription(image);

	const total = window.allGalleryImages?.length || 0;
	const prevBtn = document.getElementById("galleryModalPrev");
	const nextBtn = document.getElementById("galleryModalNext");
	if (prevBtn) prevBtn.style.display = total > 1 ? "flex" : "none";
	if (nextBtn) nextBtn.style.display = total > 1 ? "flex" : "none";

	modal.style.display = "flex";
	document.body.style.overflow = "hidden";
};

window.closeGalleryModal = () => {
	const modal = document.getElementById("galleryModal");
	if (modal) {
		modal.style.display = "none";
		document.body.style.overflow = "";
	}
};
