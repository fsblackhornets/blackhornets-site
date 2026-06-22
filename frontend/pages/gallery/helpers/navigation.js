window.navigateGallery = (direction) => {
	const images = window.allGalleryImages || [];
	if (!images.length) return;

	window.currentImageIndex =
		(window.currentImageIndex + direction + images.length) % images.length;
	const { image, imagePath } = images[window.currentImageIndex];
	window.showGalleryDetail(image, imagePath);
};

window.setupGalleryNavigation = () => {
	const modal = document.getElementById("galleryModal");
	const prevBtn = document.getElementById("galleryModalPrev");
	const nextBtn = document.getElementById("galleryModalNext");

	if (modal) {
		modal
			.querySelector(".close-modal")
			?.addEventListener("click", window.closeGalleryModal);
		modal.addEventListener("click", (e) => {
			if (e.target === modal) window.closeGalleryModal();
		});
	}

	if (prevBtn)
		prevBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			window.navigateGallery(-1);
		});
	if (nextBtn)
		nextBtn.addEventListener("click", (e) => {
			e.stopPropagation();
			window.navigateGallery(1);
		});

	document.addEventListener("keydown", (e) => {
		const m = document.getElementById("galleryModal");
		if (!m || m.style.display !== "flex") return;
		if (e.key === "Escape") window.closeGalleryModal();
		if (e.key === "ArrowLeft") window.navigateGallery(-1);
		if (e.key === "ArrowRight") window.navigateGallery(1);
	});
};
