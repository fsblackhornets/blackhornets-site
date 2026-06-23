// HTML escape helper to prevent XSS
function escapeHtml(str) {
	if (!str) return "";
	const div = document.createElement("div");
	div.textContent = str;
	return div.innerHTML;
}

// Main Initialization
document.addEventListener("DOMContentLoaded", function () {
	fetchAndRenderPost();
	setupImageZoom();

	// Reload post when language changes
	window.addEventListener("languageChanged", function () {
		fetchAndRenderPost();
	});
});

// Image Zoom Effect
function setupImageZoom() {
	const featuredImage = document.querySelector(".post-featured-image img");
	if (!featuredImage) return;

	featuredImage.addEventListener("click", function () {
		const overlay = document.createElement("div");
		overlay.className = "image-overlay";

		const img = document.createElement("img");
		img.src = this.src;

		overlay.appendChild(img);
		document.body.appendChild(overlay);

		setTimeout(() => overlay.classList.add("active"), 10);

		overlay.addEventListener("click", function () {
			this.classList.remove("active");
			setTimeout(() => this.remove(), 300);
		});
	});
}


function fetchAndRenderPost() {
	const urlParams = new URLSearchParams(window.location.search);
	const postId = urlParams.get("id");
	if (!postId) return;
	window.apiReady
		.then(() => window.API.posts.getById(postId))
		.then((res) => {
			const data = res?.data || res;
			if (!data) {
				document.querySelector(".single-post .post-wrapper").innerHTML =
					'<p style="color:red;text-align:center;">Post not found.</p>';
				return;
			}
			renderPost(data);
		})
		.catch(() => {
			document.querySelector(".single-post .post-wrapper").innerHTML =
				'<p style="color:red;text-align:center;">Error loading post.</p>';
		});
}

function renderPost(post) {
	// Get current language
	const currentLang = window.getCurrentLanguage
		? window.getCurrentLanguage()
		: "sr";
	const featuredText = currentLang === "en" ? "Featured" : "Istaknuto";

	// Get bilingual content with fallback chain
	const title =
		(currentLang === "en"
			? post.title_en || post.title_sr || post.title
			: post.title_sr || post.title || post.title_en) || "Untitled";
	const content =
		(currentLang === "en"
			? post.content_en || post.content_sr || post.content
			: post.content_sr || post.content || post.content_en) || "";

	// Render categories
	let categories = "";
	if (post.featured == 1)
		categories += `<span class="category-tag">${escapeHtml(featuredText)}</span>`;
	if (post.category)
		categories += `<span class="category-tag">${escapeHtml(post.category)}</span>`;

	// Format date
	let formattedDate = "";
	if (post.created_at) {
		const dateObj = new Date(post.created_at.replace(" ", "T"));
		const options = { year: "numeric", month: "long", day: "numeric" };
		formattedDate = dateObj.toLocaleDateString(
			currentLang === "en" ? "en-US" : "sr-RS",
			options,
		);
	}
	// Image
	let imagePath = "";
	if (post.image) {
		imagePath =
			post.image.startsWith("http") || post.image.startsWith("/")
				? post.image
				: "/frontend/" + post.image.replace(/^\.\.\//, "");
	}
	// Author
	let author = post.author || "Team Black Hornets";
	// Render
	document.querySelector(".single-post .post-header").innerHTML = `
        <div class="post-categories">${categories}</div>
        <h1>${escapeHtml(title)}</h1>
        <div class="post-meta">
            <span><i class="far fa-calendar"></i> ${escapeHtml(formattedDate)}</span>
            <span><i class="far fa-user"></i> ${escapeHtml(author)}</span>
        </div>
    `;
	document.querySelector(".single-post .post-featured-image img").src =
		imagePath || "https://picsum.photos/1200/600?random=20";
	document.querySelector(".single-post .post-featured-image img").alt = title;
	document.querySelector(".single-post .post-content").innerHTML = content;

	// Update page title
	document.title = title + " - Black Hornets Racing";

	// Fetch and render related/other posts
	renderRelatedPosts(post.id);
}

function renderRelatedPosts(currentId) {
	window.apiReady
		.then(() => window.API.posts.getAll())
		.then((data) => {
			if (data.status !== "success" || !Array.isArray(data.data)) return;
			const posts = data.data.filter((p) => String(p.id) !== String(currentId));
			const container = document.querySelector(".related-posts-grid");
			const wrapper = document.querySelector(".related-carousel-wrapper");
			if (!container) return;
			container.innerHTML = "";

			const currentLang = window.getCurrentLanguage
				? window.getCurrentLanguage()
				: "sr";
			const relatedTitle = document.querySelector(".related-posts h2");
			if (relatedTitle) {
				relatedTitle.textContent =
					currentLang === "en" ? "Related Posts" : "Povezane objave";
			}

			if (posts.length === 0) {
				container.style.animation = "none";
				container.innerHTML =
					'<p class="related-no-posts">' +
					(currentLang === "en"
						? "No other posts found."
						: "Nema drugih objava.") +
					"</p>";
				return;
			}

			function buildCard(post) {
				const title =
					(currentLang === "en"
						? post.title_en || post.title_sr || post.title
						: post.title_sr || post.title || post.title_en) || "Untitled";
				const content =
					(currentLang === "en"
						? post.content_en || post.content_sr || post.content
						: post.content_sr || post.content || post.content_en) || "";
				let imagePath = "";
				if (post.image) {
					imagePath =
						post.image.startsWith("http") || post.image.startsWith("/")
							? post.image
							: "/frontend/" + post.image.replace(/^\.\.\//, "");
				}
				const plainContent = content.replace(/<[^>]*>/g, "");
				const shortContent =
					plainContent.length > 120
						? plainContent.substring(0, 117) + "..."
						: plainContent;
				let formattedDate = "";
				if (post.created_at) {
					const dateObj = new Date(post.created_at.replace(" ", "T"));
					formattedDate = dateObj.toLocaleDateString(
						currentLang === "en" ? "en-US" : "sr-RS",
						{ year: "numeric", month: "short", day: "numeric" },
					);
				}
				const author = post.author || "Team Black Hornets";

				return `
                    <a href="blog-post.html?id=${parseInt(post.id)}" class="related-card">
                        <div class="related-card-image">
                            ${
															imagePath
																? '<img src="' +
																	escapeHtml(imagePath) +
																	'" alt="' +
																	escapeHtml(title) +
																	"\" onerror=\"this.parentElement.innerHTML='<div class=\\'related-no-image\\'><i class=\\'fas fa-image\\'></i></div>'\">"
																: '<div class="related-no-image"><i class="fas fa-image"></i></div>'
														}
                            ${post.category ? '<span class="related-category">' + escapeHtml(post.category) + "</span>" : ""}
                        </div>
                        <div class="related-card-body">
                            <div class="related-card-meta">
                                <span><i class="far fa-calendar"></i> ${escapeHtml(formattedDate)}</span>
                                <span><i class="far fa-user"></i> ${escapeHtml(author)}</span>
                            </div>
                            <h3>${escapeHtml(title)}</h3>
                            <p>${escapeHtml(shortContent)}</p>
                            <div class="related-card-footer">
                                <span class="related-readmore">${readMoreText} <i class="fas fa-arrow-right"></i></span>
                            </div>
                        </div>
                    </a>`;
			}

			// Build cards from available posts (up to 6)
			const displayPosts = posts.slice(0, 6);
			let cardsHtml = "";
			displayPosts.forEach((post) => {
				cardsHtml += buildCard(post);
			});

			// Duplicate the set so the scroll loops seamlessly
			container.innerHTML = cardsHtml + cardsHtml;

			// Adjust animation speed based on number of cards
			const totalCards = displayPosts.length;
			const speed = totalCards * 5; // ~5s per card
			container.style.animationDuration = speed + "s";
		});
}
