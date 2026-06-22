window.escapeHtml = (str) => {
	if (!str) return "";
	const div = document.createElement("div");
	div.textContent = str;
	return div.innerHTML;
};

window.getCategoryName = (category) => {
	const t = window.getTranslations?.();
	const map = {
		race_cars: t?.categoryRaceCars || "Race Cars",
		team: t?.categoryTeam || "Team",
		events: t?.categoryEvents || "Events & Competitions",
		workshop: t?.categoryWorkshop || "Workshop",
	};
	return map[category] || category;
};

window.getImageDescription = (image) => {
	const lang = window.getCurrentLanguage?.() || "en";
	return lang === "en" && image.description_en
		? image.description_en
		: image.description || "";
};

window.renderGalleryGrid = (data, gridId) => {
	const grid = document.getElementById(gridId);
	if (!grid) return;

	const t = window.getTranslations?.();

	if (!data.success || !data.data.length) {
		grid.innerHTML = `
            <div class="gallery-item placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-image"></i>
                    <p>${t?.noImagesAvailable || "No images available"}</p>
                </div>
            </div>`;
		return;
	}

	grid.innerHTML = "";
	data.data.forEach((image) => {
		const imagePath = image.image_path
			? `/frontend/admin/${image.image_path}`
			: "";
		const entry = { image, imagePath };
		window.allGalleryImages.push(entry);
		const entryIndex = window.allGalleryImages.length - 1;

		const item = document.createElement("div");
		item.className = "gallery-item";
		item.innerHTML = `
            <img src="${window.escapeHtml(imagePath)}" alt="${window.escapeHtml(image.alt_text || image.title)}" loading="lazy">
            <div class="gallery-item-info">
                <h3 class="gallery-item-title">${window.escapeHtml(image.title)}</h3>
                <p class="gallery-item-description">${window.escapeHtml(window.getImageDescription(image))}</p>
            </div>`;

		item.addEventListener("click", () => {
			window.currentImageIndex = entryIndex;
			window.showGalleryDetail(image, imagePath);
		});

		grid.appendChild(item);
	});
};

window.renderGalleryError = (gridId) => {
	const grid = document.getElementById(gridId);
	if (!grid) return;
	const t = window.getTranslations?.();
	grid.innerHTML = `
        <div class="gallery-item placeholder">
            <div class="placeholder-content">
                <i class="fas fa-exclamation-triangle"></i>
                <p>${t?.errorLoadingImages || "Error loading images"}</p>
            </div>
        </div>`;
};
