// PROJECT_STATUS_CLASSES and PROJECT_PROGRESS_COLORS from frontend/constants/projects.js

window.getStatusClass = (status) => {
	const classes = window.PROJECT_STATUS_CLASSES || {};
	return classes[status?.toLowerCase()] || "pending";
};

window.getProgressColor = (progress) => {
	const colors = window.PROJECT_PROGRESS_COLORS || [
		{ min: 0, color: "#F44336" },
	];
	return (colors.find((c) => progress >= c.min) || colors[colors.length - 1])
		.color;
};

window.formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

window.displayProjects = (projects, container) => {
	const t = window.getTranslations?.() || {};

	let html = "";

	projects.forEach((project) => {
		const imgPos = project.image_position || "50% 50%";
		const imageHtml = project.image_url
			? `<img src="/frontend/${project.image_url}" alt="${project.name}" class="project-image" style="object-position:${imgPos}">`
			: `<div class="project-placeholder">${project.name.charAt(0)}</div>`;

		const statusClass = window.getStatusClass(project.status);
		const progressColor = window.getProgressColor(project.progress);

		let translatedStatus = project.status;
		if (project.status.toLowerCase() === "active")
			translatedStatus = t.active || project.status;
		else if (project.status.toLowerCase() === "completed")
			translatedStatus = t.completed || project.status;
		else if (project.status.toLowerCase() === "pending")
			translatedStatus = t.pending || project.status;

		const daysText = project.is_overdue
			? `${Math.abs(project.days_remaining)} ${t.daysOverdue || "days overdue"}`
			: `${project.days_remaining} ${t.daysRemaining || "days remaining"}`;

		html += `
            <div class="project-card ${statusClass}" data-aos="fade-up">
                <div class="project-content">
                    ${imageHtml}
                    <div class="status-badge ${statusClass}">${translatedStatus}</div>
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${t.dueDate || "Due"}: ${window.formatDate(project.due_date)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${project.duration}</span>
                        </div>
                        <div class="meta-item ${project.is_overdue ? "overdue" : ""}">
                            <i class="fas fa-hourglass-half"></i>
                            <span>${daysText}</span>
                        </div>
                    </div>
                    <div class="development-progress">
                        <div class="progress-item">
                            <span class="label">${t.progress || "Progress"}</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${project.progress}%; background: ${progressColor}"></div>
                            </div>
                            <span class="percentage">${project.progress}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
	});

	container.innerHTML = html;
};
