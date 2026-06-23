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

// Per-section carousel state: gridId → { images, page }
window._galleryState = {};

const PER_ROW = 4; // images per row shown
const ROWS_SHOW = 1; // rows visible at once
const PER_PAGE = PER_ROW * ROWS_SHOW;

window.renderGalleryGrid = (data, gridId) => {
	const wrap = document.getElementById(gridId)?.closest(".gallery-section");
	const grid = document.getElementById(gridId);
	if (!grid) return;

	const t = window.getTranslations?.();

	if (!data.success || !data.data.length) {
		grid.innerHTML = `<div class="gallery-item placeholder"><div class="placeholder-content"><i class="fas fa-image"></i><p>${t?.noImagesAvailable || "No images available"}</p></div></div>`;
		return;
	}

	const images = data.data;
	// Register in allGalleryImages
	const startIdx = window.allGalleryImages.length;
	images.forEach((img) => {
		const imagePath = img.image_path ? `/panel/admin/${img.image_path}` : "";
		window.allGalleryImages.push({ image: img, imagePath });
	});

	window._galleryState[gridId] = { images, startIdx, page: 0 };

	// Build section footer with arrows + View All
	const footer = wrap?.querySelector(".gallery-section-footer");
	if (footer) footer.remove();

	const sectionFooter = document.createElement("div");
	sectionFooter.className = "gallery-section-footer";
	sectionFooter.innerHTML = `
		<button class="g-arrow g-prev" onclick="window.galleryPage('${gridId}',-1)"><i class="fas fa-chevron-left"></i></button>
		<span class="g-page-label" id="${gridId}-label"></span>
		<button class="g-arrow g-next" onclick="window.galleryPage('${gridId}',1)"><i class="fas fa-chevron-right"></i></button>
		<button class="g-viewall" onclick="window.openViewAll('${gridId}')"><i class="fas fa-th"></i> View All</button>
	`;
	grid.insertAdjacentElement("afterend", sectionFooter);

	renderPage(gridId);
};

function renderPage(gridId) {
	const state = window._galleryState[gridId];
	if (!state) return;
	const { images, startIdx, page } = state;
	const grid = document.getElementById(gridId);
	if (!grid) return;

	const totalPages = Math.ceil(images.length / PER_PAGE);
	const start = page * PER_PAGE;
	const slice = images.slice(start, start + PER_PAGE);

	grid.innerHTML = "";
	slice.forEach((img, i) => {
		const globalIdx = startIdx + start + i;
		const imagePath = img.image_path ? `/panel/admin/${img.image_path}` : "";
		const item = document.createElement("div");
		item.className = "gallery-item";
		item.innerHTML = `<img src="${window.escapeHtml(imagePath)}" alt="${window.escapeHtml(img.alt_text || img.title || "")}" loading="lazy">`;
		item.addEventListener("click", () => {
			window.currentImageIndex = globalIdx;
			window.showGalleryDetail(img, imagePath);
		});
		grid.appendChild(item);
	});

	// Update label + arrow visibility
	const label = document.getElementById(`${gridId}-label`);
	if (label)
		label.textContent = totalPages > 1 ? `${page + 1} / ${totalPages}` : "";

	const footer = grid.nextElementSibling;
	if (footer?.classList.contains("gallery-section-footer")) {
		const prev = footer.querySelector(".g-prev");
		const next = footer.querySelector(".g-next");
		if (prev) prev.style.opacity = page === 0 ? "0.3" : "1";
		if (next) next.style.opacity = page >= totalPages - 1 ? "0.3" : "1";
		// Hide footer if only 1 page
		footer.style.display = totalPages <= 1 ? "none" : "flex";
	}
}

window.galleryPage = (gridId, dir) => {
	const state = window._galleryState[gridId];
	if (!state) return;
	const totalPages = Math.ceil(state.images.length / PER_PAGE);
	state.page = Math.max(0, Math.min(totalPages - 1, state.page + dir));
	renderPage(gridId);
};

// ── View All Modal ──
window.openViewAll = (gridId) => {
	const state = window._galleryState[gridId];
	if (!state) return;

	const MODAL_PER_PAGE = 20; // 5×4
	let modalPage = 0;
	const { images, startIdx } = state;
	const totalModalPages = Math.ceil(images.length / MODAL_PER_PAGE);

	const modal = document.getElementById("viewAllModal");
	const grid = document.getElementById("viewAllGrid");
	const title = document.getElementById("viewAllTitle");
	const pageLabel = document.getElementById("viewAllPageLabel");
	if (!modal || !grid) return;

	title.textContent = window.getCategoryName(images[0]?.category || "");

	function renderModal() {
		const slice = images.slice(
			modalPage * MODAL_PER_PAGE,
			(modalPage + 1) * MODAL_PER_PAGE,
		);
		grid.innerHTML = "";
		slice.forEach((img, i) => {
			const globalIdx = startIdx + modalPage * MODAL_PER_PAGE + i;
			const imagePath = img.image_path ? `/panel/admin/${img.image_path}` : "";
			const item = document.createElement("div");
			item.className = "va-item";
			item.innerHTML = `<img src="${window.escapeHtml(imagePath)}" alt="" loading="lazy">`;
			item.addEventListener("click", () => {
				window.currentImageIndex = globalIdx;
				window.showGalleryDetail(img, imagePath);
				closeViewAll();
			});
			grid.appendChild(item);
		});
		pageLabel.textContent =
			totalModalPages > 1 ? `${modalPage + 1} / ${totalModalPages}` : "";
		document.getElementById("viewAllPrev").style.opacity =
			modalPage === 0 ? "0.3" : "1";
		document.getElementById("viewAllNext").style.opacity =
			modalPage >= totalModalPages - 1 ? "0.3" : "1";
		document.getElementById("viewAllNav").style.display =
			totalModalPages > 1 ? "flex" : "none";
	}

	document.getElementById("viewAllPrev").onclick = () => {
		if (modalPage > 0) {
			modalPage--;
			renderModal();
		}
	};
	document.getElementById("viewAllNext").onclick = () => {
		if (modalPage < totalModalPages - 1) {
			modalPage++;
			renderModal();
		}
	};

	renderModal();
	modal.classList.add("open");
};

function closeViewAll() {
	document.getElementById("viewAllModal")?.classList.remove("open");
}
window.closeViewAll = closeViewAll;

window.renderGalleryError = (gridId) => {
	const grid = document.getElementById(gridId);
	if (!grid) return;
	const t = window.getTranslations?.();
	grid.innerHTML = `<div class="gallery-item placeholder"><div class="placeholder-content"><i class="fas fa-exclamation-triangle"></i><p>${t?.errorLoadingImages || "Error loading images"}</p></div></div>`;
};
