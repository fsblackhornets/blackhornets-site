// DEPARTMENT_MAPPING loaded from frontend/constants/teams.js
const DEPARTMENT_MAPPING = window.DEPARTMENT_MAPPING || {};

window.clearActiveStates = () => {
	document.querySelectorAll(".department-box").forEach((box) => {
		box.classList.remove("active");
	});
};

window.showError = (message) => {
	const membersGrid = document.querySelector(".members-grid");
	if (!membersGrid) return;
	const errorDiv = document.createElement("div");
	errorDiv.className = "error-message";
	errorDiv.textContent = message;
	membersGrid.innerHTML = "";
	membersGrid.appendChild(errorDiv);
};

window.showDepartmentMembers = (
	team,
	specificDepartment = null,
	skipScroll = false,
) => {
	const actualTeam = team === "bot" ? "operating_business" : team;
	const teamStructure = window.getTeamStructure();
	const teamData = teamStructure[actualTeam];
	const t = window.getTranslations?.() || {};
	const membersGrid = document.querySelector(".members-grid");
	const departmentView = document.querySelector(".department-members-view");

	if (!teamData) {
		window.showError(`Team not found: ${actualTeam}`);
		return;
	}

	window.currentViewTeam = actualTeam;
	window.currentViewDepartmentEnglish = specificDepartment
		? DEPARTMENT_MAPPING[specificDepartment] || specificDepartment
		: null;

	membersGrid.innerHTML = "";
	membersGrid.style.display = "block";
	departmentView.style.display = "block";

	if (!skipScroll) {
		setTimeout(
			() =>
				departmentView.scrollIntoView({ behavior: "smooth", block: "start" }),
			50,
		);
	}

	const allMembers = window.allTeamMembers || [];
	const teamMembers = allMembers.filter((m) => m.team === actualTeam);

	// Team name header
	const teamHeader = document.createElement("div");
	teamHeader.className = "team-header";
	teamHeader.innerHTML = `<h2 class="team-title">${teamData.name}</h2>`;
	membersGrid.appendChild(teamHeader);

	// Project Leader for this team (always show at top)
	const projectLeader = allMembers.find(
		(m) => m.role === "project_leader" && m.team === actualTeam,
	);
	if (projectLeader) {
		const plContainer = document.createElement("div");
		plContainer.className = "sub-leader-container";
		plContainer.appendChild(window.createMemberCard(projectLeader));
		membersGrid.appendChild(plContainer);
	}

	if (!specificDepartment) {
		// No dept selected — show all sub_leaders in a row (clickable)
		const subLeaders = teamMembers.filter((m) => m.role === "sub_leader");
		if (subLeaders.length > 0) {
			const subRow = document.createElement("div");
			subRow.className = "members-row";
			subRow.style.justifyContent = "center";
			subLeaders.forEach((sl) => {
				const card = window.createMemberCard(sl);
				card.style.cursor = "pointer";
				card.addEventListener("click", () =>
					window.showDepartmentMembers(
						actualTeam,
						sl.department_name || sl.department,
						true,
					),
				);
				subRow.appendChild(card);
			});
			membersGrid.appendChild(subRow);
		} else {
			// No sub leaders — show all regular members
			const regularMembers = teamMembers.filter(
				(m) =>
					!["sub_leader", "project_leader", "team_leader"].includes(m.role),
			);
			if (regularMembers.length > 0) {
				const membersContainer = document.createElement("div");
				membersContainer.className = "members-row";
				regularMembers.forEach((m) => {
					membersContainer.appendChild(window.createMemberCard(m));
				});
				membersGrid.appendChild(membersContainer);
			}
		}
		return;
	}

	// Specific department selected — show sub_leader + members
	const englishDept =
		DEPARTMENT_MAPPING[specificDepartment] || specificDepartment;
	const departmentMembers = teamMembers.filter((m) => {
		const dept = m.department_name || m.department;
		return dept && dept.toLowerCase() === englishDept.toLowerCase();
	});

	const deptSection = document.createElement("div");
	deptSection.className = "department-section";
	deptSection.innerHTML = `<h3 class="department-title">${specificDepartment}</h3>`;

	const subLeaders = departmentMembers.filter((m) => m.role === "sub_leader");
	const regularMembers = departmentMembers.filter(
		(m) => !["sub_leader", "project_leader", "team_leader"].includes(m.role),
	);

	if (subLeaders.length > 0) {
		const slRow = document.createElement("div");
		slRow.className =
			subLeaders.length > 1 ? "members-row" : "sub-leader-container";
		subLeaders.forEach((sl) => {
			slRow.appendChild(window.createMemberCard(sl));
		});
		deptSection.appendChild(slRow);
	}

	if (regularMembers.length > 0) {
		const membersContainer = document.createElement("div");
		membersContainer.className = "members-row";
		regularMembers.forEach((m) => {
			membersContainer.appendChild(window.createMemberCard(m));
		});
		deptSection.appendChild(membersContainer);
	}

	if (subLeaders.length === 0 && regularMembers.length === 0) {
		deptSection.innerHTML += `<p style="color:#888;text-align:center;padding:2rem;">${t.noMembersFound || "No members found"}</p>`;
	}

	membersGrid.appendChild(deptSection);
};

window.showMemberDetails = (member) => {
	const modal = document.getElementById("memberModal");
	if (!modal) return;

	const t = window.getTranslations?.() || {};
	const defaultImage = "/frontend/assets/images/W logo.png";

	const modalImage = document.getElementById("modalMemberImage");
	const modalName = document.getElementById("modalMemberName");
	const modalPosition = document.getElementById("modalMemberPosition");
	const modalDepartment = document.getElementById("modalMemberDepartment");
	const modalFaculty = document.getElementById("modalMemberFaculty");
	const modalStudy = document.getElementById("modalMemberStudy");
	const modalYear = document.getElementById("modalMemberYear");
	const modalEmail = document.getElementById("modalMemberEmail");
	const modalMotivation = document.getElementById("modalMemberMotivation");

	if (modalImage) {
		modalImage.src =
			member.profile_picture && member.profile_picture !== "default.jpg"
				? `/uploads/profiles/${member.profile_picture}`
				: defaultImage;
		modalImage.onerror = () => {
			modalImage.src = defaultImage;
		};
	}

	let position =
		window.translatePosition(member.position, member.position_en) ||
		t.teamMember ||
		"Team Member";
	if (member.role === "sub_leader") position = t.subLeader || "Sub Leader";

	const deptName = member.department_name || member.department;
	const deptMapping = {
		Marketing: t.marketing || "Marketing",
		Sponsorships: t.sponsorships || "Sponsorships",
		Management: t.management || "Management",
		"Chassis and Aerodynamics": t.chassisAero || "Chassis and Aerodynamics",
		"Suspension and Steering":
			t.suspensionSteering || "Suspension and Steering",
		"Transmission and Braking":
			t.transmissionBraking || "Transmission and Braking",
		"High Voltage": t.highVoltage || "High Voltage",
		"Low Voltage": t.lowVoltage || "Low Voltage",
	};
	const translatedDept =
		deptMapping[deptName] || window.decodeHtmlEntities(deptName) || "N/A";

	if (modalName)
		modalName.textContent = window.decodeHtmlEntities(member.full_name);
	if (modalPosition) modalPosition.textContent = position;
	if (modalDepartment)
		modalDepartment.innerHTML = `<i class="fas fa-sitemap"></i> ${t.department || "Department"}: ${translatedDept}`;
	if (modalFaculty)
		modalFaculty.innerHTML = `<i class="fas fa-university"></i> ${t.faculty || "Faculty"}: ${window.decodeHtmlEntities(member.faculty) || "N/A"}`;
	if (modalStudy)
		modalStudy.innerHTML = `<i class="fas fa-graduation-cap"></i> ${t.studyField || "Study Field"}: ${window.decodeHtmlEntities(member.study_field) || "N/A"}`;
	if (modalYear) modalYear.style.display = "none";
	if (modalEmail) modalEmail.style.display = "none";
	if (modalMotivation) modalMotivation.innerHTML = "";

	modal.style.display = "block";
	document.body.style.overflow = "hidden";
};
