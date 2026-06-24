document.addEventListener("DOMContentLoaded", async function () {
	const params = new URLSearchParams(window.location.search);
	const id = params.get("id");

	if (!id) {
		showError("No project ID specified.");
		return;
	}

	try {
		await window.apiReady;
		const data =
			(await window.API.projects?.getById?.(id)) ||
			(await fetch(`/backend/api/projects/${id}`).then((r) => r.json()));

		const project = data?.data || data;
		if (!project || !project.name) {
			showError("Project not found.");
			return;
		}

		render(project);
	} catch (e) {
		console.error(e);
		showError("Failed to load project.");
	}
});

function render(p) {
	document.title = `${p.name} - Black Hornets Racing`;

	const imgUrl = p.image_url
		? `/frontend/${p.image_url}`
		: p.image
			? p.image.startsWith("uploads/")
				? `/frontend/${p.image}`
				: p.image
			: null;

	// Status colour
	const statusColors = {
		active: "#4CAF50",
		completed: "#2196f3",
		pending: "#ff9800",
	};
	const statusColor = statusColors[p.status?.toLowerCase()] || "#888";

	// Progress colour
	const prog = parseInt(p.progress) || 0;
	const progColor =
		prog >= 80
			? "#4CAF50"
			: prog >= 50
				? "#FFD700"
				: prog >= 25
					? "#FF9800"
					: "#F44336";

	// Due date
	let dueStr = "—",
		daysStr = "—";
	if (p.due_date) {
		const due = new Date(p.due_date);
		const today = new Date();
		dueStr = due.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
		const diff = Math.round((due - today) / 86400000);
		daysStr =
			diff < 0 ? `${Math.abs(diff)} days overdue` : `${diff} days remaining`;
	}

	document.querySelector(".project-details-container").innerHTML = `
		<a href="/frontend/pages/projects/projects.html" class="back-btn">
			<i class="fas fa-arrow-left"></i> Back to Projects
		</a>

		<div class="project-header">
			<h1>${e(p.name)}</h1>
			<div class="project-meta">
				<span><i class="fas fa-circle" style="color:${statusColor};font-size:0.6rem;"></i> ${cap(p.status || "Unknown")}</span>
				${p.due_date ? `<span><i class="fas fa-calendar"></i> Due: ${dueStr}</span>` : ""}
				${p.duration ? `<span><i class="fas fa-clock"></i> ${e(p.duration)}</span>` : ""}
			</div>
		</div>

		${
			imgUrl
				? `
		<div class="project-hero-image">
			<img src="${e(imgUrl)}" alt="${e(p.name)}" style="width:100%;border-radius:14px;max-height:480px;object-fit:cover;margin-bottom:2rem;">
		</div>`
				: ""
		}

		<div class="project-content">
			<div class="project-description">
				<h2>Project Overview</h2>
				<p>${e(p.description || "No description available.")}</p>

				<h2>Progress</h2>
				<div style="background:#222;border-radius:6px;overflow:hidden;height:14px;margin-bottom:8px;">
					<div style="width:${prog}%;height:100%;background:${progColor};border-radius:6px;transition:width 1s ease;"></div>
				</div>
				<p style="color:${progColor};font-weight:600;font-family:'Michroma',sans-serif;font-size:0.9rem;">${prog}% Complete</p>

				${
					daysStr !== "—"
						? `
				<div style="margin-top:1rem;padding:12px 16px;background:rgba(255,255,255,0.04);border-radius:10px;border-left:3px solid ${progColor};">
					<i class="fas fa-hourglass-half" style="color:${progColor};margin-right:8px;"></i>
					<span style="color:#e0e0e0;">${daysStr}</span>
				</div>`
						: ""
				}
			</div>

			<div class="project-sidebar">
				<div class="info-box">
					<h3>Details</h3>
					<ul>
						<li><strong>Status:</strong> <span style="color:${statusColor}">${cap(p.status || "—")}</span></li>
						<li><strong>Progress:</strong> ${prog}%</li>
						${p.due_date ? `<li><strong>Due Date:</strong> ${dueStr}</li>` : ""}
						${p.duration ? `<li><strong>Duration:</strong> ${e(p.duration)}</li>` : ""}
					</ul>
				</div>
			</div>
		</div>
	`;

	// Animate progress bar
	setTimeout(() => {
		const bar = document.querySelector(
			'.project-details-container [style*="width:' + prog + '%"]',
		);
		if (bar) {
			bar.style.width = "0%";
			setTimeout(() => {
				bar.style.width = prog + "%";
			}, 50);
		}
	}, 300);
}

function showError(msg) {
	document.querySelector(".project-details-container").innerHTML = `
		<a href="/frontend/pages/projects/projects.html" class="back-btn"><i class="fas fa-arrow-left"></i> Back to Projects</a>
		<p style="color:#e74c3c;text-align:center;padding:3rem;font-family:'Rajdhani',sans-serif;">${msg}</p>`;
}

function e(str) {
	if (!str) return "";
	const d = document.createElement("div");
	d.textContent = str;
	return d.innerHTML;
}
function cap(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
