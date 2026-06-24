window.buildImagePath = (image) => {
	if (!image) return "";
	let cleanPath = image.replace(/^\.\.\//, "").replace(/^\//, "");
	if (!cleanPath.startsWith("uploads/")) cleanPath = `uploads/${cleanPath}`;
	return `/frontend/${cleanPath}`;
};

window.renderNewsCard = (post, lang) => {
	const featuredText = lang === "en" ? "Featured" : "Istaknuto";
	const readMoreText = lang === "en" ? "Read More" : "Pročitaj više";

	const title =
		(lang === "en"
			? post.title_en || post.title_sr || post.title
			: post.title_sr || post.title || post.title_en) || "Untitled";

	const content =
		(lang === "en"
			? post.content_en || post.content_sr || post.content
			: post.content_sr || post.content || post.content_en) || "";

	const imagePath = window.buildImagePath(post.image);
	const dateObj = new Date(post.created_at.replace(" ", "T"));
	const formattedDate = dateObj.toLocaleDateString(
		lang === "en" ? "en-US" : "sr-RS",
		{
			year: "numeric",
			month: "long",
			day: "numeric",
		},
	);
	const plainContent = content
		.replace(/<[^>]*>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	const shortContent =
		plainContent.length > 150
			? `${plainContent.substring(0, 147)}...`
			: plainContent;

	return `
        <div class="news-card-featured">
            ${post.featured === 1 ? `<span class="news-badge">${featuredText}</span>` : ""}
            ${post.category ? `<span class="news-category-badge">${post.category}</span>` : ""}
            ${
							imagePath
								? `<div class="news-image" style="width:100%;height:220px;overflow:hidden;border-radius:8px;margin-bottom:15px;">
                <img src="${imagePath}" alt="${title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.display='none'">
            </div>`
								: ""
						}
            <div class="news-meta-row">
                <span class="news-meta-item"><i class="fa-regular fa-calendar"></i> ${formattedDate}</span>
                <span class="news-meta-item"><i class="fa-regular fa-user"></i> ${post.author || "Team Black Hornets"}</span>
            </div>
            <h3 class="news-title-featured">${title}</h3>
            <p class="news-text-featured">${shortContent}</p>
            <a href="/frontend/pages/blog-post/blog-post.html?id=${post.id}" class="news-readmore">${readMoreText}</a>
        </div>
    `;
};
