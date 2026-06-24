const CONTACT_HELPERS = [
	"/frontend/pages/contact/helpers/map.js",
	"/frontend/pages/contact/helpers/faq.js",
	"/frontend/pages/contact/helpers/form-ui.js",
];

const CONTACT_HOOKS = ["/frontend/pages/contact/hooks/submit.js"];

const loadContactScripts = (srcs) =>
	Promise.all(
		srcs.map(
			(src) =>
				new Promise((resolve) => {
					if (document.querySelector(`script[src="${src}"]`)) return resolve();
					const s = document.createElement("script");
					s.src = src;
					s.onload = resolve;
					s.onerror = resolve;
					document.head.appendChild(s);
				}),
		),
	);

document.addEventListener("DOMContentLoaded", () => {
	Promise.all([
		loadContactScripts(CONTACT_HELPERS),
		loadContactScripts(CONTACT_HOOKS),
	]).then(() => {
		window.setupContactMap?.();
		window.setupFAQ?.();
		window.setupFormInputAnimations?.();
		window.setupContactForm?.();
	});
});
