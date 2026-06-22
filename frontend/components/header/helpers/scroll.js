window.setupHeaderScroll = () => {
	const header = document.querySelector(".main-header");
	if (!header) return;

	const update = () => header.classList.toggle("scrolled", window.scrollY > 50);
	update();
	window.addEventListener("scroll", update, { passive: true });
};
