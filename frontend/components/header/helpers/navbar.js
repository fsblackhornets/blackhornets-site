window.setActiveNavLink = () => {
	const currentPath = window.location.pathname;

	document.querySelectorAll(".nav-link").forEach((link) => {
		const href = link.getAttribute("href");
		if (currentPath.includes(href) && href !== "home.html") {
			link.classList.add("active");
		} else if (currentPath.endsWith("/") && href === "home.html") {
			link.classList.add("active");
		}
	});

	const applyBtn = document.querySelector(".apply-btn");
	if (applyBtn && currentPath.includes("apply")) {
		applyBtn.classList.add("active");
	}
};
