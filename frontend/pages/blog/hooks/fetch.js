let _blogCurrentPage = 1;
let _blogCurrentSearch = "";

window.loadBlogPosts = async (page = 1, search = "") => {
	_blogCurrentPage = page;
	_blogCurrentSearch = search;

	try {
		await window.apiReady;
		const data = await window.API.posts.getAll();

		if (data.status !== "success") return;

		let posts = data.data || [];

		// Client-side filter by search
		if (search) {
			const q = search.toLowerCase();
			const lang = window.getCurrentLanguage?.() || "sr";
			posts = posts.filter((p) => {
				const title =
					(lang === "en" ? p.title_en : p.title_sr) || p.title || "";
				const body =
					(lang === "en" ? p.content_en : p.content_sr) || p.content || "";
				return (
					title.toLowerCase().includes(q) || body.toLowerCase().includes(q)
				);
			});
		}

		// Client-side pagination
		const perPage = 9;
		const totalPages = Math.max(1, Math.ceil(posts.length / perPage));
		const pagePosts = posts.slice((page - 1) * perPage, page * perPage);

		window.displayPosts(pagePosts);
		window.setupBlogPagination(
			{ total_pages: totalPages, current_page: page },
			(p) => window.loadBlogPosts(p, _blogCurrentSearch),
		);
	} catch (err) {
		console.error("Blog fetch error:", err);
	}
};

window.setupBlogNewsletter = () => {
	const form = document.getElementById("newsletterForm");
	if (!form) return;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();
		const email = form.querySelector("input")?.value.trim();
		if (!email) return;

		try {
			await window.apiReady;
			const data = await window.API.newsletter.subscribe({ email });
			alert(data.message);
			if (data.status === "success") form.reset();
		} catch (err) {
			console.error("Newsletter error:", err);
		}
	});
};
