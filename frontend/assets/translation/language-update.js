window.updateHomepageContent = function updateHomepageContent() {
	const t = window.getTranslations();

	const heroTitle = document.getElementById("hero-title");
	const heroSubtitle = document.getElementById("hero-subtitle");
	const discoverMore = document.getElementById("discover-more");
	const joinUsBtn = document.getElementById("join-us");
	const scrollDown = document.getElementById("scroll-down");

	if (heroTitle) heroTitle.textContent = t.heroTitle;
	if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
	if (discoverMore) discoverMore.textContent = t.discoverMore;
	if (joinUsBtn) joinUsBtn.textContent = t.joinUs;
	if (scrollDown) scrollDown.textContent = t.scrollDown;

	const latestNewsTitle =
		document.getElementById("latest-news-title") ||
		document.querySelector("#latest-news .section-header h2");
	if (latestNewsTitle) latestNewsTitle.textContent = t.latestNews;

	const moreNewsBtn = document.querySelector(
		".more-news-btn-container .primary-btn",
	);
	if (moreNewsBtn) moreNewsBtn.textContent = t.moreNews;

	const whoWeAreTitle = document.getElementById("who-black-hornets-title");
	if (whoWeAreTitle) whoWeAreTitle.textContent = t.whoAreBlackHornets;

	const textContent = document.querySelector(".text-content");
	if (textContent) {
		const paragraphs = textContent.querySelectorAll("p");
		if (paragraphs[0]) paragraphs[0].textContent = t.whoWeAreText1;
		if (paragraphs[1]) paragraphs[1].textContent = t.whoWeAreText2;
		if (paragraphs[2]) paragraphs[2].textContent = t.whoWeAreText3;
	}
};

window.updateTeamPageContent = () => {
	const t = window.getTranslations();

	const heroTitle = document.getElementById("team-hero-title");
	const heroSubtitle = document.getElementById("team-hero-subtitle");
	if (heroTitle) heroTitle.textContent = t.ourTeam;
	if (heroSubtitle) heroSubtitle.textContent = t.teamHeroSubtitle;

	const leadershipTitle = document.getElementById("team-leadership-title");
	if (leadershipTitle) leadershipTitle.textContent = t.teamLeadership;

	const deptBusinessOps = document.getElementById("dept-business-ops");
	const deptMarketing = document.getElementById("dept-marketing");
	const deptSponsorships = document.getElementById("dept-sponsorships");
	const deptManagement = document.getElementById("dept-management");
	const deptMechanical = document.getElementById("dept-mechanical");
	const deptElectrical = document.getElementById("dept-electrical");

	if (deptBusinessOps) deptBusinessOps.textContent = t.businessTeam;
	if (deptMarketing) deptMarketing.textContent = t.marketing;
	if (deptSponsorships) deptSponsorships.textContent = t.sponsorships;
	if (deptManagement) deptManagement.textContent = t.management;
	if (deptMechanical) deptMechanical.textContent = t.mechanicalEngineering;

	const deptChassisAero = document.getElementById("dept-chassis-aero");
	const deptSuspensionSteering = document.getElementById(
		"dept-suspension-steering",
	);
	const deptTransmissionBraking = document.getElementById(
		"dept-transmission-braking",
	);
	if (deptChassisAero) {
		deptChassisAero.textContent = t.chassisAero;
		deptChassisAero.setAttribute("data-original", t.chassisAero);
	}
	if (deptSuspensionSteering) {
		deptSuspensionSteering.textContent = t.suspensionSteering;
		deptSuspensionSteering.setAttribute("data-original", t.suspensionSteering);
	}
	if (deptTransmissionBraking) {
		deptTransmissionBraking.textContent = t.transmissionBraking;
		deptTransmissionBraking.setAttribute(
			"data-original",
			t.transmissionBraking,
		);
	}

	if (deptElectrical) deptElectrical.textContent = t.electricalEngineering;

	const deptHighVoltage = document.getElementById("dept-high-voltage");
	const deptLowVoltage = document.getElementById("dept-low-voltage");
	if (deptHighVoltage) {
		deptHighVoltage.textContent = t.highVoltage;
		deptHighVoltage.setAttribute("data-original", t.highVoltage);
	}
	if (deptLowVoltage) {
		deptLowVoltage.textContent = t.lowVoltage;
		deptLowVoltage.setAttribute("data-original", t.lowVoltage);
	}

	const backToTeams = document.getElementById("back-to-teams");
	if (backToTeams) backToTeams.textContent = t.backToTeams;

	const seeTeamBtn1 = document.getElementById("see-team-btn-1");
	const seeTeamBtn2 = document.getElementById("see-team-btn-2");
	const seeTeamBtn3 = document.getElementById("see-team-btn-3");
	if (seeTeamBtn1) seeTeamBtn1.textContent = t.seeTeamMembers;
	if (seeTeamBtn2) seeTeamBtn2.textContent = t.seeTeamMembers;
	if (seeTeamBtn3) seeTeamBtn3.textContent = t.seeTeamMembers;
};

window.updateAboutPageContent = () => {
	const t = window.getTranslations();

	const aboutHeading = document.getElementById("about-heading");
	const drivingInnovation = document.getElementById("driving-innovation");
	if (aboutHeading) aboutHeading.textContent = t.aboutBlackHornets;
	if (drivingInnovation) drivingInnovation.textContent = t.drivingInnovation;

	const speedBadge = document.getElementById("speed-badge");
	const innovationBadge = document.getElementById("innovation-badge");
	const excellenceBadge = document.getElementById("excellence-badge");
	if (speedBadge) speedBadge.textContent = t.speed;
	if (innovationBadge) innovationBadge.textContent = t.innovation;
	if (excellenceBadge) excellenceBadge.textContent = t.excellence;

	const ourStory = document.getElementById("our-story");
	const storyContent = document.getElementById("story-content");
	if (ourStory) ourStory.textContent = t.ourStory;
	if (storyContent) storyContent.textContent = t.storyContent;

	const teamMembersLabel = document.getElementById("team-members-label");
	const departmentsLabel = document.getElementById("departments-label");
	const awardsLabel = document.getElementById("awards-label");
	if (teamMembersLabel) teamMembersLabel.textContent = t.teamMembersLabel;
	if (departmentsLabel) departmentsLabel.textContent = t.departmentsLabel;
	if (awardsLabel) awardsLabel.textContent = t.awardsLabel;

	const ourMission = document.getElementById("our-mission");
	const missionContent = document.getElementById("mission-content");
	const ourVision = document.getElementById("our-vision");
	const visionContent = document.getElementById("vision-content");
	if (ourMission) ourMission.textContent = t.ourMission;
	if (missionContent) missionContent.textContent = t.missionContent;
	if (ourVision) ourVision.textContent = t.ourVision;
	if (visionContent) visionContent.textContent = t.visionContent;

	const ourDepartments = document.getElementById("our-departments");
	if (ourDepartments) ourDepartments.textContent = t.ourDepartments;

	const marketingTitle = document.getElementById("marketing-title");
	const marketingDesc = document.getElementById("marketing-desc");
	const sponsorshipsTitle = document.getElementById("sponsorships-title");
	const sponsorshipsDesc = document.getElementById("sponsorships-desc");
	const managementTitle = document.getElementById("management-title");
	const managementDesc = document.getElementById("management-desc");
	const chassisAeroTitle = document.getElementById("chassis-aero-title");
	const chassisAeroDesc = document.getElementById("chassis-aero-desc");
	const suspensionSteeringTitle = document.getElementById(
		"suspension-steering-title",
	);
	const suspensionSteeringDesc = document.getElementById(
		"suspension-steering-desc",
	);
	const transmissionBrakingTitle = document.getElementById(
		"transmission-braking-title",
	);
	const transmissionBrakingDesc = document.getElementById(
		"transmission-braking-desc",
	);
	const highVoltageTitle = document.getElementById("high-voltage-title");
	const highVoltageDesc = document.getElementById("high-voltage-desc");
	const lowVoltageTitle = document.getElementById("low-voltage-title");
	const lowVoltageDesc = document.getElementById("low-voltage-desc");

	if (marketingTitle) marketingTitle.textContent = t.marketingTitle;
	if (marketingDesc) marketingDesc.textContent = t.marketingDesc;
	if (sponsorshipsTitle) sponsorshipsTitle.textContent = t.sponsorshipsTitle;
	if (sponsorshipsDesc) sponsorshipsDesc.textContent = t.sponsorshipsDesc;
	if (managementTitle) managementTitle.textContent = t.managementTitle;
	if (managementDesc) managementDesc.textContent = t.managementDesc;
	if (chassisAeroTitle) chassisAeroTitle.textContent = t.chassisAeroTitle;
	if (chassisAeroDesc) chassisAeroDesc.textContent = t.chassisAeroDesc;
	if (suspensionSteeringTitle)
		suspensionSteeringTitle.textContent = t.suspensionSteeringTitle;
	if (suspensionSteeringDesc)
		suspensionSteeringDesc.textContent = t.suspensionSteeringDesc;
	if (transmissionBrakingTitle)
		transmissionBrakingTitle.textContent = t.transmissionBrakingTitle;
	if (transmissionBrakingDesc)
		transmissionBrakingDesc.textContent = t.transmissionBrakingDesc;
	if (highVoltageTitle) highVoltageTitle.textContent = t.highVoltageTitle;
	if (highVoltageDesc) highVoltageDesc.textContent = t.highVoltageDesc;
	if (lowVoltageTitle) lowVoltageTitle.textContent = t.lowVoltageTitle;
	if (lowVoltageDesc) lowVoltageDesc.textContent = t.lowVoltageDesc;
};

window.updateProjectsPageContent = () => {
	const t = window.getTranslations();

	const ourProjects = document.getElementById("our-projects");
	const projectsSubtitle = document.getElementById("projects-subtitle");
	if (ourProjects) ourProjects.textContent = t.ourProjects;
	if (projectsSubtitle) projectsSubtitle.textContent = t.projectsSubtitle;

	const futureProjectsTitle = document.getElementById("future-projects-title");
	if (futureProjectsTitle) futureProjectsTitle.textContent = t.futureProjects;
};

window.updateGalleryPageContent = () => {
	const t = window.getTranslations();

	const ourGallery = document.getElementById("our-gallery");
	const gallerySubtitle = document.getElementById("gallery-subtitle");
	if (ourGallery) ourGallery.textContent = t.ourGallery;
	if (gallerySubtitle) gallerySubtitle.textContent = t.gallerySubtitle;

	const raceCarsTitle = document.getElementById("race-cars-title");
	const raceCarsDesc = document.getElementById("race-cars-desc");
	const teamSectionTitle = document.getElementById("team-section-title");
	const teamSectionDesc = document.getElementById("team-section-desc");
	const eventsTitle = document.getElementById("events-title");
	const eventsDesc = document.getElementById("events-desc");
	const workshopTitle = document.getElementById("workshop-title");
	const workshopDesc = document.getElementById("workshop-desc");

	if (raceCarsTitle) raceCarsTitle.textContent = t.raceCarsTitle;
	if (raceCarsDesc) {
		raceCarsDesc.innerHTML = t.raceCarsDesc
			.replace(
				/Black Hornets Racing/,
				'<span class="highlight">Black Hornets Racing</span>',
			)
			.replace(
				/inovacija|innovation/,
				'<span class="highlight-secondary">$&</span>',
			);
	}
	if (teamSectionTitle) teamSectionTitle.textContent = t.teamSectionTitle;
	if (teamSectionDesc) {
		teamSectionDesc.innerHTML = t.teamSectionDesc
			.replace(
				/strastvene umove|passionate minds/,
				'<span class="highlight">$&</span>',
			)
			.replace(
				/dizajnera|designers/,
				'<span class="highlight-secondary">$&</span>',
			)
			.replace(
				/inovatora|innovators/,
				'<span class="highlight-secondary">$&</span>',
			);
	}
	if (eventsTitle) eventsTitle.textContent = t.eventsTitle;
	if (eventsDesc) {
		eventsDesc.innerHTML = t.eventsDesc;
	}
	if (workshopTitle) workshopTitle.textContent = t.workshopTitle;
	if (workshopDesc) {
		workshopDesc.innerHTML = t.workshopDesc.replace(
			/ideje pretvaraju u stvarnost|ideas transform into reality/,
			'<span class="highlight-secondary">$&</span>',
		);
	}
};

window.updateSponsorsPageContent = () => {
	const t = window.getTranslations();

	const ourSponsors = document.getElementById("our-sponsors");
	const partnersInnovation = document.getElementById("partners-innovation");
	if (ourSponsors) ourSponsors.textContent = t.ourSponsors;
	if (partnersInnovation) partnersInnovation.textContent = t.partnersInnovation;

	const sponsorshipTiers = document.getElementById("sponsorship-tiers");
	const sponsorshipTiersMain = document.getElementById(
		"sponsorship-tiers-main",
	);
	if (sponsorshipTiers) sponsorshipTiers.textContent = t.sponsorshipTiers;
	if (sponsorshipTiersMain)
		sponsorshipTiersMain.textContent = t.sponsorshipTiers;

	const institutionsTierTitle = document.getElementById(
		"institutions-tier-title",
	);
	const platinumTierTitle = document.getElementById("platinum-tier-title");
	const goldTierTitle = document.getElementById("gold-tier-title");
	const silverTierTitle = document.getElementById("silver-tier-title");
	const bronzeTierTitle = document.getElementById("bronze-tier-title");
	const friendsTierTitle = document.getElementById("friends-tier-title");

	if (institutionsTierTitle)
		institutionsTierTitle.textContent = t.institutionsTier;
	if (platinumTierTitle) platinumTierTitle.textContent = t.platinumTier;
	if (goldTierTitle) goldTierTitle.textContent = t.goldTier;
	if (silverTierTitle) silverTierTitle.textContent = t.silverTier;
	if (bronzeTierTitle) bronzeTierTitle.textContent = t.bronzeTier;
	if (friendsTierTitle) friendsTierTitle.textContent = t.friendsTier;

	const currentSponsorsTitle = document.getElementById(
		"current-sponsors-title",
	);
	if (currentSponsorsTitle)
		currentSponsorsTitle.textContent = t.currentSponsorsTitle;

	const becomeSponsor = document.getElementById("become-sponsor");
	const joinJourney = document.getElementById("join-journey");
	const partnerNewsletter = document.getElementById("partner-newsletter");
	const partnerBrochure = document.getElementById("partner-brochure");

	if (becomeSponsor) becomeSponsor.textContent = t.becomeSponsor;
	if (joinJourney) joinJourney.textContent = t.joinJourney;
	if (partnerNewsletter) partnerNewsletter.textContent = t.partnerNewsletter;
	if (partnerBrochure) partnerBrochure.textContent = t.partnerBrochure;

	const brochureTitle = document.getElementById("brochure-title");
	const brochureSubtitle = document.getElementById("brochure-subtitle");
	const previousPage = document.getElementById("previous-page");
	const nextPageText = document.getElementById("next-page-text");

	if (brochureTitle) brochureTitle.textContent = t.brochureTitle;
	if (brochureSubtitle) brochureSubtitle.textContent = t.brochureSubtitle;
	if (previousPage) previousPage.textContent = t.previousPage;
	if (nextPageText) nextPageText.textContent = t.nextPage;

	const downloadBrochureText = document.getElementById(
		"download-brochure-text",
	);
	if (downloadBrochureText)
		downloadBrochureText.textContent = t.downloadBrochure;
};

window.updateContactPageContent = () => {
	if (!window.location.pathname.includes("contact")) return;

	const t = window.getTranslations();

	const heroTitle = document.getElementById("hero-title");
	const heroSubtitle = document.getElementById("hero-subtitle");
	if (heroTitle) heroTitle.textContent = t.contactUs;
	if (heroSubtitle) heroSubtitle.textContent = t.contactHeroSubtitle;

	const locationTitle = document.getElementById("location-title");
	const locationAddress = document.getElementById("location-address");
	const emailTitle = document.getElementById("email-title");
	const followTitle = document.getElementById("follow-title");

	if (locationTitle) locationTitle.textContent = t.visitUs;
	if (locationAddress) locationAddress.textContent = t.locationAddress;
	if (emailTitle) emailTitle.textContent = t.writeUs;
	if (followTitle) followTitle.textContent = t.followUs;

	const formTitle = document.getElementById("form-title");
	const nameLabel = document.getElementById("name-label");
	const emailLabel = document.getElementById("email-label");
	const subjectLabel = document.getElementById("subject-label");
	const messageLabel = document.getElementById("message-label");
	const submitButton = document.getElementById("submit-button");

	if (formTitle) formTitle.textContent = t.sendMessage;
	if (nameLabel) nameLabel.textContent = t.fullName;
	if (emailLabel) emailLabel.textContent = t.emailAddress;
	if (subjectLabel) subjectLabel.textContent = t.subject;
	if (messageLabel) messageLabel.textContent = t.yourMessage;
	if (submitButton) submitButton.textContent = t.sendMessageButton;

	const ourLocation = document.getElementById("our-location");
	const locationDesc = document.getElementById("location-desc");
	if (ourLocation) ourLocation.textContent = t.ourLocation;
	if (locationDesc) locationDesc.textContent = t.locationDesc;

	const faqHeading = document.getElementById("faq-heading");
	const faq1Question = document.getElementById("faq1-question");
	const faq1Answer = document.getElementById("faq1-answer");
	const faq2Question = document.getElementById("faq2-question");
	const faq2Answer = document.getElementById("faq2-answer");
	const faq3Question = document.getElementById("faq3-question");
	const faq3Answer = document.getElementById("faq3-answer");
	const faq4Question = document.getElementById("faq4-question");
	const faq4Answer = document.getElementById("faq4-answer");
	const faq5Question = document.getElementById("faq5-question");
	const faq5Answer = document.getElementById("faq5-answer");
	const faq6Question = document.getElementById("faq6-question");
	const faq6Answer = document.getElementById("faq6-answer");

	if (faqHeading) faqHeading.textContent = t.faqHeading;
	if (faq1Question) faq1Question.textContent = t.faq1Question;
	if (faq1Answer) faq1Answer.textContent = t.faq1Answer;
	if (faq2Question) faq2Question.textContent = t.faq2Question;
	if (faq2Answer) faq2Answer.textContent = t.faq2Answer;
	if (faq3Question) faq3Question.textContent = t.faq3Question;
	if (faq3Answer) faq3Answer.textContent = t.faq3Answer;
	if (faq4Question) faq4Question.textContent = t.faq4Question;
	if (faq4Answer) faq4Answer.textContent = t.faq4Answer;
	if (faq5Question) faq5Question.textContent = t.faq5Question;
	if (faq5Answer) faq5Answer.textContent = t.faq5Answer;
	if (faq6Question) faq6Question.textContent = t.faq6Question;
	if (faq6Answer) faq6Answer.textContent = t.faq6Answer;
};

window.updateApplyPageContent = () => {
	if (!window.location.pathname.includes("apply")) return;

	const t = window.getTranslations();

	const joinTeam = document.getElementById("join-team");
	const bePart = document.getElementById("be-part");
	if (joinTeam) joinTeam.textContent = t.joinOurTeam;
	if (bePart) bePart.textContent = t.bePart;

	const requirementsTitle = document.getElementById("requirements-title");
	const req1Title = document.getElementById("req1-title");
	const req1Desc = document.getElementById("req1-desc");
	const req2Title = document.getElementById("req2-title");
	const req2Desc = document.getElementById("req2-desc");
	const req3Title = document.getElementById("req3-title");
	const req3Desc = document.getElementById("req3-desc");

	if (requirementsTitle) requirementsTitle.textContent = t.requirements;
	if (req1Title) req1Title.textContent = t.studentStatus;
	if (req1Desc) req1Desc.textContent = t.studentStatusDesc;
	if (req2Title) req2Title.textContent = t.passion;
	if (req2Desc) req2Desc.textContent = t.passionDesc;
	if (req3Title) req3Title.textContent = t.teamSpirit;
	if (req3Desc) req3Desc.textContent = t.teamSpiritDesc;

	const departmentsTitle = document.getElementById("departments-title");
	const businessOps = document.getElementById("business-ops");
	const marketingDept = document.getElementById("marketing-dept");
	const sponsorshipsDept = document.getElementById("sponsorships-dept");
	const managementDept = document.getElementById("management-dept");
	const mechanicalEng = document.getElementById("mechanical-eng");
	const chassisAeroDept = document.getElementById("chassis-aero-dept");
	const suspensionSteeringDept = document.getElementById(
		"suspension-steering-dept",
	);
	const transmissionBrakingDept = document.getElementById(
		"transmission-braking-dept",
	);
	const electricalEng = document.getElementById("electrical-eng");
	const highVoltageDept = document.getElementById("high-voltage-dept");
	const lowVoltageDept = document.getElementById("low-voltage-dept");

	if (departmentsTitle) departmentsTitle.textContent = t.availableDepartments;
	if (businessOps) businessOps.textContent = t.businessTeam;
	if (marketingDept) marketingDept.textContent = t.marketing;
	if (sponsorshipsDept) sponsorshipsDept.textContent = t.sponsorships;
	if (managementDept) managementDept.textContent = t.management;
	if (mechanicalEng) mechanicalEng.textContent = t.mechanicalEngineering;
	if (chassisAeroDept) chassisAeroDept.textContent = t.chassisAero;
	if (suspensionSteeringDept)
		suspensionSteeringDept.textContent = t.suspensionSteering;
	if (transmissionBrakingDept)
		transmissionBrakingDept.textContent = t.transmissionBraking;
	if (electricalEng) electricalEng.textContent = t.electricalEngineering;
	if (highVoltageDept) highVoltageDept.textContent = t.highVoltage;
	if (lowVoltageDept) lowVoltageDept.textContent = t.lowVoltage;

	const applicationFormTitle = document.getElementById(
		"application-form-title",
	);
	const applicationFormSubtitle = document.getElementById(
		"application-form-subtitle",
	);
	const personalInfo = document.getElementById("personal-info");
	const academicInfo = document.getElementById("academic-info");
	const teamPreferences = document.getElementById("team-preferences");
	const additionalDocs = document.getElementById("additional-docs");

	if (applicationFormTitle)
		applicationFormTitle.textContent = t.applicationForm;
	if (applicationFormSubtitle)
		applicationFormSubtitle.textContent = t.applicationFormSubtitle;
	if (personalInfo) personalInfo.textContent = t.personalInfo;
	if (academicInfo) academicInfo.textContent = t.academicInfo;
	if (teamPreferences) teamPreferences.textContent = t.teamPreferences;
	if (additionalDocs) additionalDocs.textContent = t.additionalDocuments;

	const firstNameLabel = document.getElementById("first-name-label");
	const lastNameLabel = document.getElementById("last-name-label");
	const emailLabel = document.getElementById("email-label");
	const phoneLabel = document.getElementById("phone-label");
	const studentIdLabel = document.getElementById("student-id-label");
	const facultyLabel = document.getElementById("faculty-label");
	const majorLabel = document.getElementById("major-label");
	const academicYearLabel = document.getElementById("academic-year-label");
	const gpaLabel = document.getElementById("gpa-label");
	const positionLabel = document.getElementById("position-label");
	const experienceLabel = document.getElementById("experience-label");
	const motivationLabel = document.getElementById("motivation-label");
	const resumeText = document.getElementById("resume-text");
	const submitApplication = document.getElementById("submit-application");

	if (firstNameLabel) firstNameLabel.textContent = t.firstName;
	if (lastNameLabel) lastNameLabel.textContent = t.lastName;
	if (emailLabel) emailLabel.textContent = t.emailAddress;
	if (phoneLabel) phoneLabel.textContent = t.phoneNumber;
	if (studentIdLabel) studentIdLabel.textContent = t.studentId;
	if (facultyLabel) facultyLabel.textContent = t.faculty;
	if (majorLabel) majorLabel.textContent = t.major;
	if (academicYearLabel) academicYearLabel.textContent = t.academicYear;
	if (gpaLabel) gpaLabel.textContent = t.gpa;
	if (positionLabel) positionLabel.textContent = t.desiredPosition;
	if (experienceLabel) experienceLabel.textContent = t.relevantExperience;
	if (motivationLabel) motivationLabel.textContent = t.whyJoin;
	if (resumeText) resumeText.textContent = t.resumeCV;
	if (submitApplication) submitApplication.textContent = t.submitApplication;

	const selectYear = document.getElementById("select-year");
	const firstYear = document.getElementById("first-year");
	const secondYear = document.getElementById("second-year");
	const thirdYear = document.getElementById("third-year");
	const fourthYear = document.getElementById("fourth-year");
	const masterStudies = document.getElementById("master-studies");
	const doctoralStudies = document.getElementById("doctoral-studies");
	const yearsStudyingLabel = document.getElementById("years-studying-label");

	if (selectYear) selectYear.textContent = t.selectYear;
	if (firstYear) firstYear.textContent = t.firstYear;
	if (secondYear) secondYear.textContent = t.secondYear;
	if (thirdYear) thirdYear.textContent = t.thirdYear;
	if (fourthYear) fourthYear.textContent = t.fourthYear;
	if (masterStudies) masterStudies.textContent = t.masterStudies;
	if (doctoralStudies) doctoralStudies.textContent = t.doctoralStudies;
	if (yearsStudyingLabel) yearsStudyingLabel.textContent = t.yearsStudying;

	updateSelectOptions(t);
};

function updateSelectOptions(t) {
	const majorSelect = document.getElementById("major");
	if (majorSelect) {
		const options = majorSelect.querySelectorAll("option");
		if (options[0]) options[0].textContent = t.selectMajor;
		if (options[1]) options[1].textContent = t.mechanicalEngineering;
		if (options[2]) options[2].textContent = t.electricalEngineering;
		if (options[3]) options[3].textContent = t.computerScience;
		if (options[4]) options[4].textContent = t.businessAdministration;
		if (options[5]) options[5].textContent = t.marketing;
		if (options[6]) options[6].textContent = t.logistics;
		if (options[7]) options[7].textContent = t.other;
	}

	const yearSelect = document.getElementById("academic_year");
	if (yearSelect) {
		const options = yearSelect.querySelectorAll("option");
		if (options[0]) options[0].textContent = t.selectYear;
		if (options[1]) options[1].textContent = t.firstYear;
		if (options[2]) options[2].textContent = t.secondYear;
		if (options[3]) options[3].textContent = t.thirdYear;
		if (options[4]) options[4].textContent = t.fourthYear;
	}

	const teamSelect = document.getElementById("team");
	if (teamSelect) {
		const options = teamSelect.querySelectorAll("option");
		if (options[0]) options[0].textContent = t.selectTeam;
		if (options[1]) options[1].textContent = t.mechanicalEngineering;
		if (options[2]) options[2].textContent = t.electricalEngineering;
		if (options[3]) options[3].textContent = t.businessOperations;
	}

	const deptSelect = document.getElementById("department");
	if (deptSelect) {
		const deptOptions = deptSelect.querySelectorAll("option");
		if (deptOptions[0]) deptOptions[0].textContent = t.selectDepartment;

		const optgroups = deptSelect.querySelectorAll("optgroup");
		if (optgroups[0]) optgroups[0].label = t.businessOperations;
		if (optgroups[1]) optgroups[1].label = t.electricalEngineering;
		if (optgroups[2]) optgroups[2].label = t.mechanicalEngineering;

		const marketingOpt = deptSelect.querySelector('option[value="marketing"]');
		const sponsorshipsOpt = deptSelect.querySelector(
			'option[value="sponsorships"]',
		);
		const managementOpt = deptSelect.querySelector(
			'option[value="management"]',
		);
		const chassisAeroOpt = deptSelect.querySelector(
			'option[value="chassis_aero"]',
		);
		const suspensionSteeringOpt = deptSelect.querySelector(
			'option[value="suspension_steering"]',
		);
		const transmissionBrakingOpt = deptSelect.querySelector(
			'option[value="transmission_braking"]',
		);
		const highVoltageOpt = deptSelect.querySelector(
			'option[value="high_voltage"]',
		);
		const lowVoltageOpt = deptSelect.querySelector(
			'option[value="low_voltage"]',
		);

		if (marketingOpt) marketingOpt.textContent = t.marketing;
		if (sponsorshipsOpt) sponsorshipsOpt.textContent = t.sponsorships;
		if (managementOpt) managementOpt.textContent = t.management;
		if (chassisAeroOpt) chassisAeroOpt.textContent = t.chassisAero;
		if (suspensionSteeringOpt)
			suspensionSteeringOpt.textContent = t.suspensionSteering;
		if (transmissionBrakingOpt)
			transmissionBrakingOpt.textContent = t.transmissionBraking;
		if (highVoltageOpt) highVoltageOpt.textContent = t.highVoltage;
		if (lowVoltageOpt) lowVoltageOpt.textContent = t.lowVoltage;
	}

	const positionInput = document.getElementById("position");
	if (positionInput) positionInput.placeholder = t.yourDesiredPosition;
}

window.updateLanguageContent = () => {
	window.loadHeader?.();
	window.loadFooter?.();
	window.updateHomepageContent?.();
	window.updateTeamPageContent?.();
	window.updateAboutPageContent?.();
	window.updateProjectsPageContent?.();
	window.updateGalleryPageContent?.();
	window.updateSponsorsPageContent?.();
	window.updateContactPageContent?.();
	window.updateApplyPageContent?.();
	if (typeof window.loadProjects === "function") window.loadProjects();
	if (typeof window.loadSponsors === "function") window.loadSponsors();
};
