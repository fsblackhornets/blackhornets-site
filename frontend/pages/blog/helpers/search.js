window.setupBlogSearch = (onSearch) => {
	const form = document.getElementById("blogSearchForm");
	const input = document.getElementById("searchInput");
	if (!form || !input) return;

	const trigger = () => onSearch(input.value.trim());

	form.addEventListener("submit", (e) => {
		e.preventDefault();
		trigger();
	});
	input.addEventListener("input", trigger);
};
