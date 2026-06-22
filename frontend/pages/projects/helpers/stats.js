window.setupStatsAnimation = () => {
	let isAnimated = false;
	const stats = document.querySelectorAll(".stat-item h3");

	const animateStats = () => {
		if (isAnimated) return;

		stats.forEach((stat) => {
			const target = parseInt(stat.textContent);
			const hasPlus = stat.textContent.includes("+");
			let current = 0;
			const increment = target / 50;

			const updateCount = () => {
				if (current < target) {
					current += increment;
					stat.textContent = Math.ceil(current) + (hasPlus ? "+" : "");
					requestAnimationFrame(updateCount);
				} else {
					stat.textContent = target + (hasPlus ? "+" : "");
				}
			};

			updateCount();
		});

		isAnimated = true;
	};

	const statsObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					animateStats();
					statsObserver.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.5 },
	);

	const statsSection = document.querySelector(".project-stats");
	if (statsSection) statsObserver.observe(statsSection);
};
