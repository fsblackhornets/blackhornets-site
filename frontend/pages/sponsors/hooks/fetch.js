window.loadSponsors = async () => {
	const t = window.getTranslations?.() || {};
	const container = document.getElementById("sponsors-container");
	if (!container) return;

	try {
		await window.apiReady;
		const data = await window.API.sponsors.getAll();

		if (data.success && data.data.length > 0) {
			window.displaySponsors(window.groupSponsorsByTier(data.data), container);
		} else {
			container.innerHTML = `
                <div class="sponsor-category" data-aos="fade-up">
                    <div class="coming-soon-container">
                        <div class="coming-soon-text">
                            <i class="fas fa-clock"></i>
                            <h3>${t.comingSoon || "Coming Soon"}</h3>
                            <p>${t.sponsorsComingSoon || "Partnerships being confirmed. Stay tuned!"}</p>
                        </div>
                    </div>
                </div>`;
		}
	} catch (err) {
		console.error("Error loading sponsors:", err);
		container.innerHTML = `
            <div class="sponsor-category" data-aos="fade-up">
                <div class="error-container">
                    <div class="error-text">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>${t.errorLoadingSponsors || "Error Loading Sponsors"}</h3>
                        <p>${t.unableToLoadSponsors || "Please try again later."}</p>
                    </div>
                </div>
            </div>`;
	}
};

window.loadBrochure = async () => {
	const loadingEl = document.getElementById("brochure-loading");
	const flipbookWrapper = document.getElementById("flipbook-wrapper");
	const flipbookControls = document.getElementById("flipbook-controls");
	const downloadSection = document.getElementById("brochure-download");
	const downloadLink = document.getElementById("brochure-download-link");

	if (!flipbookWrapper) return;

	const lang = window.getBrochureLang?.() || "sr";

	try {
		await window.apiReady;
		const data = await window.API.brochure.get(lang);

		if (!data.success || !data.data?.pdf_url) {
			if (loadingEl)
				loadingEl.innerHTML =
					'<p style="color:#888;">Brochure coming soon.</p>';
			return;
		}

		const pdfUrl = "/frontend/" + data.data.pdf_url;

		if (downloadSection && downloadLink) {
			if (window.brochureDownloadHandler) {
				downloadLink.removeEventListener(
					"click",
					window.brochureDownloadHandler,
				);
			}
			window.brochureDownloadHandler = (e) => {
				e.preventDefault();
				e.stopPropagation();
				const a = document.createElement("a");
				a.href = pdfUrl;
				a.download = `brochure_${lang}.pdf`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			};
			downloadLink.href = pdfUrl;
			downloadLink.setAttribute("download", `brochure_${lang}.pdf`);
			downloadLink.addEventListener("click", window.brochureDownloadHandler);
			downloadSection.style.display = "block";
		}

		if (typeof pdfjsLib === "undefined") {
			if (loadingEl)
				loadingEl.innerHTML =
					'<p style="color:#e53935;">Error loading PDF viewer.</p>';
			return;
		}

		const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
		const numPages = pdf.numPages;
		const flipbookEl = document.getElementById("flipbook");

		for (let i = 1; i <= numPages; i++) {
			const page = await pdf.getPage(i);
			const viewport = page.getViewport({ scale: 1.5 });
			const canvas = document.createElement("canvas");
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			await page.render({ canvasContext: canvas.getContext("2d"), viewport })
				.promise;

			const pageDiv = document.createElement("div");
			pageDiv.className = "page";
			const img = document.createElement("img");
			img.src = canvas.toDataURL("image/jpeg", 0.85);
			img.alt = `Page ${i}`;
			pageDiv.appendChild(img);
			flipbookEl.appendChild(pageDiv);
		}

		if (loadingEl) loadingEl.style.display = "none";
		if (flipbookWrapper) flipbookWrapper.style.display = "";
		if (flipbookControls) flipbookControls.style.display = "";

		window.initFlipbook?.(numPages);
	} catch (err) {
		console.error("Brochure error:", err);
		if (loadingEl)
			loadingEl.innerHTML =
				'<p style="color:#e53935;">Unable to load brochure.</p>';
	}
};
