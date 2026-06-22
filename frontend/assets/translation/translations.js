let currentLanguage = localStorage.getItem("language") || "en";

const translations = {
	en: {
		// Navigation
		home: "Home",
		team: "Team",
		about: "About",
		projects: "Projects",
		gallery: "Gallery",
		sponsors: "Sponsors",
		contact: "Contact",
		login: "Login",
		applyNow: "Apply",

		// Footer
		contactUs: "Contact Us",
		followUs: "Follow Us",
		quickLinks: "Quick Links",
		allRightsReserved: "All rights reserved",

		// Homepage
		heroTitle: "Black Hornets",
		heroSubtitle: "Formula Student Novi Sad",
		discoverMore: "Discover More",
		joinUs: "Join Us",
		scrollDown: "Scroll Down",
		latestNews: "Latest News",
		moreNews: "More News",
		featured: "Featured",
		noNewsFound: "No news found",
		whoAreBlackHornets: "Who Are Black Hornets",
		whoWeAreText1:
			"Black Hornets Racing is a passionate team of engineering students dedicated to pushing the boundaries of automotive innovation. We combine cutting-edge technology with sustainable practices to create high-performance racing vehicles that represent the future of motorsports.",
		whoWeAreText2:
			"Our team brings together diverse talents from mechanical engineering, electrical engineering, aerodynamics, and data analysis. We believe in learning through hands-on experience, competing in international competitions, and developing solutions that address real-world challenges in the automotive industry.",
		whoWeAreText3:
			"From concept to track, every project is an opportunity for innovation, collaboration, and excellence. We don't just build cars – we build the future of racing.",

		// Team Page
		ourTeam: "OUR TEAM",
		teamHeroSubtitle: "Meet the innovators behind Black Hornets Racing team.",
		teamLeadership: "Team Leadership",
		teamLeader: "Team Leader",
		projectLeader: "Project Leader",
		subLeader: "Sub Leader",
		businessTeam: "Business Team",
		marketing: "Marketing",
		sponsorships: "Sponsorships",
		management: "Management",
		mechanicalEngineering: "Mechanical Engineering",
		chassisAero: "Chassis and Aerodynamics",
		suspensionSteering: "Suspension and Steering",
		transmissionBraking: "Transmission and Braking",
		electricalEngineering: "Electrical Engineering",
		highVoltage: "High Voltage",
		lowVoltage: "Low Voltage",
		backToTeams: "Back to Teams",
		email: "Email",
		studyField: "Study Field",
		academicYear: "Academic Year",
		motivation: "Motivation",
		skills: "Skills",
		teamMember: "Team Member",
		noMembersInDepartment: "No members in this department yet",
		department: "Department",
		seeTeamMembers: "See Team Members",
		allMembers: "All Members",
		noMembersFound: "No members found",

		// Position translations (keys stored in DB)
		pos_engineer: "Engineer",
		pos_designer: "Designer",
		pos_cad_engineer: "CAD Engineer",
		pos_suspension_engineer: "Suspension Engineer",
		pos_aerodynamics_engineer: "Aerodynamics Engineer",
		pos_thermal_engineer: "Thermal Engineer",
		pos_chassis_engineer: "Chassis Engineer",
		pos_electronics_engineer: "Electronics Engineer",
		pos_firmware_developer: "Firmware Developer",
		pos_software_developer: "Software Developer",
		pos_battery_specialist: "Battery Specialist",
		pos_pcb_designer: "PCB Designer",
		pos_content_creator: "Content Creator",
		pos_social_media_manager: "Social Media Manager",
		pos_marketing_manager: "Marketing Manager",
		pos_sponsorship_manager: "Sponsorship Manager",
		pos_event_coordinator: "Event Coordinator",
		pos_graphic_designer: "Graphic Designer",
		pos_photographer: "Photographer",
		pos_budget_analyst: "Budget Analyst",
		pos_project_coordinator: "Project Coordinator",

		// About Page
		aboutBlackHornets: "About Black Hornets",
		drivingInnovation: "Driving innovation in student racing.",
		speed: "Speed",
		innovation: "Innovation",
		excellence: "Excellence",
		ourStory: "Our Story",
		storyContent:
			"Black Hornets Racing was founded by a group of passionate engineering students. What started as a small project has become one of the most dynamic Formula Student teams in the region.",
		teamMembersCount: "50+",
		teamMembersLabel: "Team Members",
		departmentsCount: "5",
		departmentsLabel: "Departments",
		awardsCount: "10+",
		awardsLabel: "Awards",
		ourMission: "Our Mission",
		missionContent:
			"To develop innovative racing solutions, providing students passionate about motorsports with practical engineering experience.",
		ourVision: "Our Vision",
		visionContent:
			"To become a leading Formula Student team, known for technical innovations and professional development of future engineers.",
		ourDepartments: "Our Departments",
		marketingTitle: "Marketing",
		marketingDesc:
			"Team promotion, content creation, and social media management.",
		sponsorshipsTitle: "Sponsorships",
		sponsorshipsDesc:
			"Partner communication, negotiations, and sponsor relations.",
		managementTitle: "Management",
		managementDesc:
			"Team organization, project coordination, and resource management.",
		chassisAeroTitle: "Chassis and Aerodynamics",
		chassisAeroDesc:
			"Chassis design, structural analysis, and aerodynamic optimization.",
		suspensionSteeringTitle: "Suspension and Steering",
		suspensionSteeringDesc:
			"Suspension systems, steering geometry, and vehicle dynamics.",
		transmissionBrakingTitle: "Transmission and Braking",
		transmissionBrakingDesc:
			"Drivetrain components, braking systems, and power delivery.",
		highVoltageTitle: "High Voltage",
		highVoltageDesc:
			"Battery systems, high voltage distribution, and energy management.",
		lowVoltageTitle: "Low Voltage",
		lowVoltageDesc:
			"Control electronics, sensors, CAN communication, and low voltage systems.",

		// Projects Page
		ourProjects: "Our Projects",
		projectsSubtitle:
			"Discover our innovative racing solutions and engineering achievements.",
		futureProjects: "Future Projects",
		loadingProjects: "Loading projects...",
		projectsComingSoon: "Projects Coming Soon",
		workingOnProjects: "Our team is working hard on amazing projects.",
		stayTuned: "Follow us for the latest updates!",
		errorLoadingProjects: "Error Loading Projects",
		unableToLoad:
			"Unable to load projects at this time. Please try again later.",
		progress: "Progress",
		dueDate: "Due",
		duration: "Duration",
		daysRemaining: "days remaining",
		daysOverdue: "days overdue",
		active: "Active",
		completed: "Completed",
		pending: "Pending",

		// Gallery Page
		ourGallery: "Our Gallery",
		gallerySubtitle: "Capturing Our Racing Journey",
		raceCarsTitle: "Race Cars",
		raceCarsDesc:
			"Black Hornets Racing showcases our cutting-edge Formula Student race cars. Each vehicle represents countless hours of innovation, precision engineering, and aerodynamic excellence.",
		teamSectionTitle: "Our Team",
		teamSectionDesc:
			"Meet the passionate minds behind our success. A diverse team of engineers, designers, and innovators working together to achieve excellence.",
		eventsTitle: "Events and Competitions",
		eventsDesc:
			"Witness our competitive spirit in action. From Formula Student competitions to engineering showcases, every event tells a story of determination.",
		workshopTitle: "Workshop",
		workshopDesc:
			"Step into our engineering sanctuary. Where ideas transform into reality, and innovation meets craftsmanship in our state-of-the-art facility.",
		noImagesAvailable: "No images available",
		errorLoadingImages: "Error loading images",
		galleryCategory: "Category",
		galleryDate: "Added",
		categoryRaceCars: "Race Cars",
		categoryTeam: "Team",
		categoryEvents: "Events & Competitions",
		categoryWorkshop: "Workshop",

		// Sponsors Page
		ourSponsors: "Our Sponsors",
		partnersInnovation: "Partners in Innovation and Excellence",
		sponsorshipTiers: "Sponsorship Packages",
		institutionsTier: "Institutions",
		institucijaTier: "Institucija",
		platinumTier: "F1 - Platinum",
		goldTier: "F2 - Gold",
		silverTier: "F3 - Silver",
		bronzeTier: "F4 - Bronze",
		friendsTier: "Friends of the Project",
		currentSponsorsTitle: "Our Sponsors",
		becomeSponsor: "Become a Sponsor",
		joinJourney:
			"If you want to share our vision and invest in the potential of young ambitious people as well as a project designed to enhance competencies, skills and abilities outside the formal education environment, in our partner brochure, you can find out how to become a sponsor.",
		partnerNewsletter: "Partner Newsletter",
		partnerBrochure: "Partner Brochure",
		brochureTitle: "Partner Brochure",
		brochureSubtitle: "Explore our partnership opportunities",
		downloadBrochure: "Download Brochure",
		previousPage: "Previous",
		nextPage: "Next",
		loadingSponsors: "Loading sponsors...",
		comingSoon: "Coming Soon",
		sponsorsComingSoon:
			"We are in the process of confirming our sponsor partnerships. Stay tuned for updates!",
		errorLoadingSponsors: "Error Loading Sponsors",
		unableToLoadSponsors:
			"Unable to load sponsors at this time. Please try again later.",
		visitWebsite: "Visit Website",

		// Contact Page
		contactHeroSubtitle: "Have questions? We'd love to hear from you.",
		visitUs: "Visit Us",
		locationAddress: "University of Novi Sad, Serbia",
		writeUs: "Write to Us",
		sendMessage: "Send us a message",
		fullName: "Full Name",
		emailAddress: "Email Address",
		subject: "Subject",
		yourMessage: "Your Message",
		sendMessageButton: "Send Message",
		ourLocation: "Our Location",
		locationDesc:
			"We are located in the Faculty of Technical Sciences building at the University of Novi Sad",
		faqHeading: "Frequently Asked Questions",
		faq1Question: "How can I join the team?",
		faq1Answer:
			"Visit the Apply page and fill out the form. We regularly review applications and will contact qualified candidates.",
		faq2Question: "Do you offer sponsorship opportunities?",
		faq2Answer:
			"Yes, we offer various sponsorship packages. For more information, contact our sponsorship team.",
		faq3Question: "What is Formula Student?",
		faq3Answer:
			"Formula Student is an international engineering competition where student teams design, build, and race a small formula-style car. Teams are judged on vehicle performance, engineering design, cost, and business presentation.",
		faq4Question: "What departments can I join?",
		faq4Answer:
			"We have mechanical, electrical, and business departments. Mechanical covers chassis, suspension, and powertrain. Electrical covers electronics and software. Business covers marketing, sponsorships, and management.",
		faq5Question: "When and where do you compete?",
		faq5Answer:
			"We compete at Formula Student events across Europe, typically held between June and September. Our home base is the Faculty of Technical Sciences at the University of Novi Sad.",
		faq6Question: "Can I visit your workshop?",
		faq6Answer:
			"Yes! We welcome visits from students interested in joining or learning about our work. Reach out to us via the contact form or social media to arrange a visit.",

		// Apply Page
		joinOurTeam: "Join Our Team",
		bePart: "Be part of something extraordinary",
		requirements: "Requirements",
		studentStatus: "Student Status",
		studentStatusDesc: "Active student at University of Novi Sad",
		passion: "Passion",
		passionDesc: "Enthusiasm for motorsports and engineering",
		teamSpirit: "Team Spirit",
		teamSpiritDesc: "Ability to work in a collaborative environment",
		availableDepartments: "Available Departments",
		positionsHeading: "Available Departments",
		applicationForm: "Application Form",
		applicationFormSubtitle:
			"Fill out the form below to apply for a position in our team",
		desiredPosition: "Desired Position",
		personalInfo: "Personal Information",
		firstName: "First Name",
		lastName: "Last Name",
		phoneNumber: "Phone Number",
		academicInfo: "Academic Information",
		studentId: "Student ID",
		faculty: "Faculty",
		major: "Major",
		selectMajor: "Select Major",
		computerScience: "Computer Science",
		businessAdministration: "Business Administration",
		other: "Other",
		selectYear: "Select Year",
		firstYear: "First Year",
		secondYear: "Second Year",
		thirdYear: "Third Year",
		fourthYear: "Fourth Year",
		gpa: "GPA",
		teamPreferences: "Team Preferences",
		desiredTeam: "Desired Team",
		selectTeam: "Select Team",
		businessOperations: "Business Operations",
		selectDepartment: "Select Department",
		position: "Position",
		yourDesiredPosition: "Your desired position",
		relevantExperience: "Relevant Experience",
		whyJoin: "Why do you want to join our team?",
		additionalDocuments: "Additional Documents",
		resumeCV: "Resume/CV (PDF only)",
		submitApplication: "Submit Application",
	},
	sr: {
		// Navigation
		home: "Početna",
		team: "Tim",
		about: "O nama",
		projects: "Projekti",
		gallery: "Galerija",
		sponsors: "Sponzori",
		contact: "Kontakt",
		login: "Prijava",
		applyNow: "Postani član",

		// Footer
		contactUs: "Kontaktirajte nas",
		quickLinks: "Brze veze",
		allRightsReserved: "Sva prava zadržana",

		// Homepage
		heroTitle: "Crni Stršljeni",
		heroSubtitle: "Formula Student Novi Sad",
		discoverMore: "Saznaj više",
		joinUs: "Pridruži nam se",
		scrollDown: "Scroll Down",
		latestNews: "Najnovije vesti",
		moreNews: "Još vesti",
		featured: "Istaknuto",
		noNewsFound: "Nema vesti",
		whoAreBlackHornets: "Ko su Crni Stršljeni",
		whoWeAreText1:
			"Black Hornets Racing je strastven tim studenata inženjerstva posvećen pomeranju granica automobilske inovacije. Kombinujemo najsavremeniju tehnologiju sa održivim praksama kako bismo stvorili trkačka vozila visokih performansi koja predstavljaju budućnost auto-moto sporta.",
		whoWeAreText2:
			"Naš tim okuplja raznolike talente iz oblasti mašinstva, elektroinženjeringa, aerodinamike i analize podataka. Verujemo u učenje kroz praktično iskustvo, takmičenje na međunarodnim nadmetanjima i razvoj rešenja koja odgovaraju na realne izazove automobilske industrije.",
		whoWeAreText3:
			"Od koncepta do staze, svaki projekat je prilika za inovaciju, saradnju i izvrsnost. Mi ne gradimo samo automobile – mi gradimo budućnost trkanja.",

		// Team Page
		ourTeam: "NAŠ TIM",
		teamHeroSubtitle:
			"Upoznajte inovatore koji stoje iza Black Hornets Racing tima.",
		teamLeadership: "Rukovodstvo tima",
		teamLeader: "Vođa Tima",
		projectLeader: "Vođa Projekta",
		subLeader: "Pomoćni Vođa",
		businessTeam: "Poslovni Tim",
		marketing: "Marketing",
		sponsorships: "Sponzorstva",
		management: "Menadžment",
		mechanicalEngineering: "Mašinstvo",
		chassisAero: "Šasije i aerodinamika",
		suspensionSteering: "Oslanjanje i upravljanje",
		transmissionBraking: "Transmisija i kočenje",
		electricalEngineering: "Elektrotehnika",
		highVoltage: "Visoki napon",
		lowVoltage: "Niski napon",
		backToTeams: "Nazad na timove",
		email: "Email",
		studyField: "Oblast studiranja",
		academicYear: "Akademska godina",
		motivation: "Motivacija",
		skills: "Veštine",
		teamMember: "Član tima",
		noMembersInDepartment: "Još nema članova u ovom odeljenju",
		department: "Odeljenje",
		seeTeamMembers: "Vidi Članove Tima",
		allMembers: "Svi članovi",
		noMembersFound: "Nema pronađenih članova",

		// Position translations (keys stored in DB)
		pos_engineer: "Inženjer",
		pos_designer: "Dizajner",
		pos_cad_engineer: "CAD Inženjer",
		pos_suspension_engineer: "Inženjer oslanjanja",
		pos_aerodynamics_engineer: "Inženjer aerodinamike",
		pos_thermal_engineer: "Termalni inženjer",
		pos_chassis_engineer: "Inženjer šasije",
		pos_electronics_engineer: "Inženjer elektronike",
		pos_firmware_developer: "Programer firmvera",
		pos_software_developer: "Softverski programer",
		pos_battery_specialist: "Specijalista za baterije",
		pos_pcb_designer: "PCB Dizajner",
		pos_content_creator: "Kreator sadržaja",
		pos_social_media_manager: "Menadžer društvenih mreža",
		pos_marketing_manager: "Menadžer marketinga",
		pos_sponsorship_manager: "Menadžer sponzorstava",
		pos_event_coordinator: "Koordinator događaja",
		pos_graphic_designer: "Grafički dizajner",
		pos_photographer: "Fotograf",
		pos_budget_analyst: "Finansijski analitičar",
		pos_project_coordinator: "Koordinator projekta",

		// About Page
		aboutBlackHornets: "O Crnim Stršljenima",
		drivingInnovation: "Pokrećemo inovacije u studentskom trkanju.",
		speed: "Brzina",
		innovation: "Inovacija",
		excellence: "Izvrsnost",
		ourStory: "Naša Priča",
		storyContent:
			"Black Hornets Racing je osnovan od strane grupe strastvenih studenata inženjerstva. Ono što je počelo kao mali projekat, danas je postalo jedan od najdinamičnijih timova Formula Student u regionu.",
		teamMembersCount: "50+",
		teamMembersLabel: "Članovi Tima",
		departmentsCount: "5",
		departmentsLabel: "Odeljenja",
		awardsCount: "10+",
		awardsLabel: "Nagrade",
		ourMission: "Naša Misija",
		missionContent:
			"Razvijati inovativna rešenja za trkanje, pružajući studentima strastvenim prema auto-moto sportu praktično inženjersko iskustvo.",
		ourVision: "Naša Vizija",
		visionContent:
			"Postati vodeći Formula Student tim, poznat po tehničkim inovacijama i profesionalnom razvoju budućih inženjera.",
		ourDepartments: "Naša Odeljenja",
		marketingTitle: "Marketing",
		marketingDesc:
			"Promocija tima, izrada sadržaja i vođenje društvenih mreža.",
		sponsorshipsTitle: "Sponzorstva",
		sponsorshipsDesc:
			"Komunikacija sa partnerima, pregovori i održavanje odnosa sa sponzorima.",
		managementTitle: "Menadžment",
		managementDesc:
			"Organizacija tima, koordinacija projekata i upravljanje resursima.",
		chassisAeroTitle: "Šasije i aerodinamika",
		chassisAeroDesc:
			"Dizajn šasije, strukturalna analiza i aerodinamička optimizacija.",
		suspensionSteeringTitle: "Oslanjanje i upravljanje",
		suspensionSteeringDesc:
			"Sistemi oslanjanja, geometrija upravljanja i dinamika vozila.",
		transmissionBrakingTitle: "Transmisija i kočenje",
		transmissionBrakingDesc:
			"Komponente pogonskog sklopa, kočioni sistemi i prenos snage.",
		highVoltageTitle: "Visoki napon",
		highVoltageDesc:
			"Baterijski sistemi, visokonaponska distribucija i upravljanje energijom.",
		lowVoltageTitle: "Niski napon",
		lowVoltageDesc:
			"Kontrolna elektronika, senzori, CAN komunikacija i niskonaponski sistemi.",

		// Projects Page
		ourProjects: "Naši Projekti",
		projectsSubtitle:
			"Otkrijte naša inovativna rešenja za trkanje i inženjerske uspehe.",
		futureProjects: "Budući Projekti",
		loadingProjects: "Učitavam projekte...",
		projectsComingSoon: "Projekti uskoro",
		workingOnProjects: "Naš tim vredno radi na neverovatnim projektima.",
		stayTuned: "Pratite nas za najnovije informacije!",
		errorLoadingProjects: "Greška pri učitavanju projekata",
		unableToLoad:
			"Trenutno nije moguće učitati projekte. Pokušajte ponovo kasnije.",
		progress: "Napredak",
		dueDate: "Rok",
		duration: "Trajanje",
		daysRemaining: "dana preostalo",
		daysOverdue: "dana zakašnjenja",
		active: "Aktivan",
		completed: "Završen",
		pending: "Na čekanju",

		// Gallery Page
		ourGallery: "Naša Galerija",
		gallerySubtitle: "Beležimo Naše Trkačko Putovanje",
		raceCarsTitle: "Trkački Automobili",
		raceCarsDesc:
			"Black Hornets Racing predstavlja naše najsavremenije Formula Student trkačke automobile. Svako vozilo predstavlja bezbroj sati inovacija, preciznog inženjeringa i aerodinamičke izvrsnosti.",
		teamSectionTitle: "Naš Tim",
		teamSectionDesc:
			"Upoznajte strastvene umove iza našeg uspeha. Raznovrstan tim inženjera, dizajnera i inovatora koji zajedno rade na postizanju izvrsnosti.",
		eventsTitle: "Događaji i Takmičenja",
		eventsDesc:
			"Svedočite našem takmičarskom duhu u akciji. Od Formula Student takmičenja do inženjerskih predstavljanja, svaki događaj priča priču o odlučnosti.",
		workshopTitle: "Radionica",
		workshopDesc:
			"Zakoračite u naše inženjersko utočište. Gde se ideje pretvaraju u stvarnost, i inovacije se susreću sa zanatstvom u našem najsavremenijem objektu.",
		noImagesAvailable: "Nema dostupnih slika",
		errorLoadingImages: "Greška pri učitavanju slika",
		galleryCategory: "Kategorija",
		galleryDate: "Dodato",
		categoryRaceCars: "Trkački automobili",
		categoryTeam: "Tim",
		categoryEvents: "Događaji i takmičenja",
		categoryWorkshop: "Radionica",

		// Sponsors Page
		ourSponsors: "Naši Sponzori",
		partnersInnovation: "Partneri u inovacijama i izvrsnosti",
		sponsorshipTiers: "Sponzorski paketi",
		institutionsTier: "Institucije",
		institucijaTier: "Institucija",
		platinumTier: "F1 - Platinum",
		goldTier: "F2 - Gold",
		silverTier: "F3 - Silver",
		bronzeTier: "F4 - Bronze",
		friendsTier: "Prijatelji projekta",
		currentSponsorsTitle: "Naši Sponzori",
		becomeSponsor: "Postanite Sponzor",
		joinJourney:
			"Ako želite da podelite našu viziju i investirate u potencijal mladih ambicioznih ljudi, kao i u projekat dizajniran da unapredi kompetencije, veštine i sposobnosti van formalnog obrazovnog okruženja, u našoj partnerskoj brošuri možete saznati kako da postanete sponzor.",
		partnerNewsletter: "Partnerski Bilten",
		partnerBrochure: "Partnerska Brošura",
		brochureTitle: "Partnerska Brošura",
		brochureSubtitle: "Istražite naše partnerske mogućnosti",
		downloadBrochure: "Preuzmi brošuru",
		previousPage: "Prethodno",
		nextPage: "Sledeće",
		loadingSponsors: "Učitavam sponzore...",
		comingSoon: "Uskoro",
		sponsorsComingSoon:
			"U procesu smo potvrđivanja partnerstva sa sponzorima. Pratite nas za najnovije vesti!",
		errorLoadingSponsors: "Greška pri učitavanju sponzora",
		unableToLoadSponsors:
			"Trenutno nije moguće učitati sponzore. Pokušajte ponovo kasnije.",
		visitWebsite: "Poseti sajt",

		// Contact Page
		contactHeroSubtitle: "Imate pitanja? Rado ćemo vam odgovoriti.",
		visitUs: "Posetite nas",
		locationAddress: "Univerzitet u Novom Sadu, Srbija",
		writeUs: "Pišite nam",
		followUs: "Pratite nas",
		sendMessage: "Pošaljite nam poruku",
		fullName: "Ime i prezime",
		emailAddress: "Email adresa",
		subject: "Naslov",
		yourMessage: "Vaša poruka",
		sendMessageButton: "Pošalji poruku",
		ourLocation: "Naša lokacija",
		locationDesc:
			"Nalazimo se u zgradi Fakulteta tehničkih nauka Univerziteta u Novom Sadu",
		faqHeading: "Često postavljana pitanja",
		faq1Question: "Kako mogu da se pridružim timu?",
		faq1Answer:
			"Posetite stranicu Prijava i popunite formular. Prijave redovno pregledamo i kontaktiraćemo kandidate koji ispunjavaju uslove.",
		faq2Question: "Da li nudite mogućnosti za sponzorstvo?",
		faq2Answer:
			"Da, nudimo različite pakete sponzorstava. Za više informacija kontaktirajte naš tim za sponzorstva.",
		faq3Question: "Šta je Formula Student?",
		faq3Answer:
			"Formula Student je međunarodno inženjersko takmičenje na kome studentski timovi projektuju, grade i voze mali trkački automobil. Timovi se ocenjuju po performansama vozila, inženjerskom dizajnu, troškovima i poslovnoj prezentaciji.",
		faq4Question: "Kojim odeljenjima mogu da se pridružim?",
		faq4Answer:
			"Imamo mašinsko, električno i poslovno odeljenje. Mašinsko pokriva šasiju, oslanjanje i pogon. Električno pokriva elektroniku i softver. Poslovno pokriva marketing, sponzorstva i menadžment.",
		faq5Question: "Kada i gde se takmičite?",
		faq5Answer:
			"Takmičimo se na Formula Student takmičenjima širom Evrope, koja se obično održavaju između juna i septembra. Naša baza je Fakultet tehničkih nauka Univerziteta u Novom Sadu.",
		faq6Question: "Mogu li da posetim vašu radionicu?",
		faq6Answer:
			"Da! Dobrodošli su poseti studenata koji žele da se pridruže ili saznaju više o našem radu. Kontaktirajte nas putem formulara ili društvenih mreža da dogovorite posetu.",

		// Apply Page
		joinOurTeam: "Pridružite se našem timu",
		bePart: "Budite deo nečega neverovatnog",
		requirements: "Zahtevi",
		studentStatus: "Status studenta",
		studentStatusDesc: "Aktivan student na Univerzitetu u Novom Sadu",
		passion: "Strast",
		passionDesc: "Entuzijazam za motorsport i inženjering",
		teamSpirit: "Timski duh",
		teamSpiritDesc: "Sposobnost rada u kolaborativnom okruženju",
		availableDepartments: "Dostupna odeljenja",
		positionsHeading: "Dostupna odeljenja",
		applicationForm: "Formular za prijavu",
		applicationFormSubtitle:
			"Popunite obrazac ispod da biste se prijavili za poziciju u našem timu",
		desiredPosition: "Željena pozicija",
		personalInfo: "Lični podaci",
		firstName: "Ime",
		lastName: "Prezime",
		phoneNumber: "Broj telefona",
		academicInfo: "Akademske informacije",
		studentId: "Broj indeksa",
		faculty: "Fakultet",
		major: "Smer",
		selectMajor: "Izaberite smer",
		computerScience: "Računarstvo",
		businessAdministration: "Poslovna administracija",
		other: "Ostalo",
		selectYear: "Izaberite godinu",
		firstYear: "Prva godina",
		secondYear: "Druga godina",
		thirdYear: "Treća godina",
		fourthYear: "Četvrta godina",
		gpa: "Prosečna ocena",
		teamPreferences: "Preferencije tima",
		desiredTeam: "Željeni tim",
		selectTeam: "Izaberite tim",
		businessOperations: "Poslovne operacije",
		selectDepartment: "Izaberite odeljenje",
		position: "Pozicija",
		yourDesiredPosition: "Vaša željena pozicija",
		relevantExperience: "Relevantno iskustvo",
		whyJoin: "Zašto želite da se pridružite našem timu?",
		additionalDocuments: "Dodatna dokumenta",
		resumeCV: "Biografija (samo PDF)",
		submitApplication: "Pošalji prijavu",
	},
};

window.changeLanguage = (lang) => {
	currentLanguage = lang;
	localStorage.setItem("language", lang);
	document.querySelectorAll(".lang-btn").forEach((btn) => {
		btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
	});
	window.updateLanguageContent?.();
	window.dispatchEvent(
		new CustomEvent("languageChanged", { detail: { language: lang } }),
	);
};

window.getTranslations = () => translations[currentLanguage];

window.getCurrentLanguage = () => currentLanguage;
