window.escapeHtmlBlog = (str) => {
	if (!str) return "";
	const div = document.createElement("div");
	div.textContent = str;
	return div.innerHTML;
};

window.displayPosts = (posts) => {
	const grid = document.getElementById("blogGrid");
	if (!grid) return;

	if (!posts?.length) {
		grid.innerHTML =
			'<p style="color:#FFD700;text-align:center;font-size:1.2rem;padding:3rem;">No news available.</p>';
		return;
	}

	const lang = window.getCurrentLanguage?.() || "sr";
	const readMore = lang === "en" ? "Read More" : "Pročitaj više";
	const featuredTxt = lang === "en" ? "Featured" : "Istaknuto";
	const e = window.escapeHtmlBlog;

	grid.innerHTML = posts
		.map((post) => {
			const title =
				(lang === "en"
					? post.title_en || post.title_sr || post.title
					: post.title_sr || post.title || post.title_en) || "Untitled";
			const content =
				(lang === "en"
					? post.content_en || post.content_sr || post.content
					: post.content_sr || post.content || post.content_en) || "";
			const short =
				content.length > 150 ? content.substring(0, 147) + "..." : content;

			let imagePath = "";
			if (post.image) {
				imagePath =
					post.image.startsWith("http") || post.image.startsWith("/")
						? post.image
						: "/" + post.image.replace(/^\.\.\//, "");
			}

			const date = new Date(
				post.created_at.replace(" ", "T"),
			).toLocaleDateString(lang === "en" ? "en-US" : "sr-RS", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
			const featured =
				post.featured == 1
					? `<span class="news-badge">${featuredTxt}</span>`
					: "";
			const imgHtml = imagePath
				? `<img src="${e(imagePath)}" alt="${e(title)}" onerror="this.parentElement.style.display='none'">`
				: `<div style="height:200px;background:#222;display:flex;align-items:center;justify-content:center;"><i class="fas fa-image" style="font-size:3rem;color:#333;"></i></div>`;

			return `<a href="/frontend/pages/blog-post/blog-post.html?id=${parseInt(post.id)}" class="blog-post-link">
            <article class="blog-post">
                <div class="post-image">
                    ${featured}${imgHtml}
                    <div class="post-category">${e(post.category || "")}</div>
                </div>
                <div class="post-content">
                    <div class="post-meta">
                        <span><i class="far fa-calendar"></i> ${e(date)}</span>
                        <span><i class="far fa-user"></i> ${e(post.author || "Team Black Hornets")}</span>
                    </div>
                    <h3>${e(title)}</h3>
                    <p>${e(short)}</p>
                    <span class="read-more-btn">${readMore} <i class="fas fa-arrow-right"></i></span>
                </div>
            </article>
        </a>`;
		})
		.join("");
};

window.setupBlogPagination = (pagination, onPageChange) => {
	const div = document.getElementById("blogPagination");
	if (!div || !pagination) return;

	let html = "";
	for (let i = 1; i <= pagination.total_pages; i++) {
		html += `<a href="#" class="page-link ${i === pagination.current_page ? "active" : ""}" data-page="${i}">${i}</a>`;
	}
	if (pagination.current_page < pagination.total_pages) {
		html += `<a href="#" class="page-link next" data-page="${pagination.current_page + 1}">Next <i class="fas fa-arrow-right"></i></a>`;
	}
	div.innerHTML = html;

	div.querySelectorAll(".page-link").forEach((link) => {
		link.addEventListener("click", (e) => {
			e.preventDefault();
			onPageChange(parseInt(link.dataset.page));
		});
	});
};
