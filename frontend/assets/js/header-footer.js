window.API = {};
window.apiReady = new Promise((resolve) => {
	window._resolveApiReady = resolve;
});

const GLOBAL_SCRIPTS = [
	"/frontend/routes.js",
	"/frontend/constants/teams.js",
	"/frontend/constants/positions.js",
	"/frontend/constants/sponsors.js",
	"/frontend/constants/projects.js",
	"/frontend/api/router.js",
];

const HEADER_HELPERS = [
	"/frontend/components/header/helpers/mobile-menu.js",
	"/frontend/components/header/helpers/scroll.js",
	"/frontend/components/header/helpers/navbar.js",
];

const FOOTER_HELPERS = ["/frontend/components/footer/helpers/render.js"];

const TRANSLATION_HELPERS = [
	"/frontend/assets/translation/translations.js",
	"/frontend/assets/translation/language-update.js",
];

const loadScripts = (srcs) =>
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

const loadModuleScripts = (srcs) =>
	Promise.all(
		srcs.map(
			(src) =>
				new Promise((resolve) => {
					if (document.querySelector(`script[src="${src}"]`)) return resolve();
					const s = document.createElement("script");
					s.type = "module";
					s.src = src;
					s.onload = resolve;
					s.onerror = resolve;
					document.head.appendChild(s);
				}),
		),
	);

const CONFIG = {
	selectors: {
		header: "header",
		footer: "footer",
		mobileToggle: "#mobile-toggle",
		navLinks: "#nav-links",
		navLink: ".nav-link",
		applyBtn: ".apply-btn",
	},
	classes: {
		scrolled: "scrolled",
		active: "active",
	},
};

window.getImagePath = () => "/frontend/assets/images/";

window.getPagePath = (isPhpFile = false) => {
	const currentPath = window.location.pathname;
	const isInPagesDirectory = currentPath.includes("/pages/");
	const isInPhpDirectory = currentPath.endsWith(".php");
	const basePath = "/frontend/";
	if (isPhpFile) {
		return isInPhpDirectory
			? basePath
			: isInPagesDirectory
				? basePath
				: basePath;
	}
	return isInPagesDirectory ? basePath : basePath;
};

const loadHeader = () => {
	const header = document.querySelector(CONFIG.selectors.header);
	if (!header) return;

	const imagePath = window.getImagePath();
	const lang = window.getCurrentLanguage?.() || "en";
	const t = window.getTranslations?.() || {};

	const headerContent = `
        <div class="main-header">
            <nav class="navbar">
                <div class="nav-brand">
                    <a href="${window.ROUTES.home}">
                        <img src="${imagePath}W logo.png" alt="Black Hornets Logo" class="nav-logo">
                    </a>
                </div>

                <div class="nav-links" id="nav-links">
                    <div class="language-switcher mobile-only">
                        <button class="lang-btn ${lang === "en" ? "active" : ""}"
                                data-lang="en"
                                onclick="changeLanguage('en')">
                            <span>EN</span>
                        </button>
                        <button class="lang-btn ${lang === "sr" ? "active" : ""}"
                                data-lang="sr"
                                onclick="changeLanguage('sr')">
                            <span>SR</span>
                        </button>
                    </div>

                    <a href="${window.ROUTES.team}" class="nav-link">
                        <i class="fas fa-users"></i>
                        <span>${t.team}</span>
                    </a>
                    <a href="${window.ROUTES.about}" class="nav-link">
                        <i class="fas fa-info-circle"></i>
                        <span>${t.about}</span>
                    </a>
                    <a href="${window.ROUTES.projects}" class="nav-link">
                        <i class="fas fa-project-diagram"></i>
                        <span>${t.projects}</span>
                    </a>
                    <a href="${window.ROUTES.blog}" class="nav-link">
                        <i class="fas fa-newspaper"></i>
                        <span>${t.blog || "Blog"}</span>
                    </a>
                    <a href="${window.ROUTES.gallery}" class="nav-link">
                        <i class="fas fa-images"></i>
                        <span>${t.gallery}</span>
                    </a>
                    <a href="${window.ROUTES.sponsors}" class="nav-link">
                        <i class="fas fa-handshake"></i>
                        <span>${t.sponsors}</span>
                    </a>
                    <a href="${window.ROUTES.contact}" class="nav-link">
                        <i class="fas fa-envelope"></i>
                        <span>${t.contact}</span>
                    </a>
                </div>

                <div class="nav-actions">
                    <a href="${window.ROUTES.apply}" class="apply-btn">
                        <i class="fas fa-user-plus"></i>
                        <span>${t.applyNow}</span>
                    </a>
                    <div class="language-switcher">
                        <button type="button" class="lang-btn ${lang === "en" ? "active" : ""}"
                                data-lang="en"
                                onclick="changeLanguage('en')">
                            <span>EN</span>
                        </button>
                        <button type="button" class="lang-btn ${lang === "sr" ? "active" : ""}"
                                data-lang="sr"
                                onclick="changeLanguage('sr')">
                            <span>SR</span>
                        </button>
                    </div>
                </div>

                <button type="button" class="mobile-toggle" id="mobile-toggle">
                    <span></span>
                    <span></span>
                    <span></span>
                </button>
            </nav>
        </div>
    `;

	header.innerHTML = headerContent;
	window.setupMobileMenu?.();
	window.setupHeaderScroll?.();
	window.setActiveNavLink?.();
};

window.loadHeader = loadHeader;

document.addEventListener("DOMContentLoaded", () => {
	loadModuleScripts(GLOBAL_SCRIPTS)
		.then(() =>
			Promise.all([
				loadScripts(HEADER_HELPERS),
				loadScripts(FOOTER_HELPERS),
				loadScripts(TRANSLATION_HELPERS),
			]),
		)
		.then(() => {
			// Reading Progress Bar (global)
			if (!document.querySelector(".reading-progress")) {
				const progressBar = document.createElement("div");
				progressBar.className = "reading-progress";
				document.body.appendChild(progressBar);
				window.addEventListener("scroll", function () {
					const fullHeight =
						document.documentElement.scrollHeight -
						document.documentElement.clientHeight;
					if (fullHeight > 0) {
						progressBar.style.width = (window.scrollY / fullHeight) * 100 + "%";
					}
				});
			}

			// Global Animated Background (racing lines + grid + particles)
			if (!document.querySelector(".global-racing-lines")) {
				const racingLines = document.createElement("div");
				racingLines.className = "global-racing-lines";
				document.body.prepend(racingLines);
			}
			if (!document.querySelector(".global-grid")) {
				const grid = document.createElement("div");
				grid.className = "global-grid";
				document.body.prepend(grid);
			}
			if (!document.getElementById("global-particles-js")) {
				const particlesDiv = document.createElement("div");
				particlesDiv.id = "global-particles-js";
				document.body.prepend(particlesDiv);

				if (typeof particlesJS === "undefined") {
					const script = document.createElement("script");
					script.src =
						"https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js";
					script.onload = function () {
						initGlobalParticles();
					};
					document.head.appendChild(script);
				} else {
					initGlobalParticles();
				}
			}

			function initGlobalParticles() {
				const isMobile = window.innerWidth <= 768;
				particlesJS("global-particles-js", {
					particles: {
						number: {
							value: isMobile ? 30 : 60,
							density: { enable: true, value_area: 1200 },
						},
						color: { value: "#FFD700" },
						shape: { type: "circle" },
						opacity: {
							value: 0.25,
							random: true,
							anim: {
								enable: true,
								speed: 0.8,
								opacity_min: 0.05,
								sync: false,
							},
						},
						size: {
							value: 2.5,
							random: true,
							anim: { enable: true, speed: 1.5, size_min: 0.1, sync: false },
						},
						line_linked: {
							enable: true,
							distance: 150,
							color: "#FFD700",
							opacity: 0.12,
							width: 1,
						},
						move: {
							enable: true,
							speed: isMobile ? 0.8 : 1.2,
							direction: "none",
							random: true,
							straight: false,
							out_mode: "out",
							bounce: false,
						},
					},
					interactivity: {
						detect_on: "canvas",
						events: {
							onhover: { enable: !isMobile },
							onclick: { enable: false },
							resize: true,
						},
					},
					retina_detect: true,
				});
			}

			const initComponents = () => {
				const savedLanguage = localStorage.getItem("language");
				if (savedLanguage && savedLanguage !== window.getCurrentLanguage?.()) {
					window.changeLanguage?.(savedLanguage);
					return;
				}

				loadHeader();
				window.loadFooter?.();

				setTimeout(() => {
					document.querySelectorAll(".lang-btn").forEach((btn) => {
						btn.classList.toggle(
							"active",
							btn.getAttribute("data-lang") === window.getCurrentLanguage?.(),
						);
					});
				}, 50);

				window.updateHomepageContent?.();

				setTimeout(() => {
					window.updateTeamPageContent?.();
				}, 100);

				window.updateAboutPageContent?.();
				window.updateProjectsPageContent?.();
				window.updateGalleryPageContent?.();
				window.updateSponsorsPageContent?.();
				window.updateContactPageContent?.();
				window.updateApplyPageContent?.();
			};

			initComponents();

			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					document.body.classList.add("page-ready");
				});
			});

			setTimeout(() => {
				if (document.querySelector(".department-box")) {
					window.updateTeamPageContent?.();
				}
			}, 10);

			window.addEventListener("load", () => {
				if (document.querySelector(".department-box")) {
					window.updateTeamPageContent?.();
				}
			});
		});
});
