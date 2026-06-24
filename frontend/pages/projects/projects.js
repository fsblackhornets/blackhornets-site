const PROJECT_HELPERS = [
	"/frontend/pages/projects/helpers/filter.js",
	"/frontend/pages/projects/helpers/stats.js",
	"/frontend/pages/projects/helpers/notification.js",
	"/frontend/pages/projects/helpers/video.js",
	"/frontend/pages/projects/helpers/render.js",
];

const PROJECT_HOOKS = ["/frontend/pages/projects/hooks/fetch.js"];

const loadProjectScripts = (srcs) =>
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
		loadProjectScripts(PROJECT_HELPERS),
		loadProjectScripts(PROJECT_HOOKS),
	]).then(() => {
		window.setupProjectFilters?.();
		window.setupStatsAnimation?.();
		window.setupProjectVideo?.();

		document.querySelectorAll(".coming-soon .view-project").forEach((link) => {
			link.addEventListener("click", (e) => {
				e.preventDefault();
				window.showNotification?.(
					"This project is currently under development. Stay tuned!",
				);
			});
		});

		window.loadProjects?.();
		window.addEventListener("languageChanged", () => window.loadProjects?.());
	});
});
