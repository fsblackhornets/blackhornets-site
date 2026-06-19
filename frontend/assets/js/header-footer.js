document.addEventListener('DOMContentLoaded', function() {
    // Reading Progress Bar (global)
    if (!document.querySelector('.reading-progress')) {
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        document.body.appendChild(progressBar);
        window.addEventListener('scroll', function() {
            const fullHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            if (fullHeight > 0) {
                progressBar.style.width = (window.scrollY / fullHeight) * 100 + '%';
            }
        });
    }

    // Global Animated Background (racing lines + grid + particles)
    if (!document.querySelector('.global-racing-lines')) {
        const racingLines = document.createElement('div');
        racingLines.className = 'global-racing-lines';
        document.body.prepend(racingLines);
    }
    if (!document.querySelector('.global-grid')) {
        const grid = document.createElement('div');
        grid.className = 'global-grid';
        document.body.prepend(grid);
    }
    if (!document.getElementById('global-particles-js')) {
        const particlesDiv = document.createElement('div');
        particlesDiv.id = 'global-particles-js';
        document.body.prepend(particlesDiv);

        // Load particles.js dynamically
        if (typeof particlesJS === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
            script.onload = function() { initGlobalParticles(); };
            document.head.appendChild(script);
        } else {
            initGlobalParticles();
        }
    }

    function initGlobalParticles() {
        const isMobile = window.innerWidth <= 768;
        particlesJS('global-particles-js', {
            particles: {
                number: { value: isMobile ? 30 : 60, density: { enable: true, value_area: 1200 } },
                color: { value: '#FFD700' },
                shape: { type: 'circle' },
                opacity: { value: 0.25, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.05, sync: false } },
                size: { value: 2.5, random: true, anim: { enable: true, speed: 1.5, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: '#FFD700', opacity: 0.12, width: 1 },
                move: { enable: true, speed: isMobile ? 0.8 : 1.2, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
            },
            interactivity: {
                detect_on: 'canvas',
                events: { onhover: { enable: !isMobile }, onclick: { enable: false }, resize: true }
            },
            retina_detect: true
        });
    }

    // تعريف متغير اللغة الحالية
    let currentLanguage = localStorage.getItem('language') || 'en';

    const CONFIG = {
        selectors: {
            header: 'header',
            footer: 'footer',
            mobileToggle: '#mobile-toggle',
            navLinks: '#nav-links',
            navLink: '.nav-link',
            applyBtn: '.apply-btn'
        },
        classes: {
            scrolled: 'scrolled',
            active: 'active'
        }
    };

    // تحديد المسار الصحيح للصور
    const getImagePath = () => {
        return '/frontend/assets/images/';
    };
    
    // تحديد المسار الصحيح للصفحات
    const getPagePath = (isPhpFile = false) => {
        const currentPath = window.location.pathname;
        const isInPagesDirectory = currentPath.includes('/pages/');
        const isInPhpDirectory = currentPath.endsWith('.php');
        
        // Get the base path of the project (always /frontend/)
        const basePath = '/frontend/';
        
        if (isPhpFile) {
            return isInPhpDirectory ? basePath : (isInPagesDirectory ? basePath : basePath);
        }
        return isInPagesDirectory ? basePath : basePath;
    };


    // دالة تغيير اللغة
    window.changeLanguage = function(lang) {
        currentLanguage = lang;
        localStorage.setItem('language', lang);
        
        // تحديث أزرار اللغة
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
        });

        // Update page content based on language
        updateLanguageContent(lang);
        
        // Dispatch event for other scripts to listen to language changes
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { language: lang } }));
    };
    
    // Translation object
    const translations = {
        en: {
            // Navigation
            home: 'Home',
            team: 'Team',
            about: 'About',
            projects: 'Projects',
            gallery: 'Gallery',
            sponsors: 'Sponsors',
            contact: 'Contact',
            login: 'Login',
            applyNow: 'Apply',
            
            // Footer
            contactUs: 'Contact Us',
            followUs: 'Follow Us',
            quickLinks: 'Quick Links',
            allRightsReserved: 'All rights reserved',
            
            // Homepage
            heroTitle: 'Black Hornets',
            heroSubtitle: 'Formula Student Novi Sad',
            discoverMore: 'Discover More',
            joinUs: 'Join Us',
            scrollDown: 'Scroll Down',
            latestNews: 'Latest News',
            moreNews: 'More News',
            featured: 'Featured',
            noNewsFound: 'No news found',
            whoAreBlackHornets: 'Who Are Black Hornets',
            whoWeAreText1: 'Black Hornets Racing is a passionate team of engineering students dedicated to pushing the boundaries of automotive innovation. We combine cutting-edge technology with sustainable practices to create high-performance racing vehicles that represent the future of motorsports.',
            whoWeAreText2: 'Our team brings together diverse talents from mechanical engineering, electrical engineering, aerodynamics, and data analysis. We believe in learning through hands-on experience, competing in international competitions, and developing solutions that address real-world challenges in the automotive industry.',
            whoWeAreText3: 'From concept to track, every project is an opportunity for innovation, collaboration, and excellence. We don\'t just build cars – we build the future of racing.',
            
            // Team Page
            ourTeam: 'OUR TEAM',
            teamHeroSubtitle: 'Meet the innovators behind Black Hornets Racing team.',
            teamLeadership: 'Team Leadership',
            teamLeader: 'Team Leader',
            projectLeader: 'Project Leader',
            subLeader: 'Sub Leader',
            businessTeam: 'Business Team',
            marketing: 'Marketing',
            sponsorships: 'Sponsorships',
            management: 'Management',
            mechanicalEngineering: 'Mechanical Engineering',
            chassisAero: 'Chassis and Aerodynamics',
            suspensionSteering: 'Suspension and Steering',
            transmissionBraking: 'Transmission and Braking',
            electricalEngineering: 'Electrical Engineering',
            highVoltage: 'High Voltage',
            lowVoltage: 'Low Voltage',
            backToTeams: 'Back to Teams',
            email: 'Email',
            studyField: 'Study Field',
            academicYear: 'Academic Year',
            motivation: 'Motivation',
            skills: 'Skills',
            teamMember: 'Team Member',
            noMembersInDepartment: 'No members in this department yet',
            department: 'Department',
            seeTeamMembers: 'See Team Members',
            allMembers: 'All Members',
            noMembersFound: 'No members found',

            // Position translations (keys stored in DB)
            pos_engineer: 'Engineer',
            pos_designer: 'Designer',
            pos_cad_engineer: 'CAD Engineer',
            pos_suspension_engineer: 'Suspension Engineer',
            pos_aerodynamics_engineer: 'Aerodynamics Engineer',
            pos_thermal_engineer: 'Thermal Engineer',
            pos_chassis_engineer: 'Chassis Engineer',
            pos_electronics_engineer: 'Electronics Engineer',
            pos_firmware_developer: 'Firmware Developer',
            pos_software_developer: 'Software Developer',
            pos_battery_specialist: 'Battery Specialist',
            pos_pcb_designer: 'PCB Designer',
            pos_content_creator: 'Content Creator',
            pos_social_media_manager: 'Social Media Manager',
            pos_marketing_manager: 'Marketing Manager',
            pos_sponsorship_manager: 'Sponsorship Manager',
            pos_event_coordinator: 'Event Coordinator',
            pos_graphic_designer: 'Graphic Designer',
            pos_photographer: 'Photographer',
            pos_budget_analyst: 'Budget Analyst',
            pos_project_coordinator: 'Project Coordinator',

            // About Page
            aboutBlackHornets: 'About Black Hornets',
            drivingInnovation: 'Driving innovation in student racing.',
            speed: 'Speed',
            innovation: 'Innovation',
            excellence: 'Excellence',
            ourStory: 'Our Story',
            storyContent: 'Black Hornets Racing was founded by a group of passionate engineering students. What started as a small project has become one of the most dynamic Formula Student teams in the region.',
            teamMembersCount: '50+',
            teamMembersLabel: 'Team Members',
            departmentsCount: '5',
            departmentsLabel: 'Departments',
            awardsCount: '10+',
            awardsLabel: 'Awards',
            ourMission: 'Our Mission',
            missionContent: 'To develop innovative racing solutions, providing students passionate about motorsports with practical engineering experience.',
            ourVision: 'Our Vision',
            visionContent: 'To become a leading Formula Student team, known for technical innovations and professional development of future engineers.',
            ourDepartments: 'Our Departments',
            // Department cards
            marketingTitle: 'Marketing',
            marketingDesc: 'Team promotion, content creation, and social media management.',
            sponsorshipsTitle: 'Sponsorships',
            sponsorshipsDesc: 'Partner communication, negotiations, and sponsor relations.',
            managementTitle: 'Management',
            managementDesc: 'Team organization, project coordination, and resource management.',
            chassisAeroTitle: 'Chassis and Aerodynamics',
            chassisAeroDesc: 'Chassis design, structural analysis, and aerodynamic optimization.',
            suspensionSteeringTitle: 'Suspension and Steering',
            suspensionSteeringDesc: 'Suspension systems, steering geometry, and vehicle dynamics.',
            transmissionBrakingTitle: 'Transmission and Braking',
            transmissionBrakingDesc: 'Drivetrain components, braking systems, and power delivery.',
            highVoltageTitle: 'High Voltage',
            highVoltageDesc: 'Battery systems, high voltage distribution, and energy management.',
            lowVoltageTitle: 'Low Voltage',
            lowVoltageDesc: 'Control electronics, sensors, CAN communication, and low voltage systems.',
            
            // Projects Page
            ourProjects: 'Our Projects',
            projectsSubtitle: 'Discover our innovative racing solutions and engineering achievements.',
            futureProjects: 'Future Projects',
            loadingProjects: 'Loading projects...',
            projectsComingSoon: 'Projects Coming Soon',
            workingOnProjects: 'Our team is working hard on amazing projects.',
            stayTuned: 'Follow us for the latest updates!',
            errorLoadingProjects: 'Error Loading Projects',
            unableToLoad: 'Unable to load projects at this time. Please try again later.',
            progress: 'Progress',
            dueDate: 'Due',
            duration: 'Duration',
            daysRemaining: 'days remaining',
            daysOverdue: 'days overdue',
            active: 'Active',
            completed: 'Completed',
            pending: 'Pending',
            
            // Gallery Page
            ourGallery: 'Our Gallery',
            gallerySubtitle: 'Capturing Our Racing Journey',
            raceCarsTitle: 'Race Cars',
            raceCarsDesc: 'Black Hornets Racing showcases our cutting-edge Formula Student race cars. Each vehicle represents countless hours of innovation, precision engineering, and aerodynamic excellence.',
            teamSectionTitle: 'Our Team',
            teamSectionDesc: 'Meet the passionate minds behind our success. A diverse team of engineers, designers, and innovators working together to achieve excellence.',
            eventsTitle: 'Events and Competitions',
            eventsDesc: 'Witness our competitive spirit in action. From Formula Student competitions to engineering showcases, every event tells a story of determination.',
            workshopTitle: 'Workshop',
            workshopDesc: 'Step into our engineering sanctuary. Where ideas transform into reality, and innovation meets craftsmanship in our state-of-the-art facility.',
            noImagesAvailable: 'No images available',
            errorLoadingImages: 'Error loading images',
            galleryCategory: 'Category',
            galleryDate: 'Added',
            categoryRaceCars: 'Race Cars',
            categoryTeam: 'Team',
            categoryEvents: 'Events & Competitions',
            categoryWorkshop: 'Workshop',

            // Sponsors Page
            ourSponsors: 'Our Sponsors',
            partnersInnovation: 'Partners in Innovation and Excellence',
            sponsorshipTiers: 'Sponsorship Packages',
            institutionsTier: 'Institutions',
            institucijaTier: 'Institucija',
            platinumTier: 'F1 - Platinum',
            goldTier: 'F2 - Gold',
            silverTier: 'F3 - Silver',
            bronzeTier: 'F4 - Bronze',
            friendsTier: 'Friends of the Project',
            currentSponsorsTitle: 'Our Sponsors',
            becomeSponsor: 'Become a Sponsor',
            joinJourney: 'If you want to share our vision and invest in the potential of young ambitious people as well as a project designed to enhance competencies, skills and abilities outside the formal education environment, in our partner brochure, you can find out how to become a sponsor.',
            partnerNewsletter: 'Partner Newsletter',
            partnerBrochure: 'Partner Brochure',
            brochureTitle: 'Partner Brochure',
            brochureSubtitle: 'Explore our partnership opportunities',
            downloadBrochure: 'Download Brochure',
            previousPage: 'Previous',
            nextPage: 'Next',
            contactUs: 'Contact Us',
            loadingSponsors: 'Loading sponsors...',
            comingSoon: 'Coming Soon',
            sponsorsComingSoon: 'We are in the process of confirming our sponsor partnerships. Stay tuned for updates!',
            errorLoadingSponsors: 'Error Loading Sponsors',
            unableToLoadSponsors: 'Unable to load sponsors at this time. Please try again later.',
            visitWebsite: 'Visit Website',
            
            // Contact Page
            contactUs: 'Contact Us',
            contactHeroSubtitle: 'Have questions? We\'d love to hear from you.',
            visitUs: 'Visit Us',
            locationAddress: 'University of Novi Sad, Serbia',
            writeUs: 'Write to Us',
            followUs: 'Follow Us',
            sendMessage: 'Send us a message',
            fullName: 'Full Name',
            emailAddress: 'Email Address',
            subject: 'Subject',
            yourMessage: 'Your Message',
            sendMessageButton: 'Send Message',
            ourLocation: 'Our Location',
            locationDesc: 'We are located in the Faculty of Technical Sciences building at the University of Novi Sad',
            faqHeading: 'Frequently Asked Questions',
            faq1Question: 'How can I join the team?',
            faq1Answer: 'Visit the Apply page and fill out the form. We regularly review applications and will contact qualified candidates.',
            faq2Question: 'Do you offer sponsorship opportunities?',
            faq2Answer: 'Yes, we offer various sponsorship packages. For more information, contact our sponsorship team.',
            
            // Apply Page
            joinOurTeam: 'Join Our Team',
            bePart: 'Be part of something extraordinary',
            requirements: 'Requirements',
            studentStatus: 'Student Status',
            studentStatusDesc: 'Active student at University of Novi Sad',
            passion: 'Passion',
            passionDesc: 'Enthusiasm for motorsports and engineering',
            teamSpirit: 'Team Spirit',
            teamSpiritDesc: 'Ability to work in a collaborative environment',
            availableDepartments: 'Available Departments',
            positionsHeading: 'Available Departments',
            applicationForm: 'Application Form',
            applicationFormSubtitle: 'Fill out the form below to apply for a position in our team',
            desiredPosition: 'Desired Position',
            personalInfo: 'Personal Information',
            firstName: 'First Name',
            lastName: 'Last Name',
            phoneNumber: 'Phone Number',
            academicInfo: 'Academic Information',
            studentId: 'Student ID',
            faculty: 'Faculty',
            major: 'Major',
            selectMajor: 'Select Major',
            mechanicalEngineering: 'Mechanical Engineering',
            electricalEngineering: 'Electrical Engineering',
            computerScience: 'Computer Science',
            businessAdministration: 'Business Administration',
            other: 'Other',
            academicYear: 'Academic Year',
            selectYear: 'Select Year',
            firstYear: 'First Year',
            secondYear: 'Second Year',
            thirdYear: 'Third Year',
            fourthYear: 'Fourth Year',
            gpa: 'GPA',
            teamPreferences: 'Team Preferences',
            desiredTeam: 'Desired Team',
            selectTeam: 'Select Team',
            businessOperations: 'Business Operations',
            department: 'Department',
            selectDepartment: 'Select Department',
            position: 'Position',
            yourDesiredPosition: 'Your desired position',
            relevantExperience: 'Relevant Experience',
            whyJoin: 'Why do you want to join our team?',
            additionalDocuments: 'Additional Documents',
            resumeCV: 'Resume/CV (PDF only)',
            submitApplication: 'Submit Application',
            chassisAero: 'Chassis and Aerodynamics',
            suspensionSteering: 'Suspension and Steering',
            transmissionBraking: 'Transmission and Braking',
            highVoltage: 'High Voltage',
            lowVoltage: 'Low Voltage'
        },
        sr: {
            // Navigation
            home: 'Početna',
            team: 'Tim',
            about: 'O nama',
            projects: 'Projekti',
            gallery: 'Galerija',
            sponsors: 'Sponzori',
            contact: 'Kontakt',
            login: 'Prijava',
            applyNow: 'Prijavi',
            
            // Footer
            contactUs: 'Kontaktirajte nas',
            followUs: 'Zapratite nas',
            quickLinks: 'Brze veze',
            allRightsReserved: 'Sva prava zadržana',
            
            // Homepage
            heroTitle: 'Crni Stršljeni',
            heroSubtitle: 'Formula Student Novi Sad',
            discoverMore: 'Saznaj više',
            joinUs: 'Pridruži nam se',
            scrollDown: 'Scroll Down',
            latestNews: 'Najnovije vesti',
            moreNews: 'Još vesti',
            featured: 'Istaknuto',
            noNewsFound: 'Nema vesti',
            whoAreBlackHornets: 'Ko su Crni Stršljeni',
            whoWeAreText1: 'Black Hornets Racing je strastven tim studenata inženjerstva posvećen pomeranju granica automobilske inovacije. Kombinujemo najsavremeniju tehnologiju sa održivim praksama kako bismo stvorili trkačka vozila visokih performansi koja predstavljaju budućnost auto-moto sporta.',
            whoWeAreText2: 'Naš tim okuplja raznolike talente iz oblasti mašinstva, elektroinženjeringa, aerodinamike i analize podataka. Verujemo u učenje kroz praktično iskustvo, takmičenje na međunarodnim nadmetanjima i razvoj rešenja koja odgovaraju na realne izazove automobilske industrije.',
            whoWeAreText3: 'Od koncepta do staze, svaki projekat je prilika za inovaciju, saradnju i izvrsnost. Mi ne gradimo samo automobile – mi gradimo budućnost trkanja.',
            
            // Team Page
            ourTeam: 'NAŠ TIM',
            teamHeroSubtitle: 'Upoznajte inovatore koji stoje iza Black Hornets Racing tima.',
            teamLeadership: 'Rukovodstvo tima',
            teamLeader: 'Vođa Tima',
            projectLeader: 'Vođa Projekta',
            subLeader: 'Pomoćni Vođa',
            businessTeam: 'Poslovni Tim',
            marketing: 'Marketing',
            sponsorships: 'Sponzorstva',
            management: 'Menadžment',
            mechanicalEngineering: 'Mašinstvo',
            chassisAero: 'Šasije i aerodinamika',
            suspensionSteering: 'Oslanjanje i upravljanje',
            transmissionBraking: 'Transmisija i kočenje',
            electricalEngineering: 'Elektrotehnika',
            highVoltage: 'Visoki napon',
            lowVoltage: 'Niski napon',
            backToTeams: 'Nazad na timove',
            email: 'Email',
            studyField: 'Oblast studiranja',
            academicYear: 'Akademska godina',
            motivation: 'Motivacija',
            skills: 'Veštine',
            teamMember: 'Član tima',
            noMembersInDepartment: 'Još nema članova u ovom odeljenju',
            department: 'Odeljenje',
            seeTeamMembers: 'Vidi Članove Tima',
            allMembers: 'Svi članovi',
            noMembersFound: 'Nema pronađenih članova',

            // Position translations (keys stored in DB)
            pos_engineer: 'Inženjer',
            pos_designer: 'Dizajner',
            pos_cad_engineer: 'CAD Inženjer',
            pos_suspension_engineer: 'Inženjer oslanjanja',
            pos_aerodynamics_engineer: 'Inženjer aerodinamike',
            pos_thermal_engineer: 'Termalni inženjer',
            pos_chassis_engineer: 'Inženjer šasije',
            pos_electronics_engineer: 'Inženjer elektronike',
            pos_firmware_developer: 'Programer firmvera',
            pos_software_developer: 'Softverski programer',
            pos_battery_specialist: 'Specijalista za baterije',
            pos_pcb_designer: 'PCB Dizajner',
            pos_content_creator: 'Kreator sadržaja',
            pos_social_media_manager: 'Menadžer društvenih mreža',
            pos_marketing_manager: 'Menadžer marketinga',
            pos_sponsorship_manager: 'Menadžer sponzorstava',
            pos_event_coordinator: 'Koordinator događaja',
            pos_graphic_designer: 'Grafički dizajner',
            pos_photographer: 'Fotograf',
            pos_budget_analyst: 'Finansijski analitičar',
            pos_project_coordinator: 'Koordinator projekta',

            // About Page
            aboutBlackHornets: 'O Black Hornets',
            drivingInnovation: 'Pokrećemo inovacije u studentskom trkanju.',
            speed: 'Brzina',
            innovation: 'Inovacija',
            excellence: 'Izvrsnost',
            ourStory: 'Naša Priča',
            storyContent: 'Black Hornets Racing je osnovan od strane grupe strastvenih studenata inženjerstva. Ono što je počelo kao mali projekat, danas je postalo jedan od najdinamičnijih timova Formula Student u regionu.',
            teamMembersCount: '50+',
            teamMembersLabel: 'Članovi Tima',
            departmentsCount: '5',
            departmentsLabel: 'Odeljenja',
            awardsCount: '10+',
            awardsLabel: 'Nagrade',
            ourMission: 'Naša Misija',
            missionContent: 'Razvijati inovativna rešenja za trkanje, pružajući studentima strastvenim prema auto-moto sportu praktično inženjersko iskustvo.',
            ourVision: 'Naša Vizija',
            visionContent: 'Postati vodeći Formula Student tim, poznat po tehničkim inovacijama i profesionalnom razvoju budućih inženjera.',
            ourDepartments: 'Naša Odeljenja',
            // Department cards
            marketingTitle: 'Marketing',
            marketingDesc: 'Promocija tima, izrada sadržaja i vođenje društvenih mreža.',
            sponsorshipsTitle: 'Sponzorstva',
            sponsorshipsDesc: 'Komunikacija sa partnerima, pregovori i održavanje odnosa sa sponzorima.',
            managementTitle: 'Menadžment',
            managementDesc: 'Organizacija tima, koordinacija projekata i upravljanje resursima.',
            chassisAeroTitle: 'Šasije i aerodinamika',
            chassisAeroDesc: 'Dizajn šasije, strukturalna analiza i aerodinamička optimizacija.',
            suspensionSteeringTitle: 'Oslanjanje i upravljanje',
            suspensionSteeringDesc: 'Sistemi oslanjanja, geometrija upravljanja i dinamika vozila.',
            transmissionBrakingTitle: 'Transmisija i kočenje',
            transmissionBrakingDesc: 'Komponente pogonskog sklopa, kočioni sistemi i prenos snage.',
            highVoltageTitle: 'Visoki napon',
            highVoltageDesc: 'Baterijski sistemi, visokonaponska distribucija i upravljanje energijom.',
            lowVoltageTitle: 'Niski napon',
            lowVoltageDesc: 'Kontrolna elektronika, senzori, CAN komunikacija i niskonaponski sistemi.',
            
            // Projects Page
            ourProjects: 'Naši Projekti',
            projectsSubtitle: 'Otkrijte naša inovativna rešenja za trkanje i inženjerske uspehe.',
            futureProjects: 'Budući Projekti',
            loadingProjects: 'Učitavam projekte...',
            projectsComingSoon: 'Projekti uskoro',
            workingOnProjects: 'Naš tim vredno radi na neverovatnim projektima.',
            stayTuned: 'Pratite nas za najnovije informacije!',
            errorLoadingProjects: 'Greška pri učitavanju projekata',
            unableToLoad: 'Trenutno nije moguće učitati projekte. Pokušajte ponovo kasnije.',
            progress: 'Napredak',
            dueDate: 'Rok',
            duration: 'Trajanje',
            daysRemaining: 'dana preostalo',
            daysOverdue: 'dana zakašnjenja',
            active: 'Aktivan',
            completed: 'Završen',
            pending: 'Na čekanju',
            
            // Gallery Page
            ourGallery: 'Naša Galerija',
            gallerySubtitle: 'Beležimo Naše Trkačko Putovanje',
            raceCarsTitle: 'Trkački Automobili',
            raceCarsDesc: 'Black Hornets Racing predstavlja naše najsavremenije Formula Student trkačke automobile. Svako vozilo predstavlja bezbroj sati inovacija, preciznog inženjeringa i aerodinamičke izvrsnosti.',
            teamSectionTitle: 'Naš Tim',
            teamSectionDesc: 'Upoznajte strastvene umove iza našeg uspeha. Raznovrstan tim inženjera, dizajnera i inovatora koji zajedno rade na postizanju izvrsnosti.',
            eventsTitle: 'Događaji i Takmičenja',
            eventsDesc: 'Svedočite našem takmičarskom duhu u akciji. Od Formula Student takmičenja do inženjerskih predstavljanja, svaki događaj priča priču o odlučnosti.',
            workshopTitle: 'Radionica',
            workshopDesc: 'Zakoračite u naše inženjersko utočište. Gde se ideje pretvaraju u stvarnost, i inovacije se susreću sa zanatstvom u našem najsavremenijem objektu.',
            noImagesAvailable: 'Nema dostupnih slika',
            errorLoadingImages: 'Greška pri učitavanju slika',
            galleryCategory: 'Kategorija',
            galleryDate: 'Dodato',
            categoryRaceCars: 'Trkački automobili',
            categoryTeam: 'Tim',
            categoryEvents: 'Događaji i takmičenja',
            categoryWorkshop: 'Radionica',

            // Sponsors Page
            ourSponsors: 'Naši Sponzori',
            partnersInnovation: 'Partneri u inovacijama i izvrsnosti',
            sponsorshipTiers: 'Sponzorski paketi',
            institutionsTier: 'Institucije',
            institucijaTier: 'Institucija',
            platinumTier: 'F1 - Platinum',
            goldTier: 'F2 - Gold',
            silverTier: 'F3 - Silver',
            bronzeTier: 'F4 - Bronze',
            friendsTier: 'Prijatelji projekta',
            currentSponsorsTitle: 'Naši Sponzori',
            becomeSponsor: 'Postanite Sponzor',
            joinJourney: 'Ako želite da podelite našu viziju i investirate u potencijal mladih ambicioznih ljudi, kao i u projekat dizajniran da unapredi kompetencije, veštine i sposobnosti van formalnog obrazovnog okruženja, u našoj partnerskoj brošuri možete saznati kako da postanete sponzor.',
            partnerNewsletter: 'Partnerski Bilten',
            partnerBrochure: 'Partnerska Brošura',
            brochureTitle: 'Partnerska Brošura',
            brochureSubtitle: 'Istražite naše partnerske mogućnosti',
            downloadBrochure: 'Preuzmi brošuru',
            previousPage: 'Prethodno',
            nextPage: 'Sledeće',
            contactUs: 'Kontaktirajte Nas',
            loadingSponsors: 'Učitavam sponzore...',
            comingSoon: 'Uskoro',
            sponsorsComingSoon: 'U procesu smo potvrđivanja partnerstva sa sponzorima. Pratite nas za najnovije vesti!',
            errorLoadingSponsors: 'Greška pri učitavanju sponzora',
            unableToLoadSponsors: 'Trenutno nije moguće učitati sponzore. Pokušajte ponovo kasnije.',
            visitWebsite: 'Poseti sajt',
            
            // Contact Page
            contactUs: 'Kontaktirajte nas',
            contactHeroSubtitle: 'Imate pitanja? Rado ćemo vam odgovoriti.',
            visitUs: 'Posetite nas',
            locationAddress: 'Univerzitet u Novom Sadu, Srbija',
            writeUs: 'Pišite nam',
            followUs: 'Pratite nas',
            sendMessage: 'Pošaljite nam poruku',
            fullName: 'Ime i prezime',
            emailAddress: 'Email adresa',
            subject: 'Naslov',
            yourMessage: 'Vaša poruka',
            sendMessageButton: 'Pošalji poruku',
            ourLocation: 'Naša lokacija',
            locationDesc: 'Nalazimo se u zgradi Fakulteta tehničkih nauka Univerziteta u Novom Sadu',
            faqHeading: 'Često postavljana pitanja',
            faq1Question: 'Kako mogu da se pridružim timu?',
            faq1Answer: 'Posetite stranicu Prijava i popunite formular. Prijave redovno pregledamo i kontaktiraćemo kandidate koji ispunjavaju uslove.',
            faq2Question: 'Da li nudite mogućnosti za sponzorstvo?',
            faq2Answer: 'Da, nudimo različite pakete sponzorstava. Za više informacija kontaktirajte naš tim za sponzorstva.',
            
            // Apply Page
            joinOurTeam: 'Pridružite se našem timu',
            bePart: 'Budite deo nečega neverovatnog',
            requirements: 'Zahtevi',
            studentStatus: 'Status studenta',
            studentStatusDesc: 'Aktivan student na Univerzitetu u Novom Sadu',
            passion: 'Strast',
            passionDesc: 'Entuzijazam za motorsport i inženjering',
            teamSpirit: 'Timski duh',
            teamSpiritDesc: 'Sposobnost rada u kolaborativnom okruženju',
            availableDepartments: 'Dostupna odeljenja',
            positionsHeading: 'Dostupna odeljenja',
            applicationForm: 'Formular za prijavu',
            applicationFormSubtitle: 'Popunite obrazac ispod da biste se prijavili za poziciju u našem timu',
            desiredPosition: 'Željena pozicija',
            personalInfo: 'Lični podaci',
            firstName: 'Ime',
            lastName: 'Prezime',
            phoneNumber: 'Broj telefona',
            academicInfo: 'Akademske informacije',
            studentId: 'Broj indeksa',
            faculty: 'Fakultet',
            major: 'Smer',
            selectMajor: 'Izaberite smer',
            mechanicalEngineering: 'Mašinstvo',
            electricalEngineering: 'Elektrotehnika',
            computerScience: 'Računarstvo',
            businessAdministration: 'Poslovna administracija',
            other: 'Ostalo',
            academicYear: 'Akademska godina',
            selectYear: 'Izaberite godinu',
            firstYear: 'Prva godina',
            secondYear: 'Druga godina',
            thirdYear: 'Treća godina',
            fourthYear: 'Četvrta godina',
            gpa: 'Prosečna ocena',
            teamPreferences: 'Preferencije tima',
            desiredTeam: 'Željeni tim',
            selectTeam: 'Izaberite tim',
            businessOperations: 'Poslovne operacije',
            department: 'Odeljenje',
            selectDepartment: 'Izaberite odeljenje',
            position: 'Pozicija',
            yourDesiredPosition: 'Vaša željena pozicija',
            relevantExperience: 'Relevantno iskustvo',
            whyJoin: 'Zašto želite da se pridružite našem timu?',
            additionalDocuments: 'Dodatna dokumenta',
            resumeCV: 'Biografija (samo PDF)',
            submitApplication: 'Pošalji prijavu',
            chassisAero: 'Šasije i aerodinamika',
            suspensionSteering: 'Oslanjanje i upravljanje',
            transmissionBraking: 'Transmisija i kočenje',
            highVoltage: 'Visoki napon',
            lowVoltage: 'Niski napon'
        }
    };
    
    // Update content based on selected language
    function updateLanguageContent(lang) {
        // Update navigation and footer text by reloading both
        loadHeader();
        loadFooter();
        
        // Update homepage content if on homepage
        updateHomepageContent();
        
        // Update team page content if on team page
        if (typeof window.updateTeamPageContent === 'function') {
            window.updateTeamPageContent();
        }
        
        // Update about page content if on about page
        if (typeof window.updateAboutPageContent === 'function') {
            window.updateAboutPageContent();
        }
        
        // Update projects page content if on projects page
        if (typeof window.updateProjectsPageContent === 'function') {
            window.updateProjectsPageContent();
        }
        
        // Update gallery page content if on gallery page
        if (typeof window.updateGalleryPageContent === 'function') {
            window.updateGalleryPageContent();
        }
        
        // Update sponsors page content if on sponsors page
        if (typeof window.updateSponsorsPageContent === 'function') {
            window.updateSponsorsPageContent();
        }
        
        // Update contact page content if on contact page
        if (typeof window.updateContactPageContent === 'function') {
            window.updateContactPageContent();
        }
        
        // Update apply page content if on apply page
        if (typeof window.updateApplyPageContent === 'function') {
            window.updateApplyPageContent();
        }
        
        // Trigger projects reload if on projects page
        if (typeof window.loadProjects === 'function') {
            window.loadProjects();
        }
        
        // Trigger sponsors reload if on sponsors page
        if (typeof window.loadSponsors === 'function') {
            window.loadSponsors();
        }
    }
    
    // Update homepage specific content
    function updateHomepageContent() {
        const t = translations[currentLanguage];
        
        // Hero section
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        const discoverMore = document.getElementById('discover-more');
        const joinUsBtn = document.getElementById('join-us');
        const scrollDown = document.getElementById('scroll-down');
        
        if (heroTitle) heroTitle.textContent = t.heroTitle;
        if (heroSubtitle) heroSubtitle.textContent = t.heroSubtitle;
        if (discoverMore) discoverMore.textContent = t.discoverMore;
        if (joinUsBtn) joinUsBtn.textContent = t.joinUs;
        if (scrollDown) scrollDown.textContent = t.scrollDown;
        
        // Latest News section
        const latestNewsTitle = document.querySelector('#latest-news .section-header h2');
        if (latestNewsTitle) latestNewsTitle.textContent = t.latestNews;
        
        const moreNewsBtn = document.querySelector('.more-news-btn-container .primary-btn');
        if (moreNewsBtn) moreNewsBtn.textContent = t.moreNews;
        
        // Who We Are section
        const whoWeAreTitle = document.getElementById('who-black-hornets-title');
        if (whoWeAreTitle) whoWeAreTitle.textContent = t.whoAreBlackHornets;
        
        const textContent = document.querySelector('.text-content');
        if (textContent) {
            const paragraphs = textContent.querySelectorAll('p');
            if (paragraphs[0]) paragraphs[0].textContent = t.whoWeAreText1;
            if (paragraphs[1]) paragraphs[1].textContent = t.whoWeAreText2;
            if (paragraphs[2]) paragraphs[2].textContent = t.whoWeAreText3;
        }
    }
    
    // Update team page content
    window.updateTeamPageContent = function() {
        const t = translations[currentLanguage];
        
        // Hero section
        const heroTitle = document.getElementById('team-hero-title');
        const heroSubtitle = document.getElementById('team-hero-subtitle');
        if (heroTitle) heroTitle.textContent = t.ourTeam;
        if (heroSubtitle) heroSubtitle.textContent = t.teamHeroSubtitle;
        
        // Leadership section title
        const leadershipTitle = document.getElementById('team-leadership-title');
        if (leadershipTitle) leadershipTitle.textContent = t.teamLeadership;
        
        // Department boxes using IDs
        const deptBusinessOps = document.getElementById('dept-business-ops');
        const deptMarketing = document.getElementById('dept-marketing');
        const deptSponsorships = document.getElementById('dept-sponsorships');
        const deptManagement = document.getElementById('dept-management');
        const deptMechanical = document.getElementById('dept-mechanical');
        const deptElectrical = document.getElementById('dept-electrical');
        
        if (deptBusinessOps) deptBusinessOps.textContent = t.businessTeam;
        if (deptMarketing) deptMarketing.textContent = t.marketing;
        if (deptSponsorships) deptSponsorships.textContent = t.sponsorships;
        if (deptManagement) deptManagement.textContent = t.management;
        if (deptMechanical) deptMechanical.textContent = t.mechanicalEngineering;

        const deptChassisAero = document.getElementById('dept-chassis-aero');
        const deptSuspensionSteering = document.getElementById('dept-suspension-steering');
        const deptTransmissionBraking = document.getElementById('dept-transmission-braking');
        if (deptChassisAero) {
            deptChassisAero.textContent = t.chassisAero;
            deptChassisAero.setAttribute('data-original', t.chassisAero);
        }
        if (deptSuspensionSteering) {
            deptSuspensionSteering.textContent = t.suspensionSteering;
            deptSuspensionSteering.setAttribute('data-original', t.suspensionSteering);
        }
        if (deptTransmissionBraking) {
            deptTransmissionBraking.textContent = t.transmissionBraking;
            deptTransmissionBraking.setAttribute('data-original', t.transmissionBraking);
        }

        if (deptElectrical) deptElectrical.textContent = t.electricalEngineering;

        const deptHighVoltage = document.getElementById('dept-high-voltage');
        const deptLowVoltage = document.getElementById('dept-low-voltage');
        if (deptHighVoltage) {
            deptHighVoltage.textContent = t.highVoltage;
            deptHighVoltage.setAttribute('data-original', t.highVoltage);
        }
        if (deptLowVoltage) {
            deptLowVoltage.textContent = t.lowVoltage;
            deptLowVoltage.setAttribute('data-original', t.lowVoltage);
        }
        
        // Back button
        const backToTeams = document.getElementById('back-to-teams');
        if (backToTeams) backToTeams.textContent = t.backToTeams;
        
        // See Team Members buttons
        const seeTeamBtn1 = document.getElementById('see-team-btn-1');
        const seeTeamBtn2 = document.getElementById('see-team-btn-2');
        const seeTeamBtn3 = document.getElementById('see-team-btn-3');
        if (seeTeamBtn1) seeTeamBtn1.textContent = t.seeTeamMembers;
        if (seeTeamBtn2) seeTeamBtn2.textContent = t.seeTeamMembers;
        if (seeTeamBtn3) seeTeamBtn3.textContent = t.seeTeamMembers;
    };
    
    // Make translations accessible globally for teams.js
    window.getTranslations = function() {
        return translations[currentLanguage];
    };
    
    window.getCurrentLanguage = function() {
        return currentLanguage;
    };
    
    // Update about page content
    window.updateAboutPageContent = function() {
        const t = translations[currentLanguage];
        
        // Hero section
        const aboutHeading = document.getElementById('about-heading');
        const drivingInnovation = document.getElementById('driving-innovation');
        if (aboutHeading) aboutHeading.textContent = t.aboutBlackHornets;
        if (drivingInnovation) drivingInnovation.textContent = t.drivingInnovation;
        
        // Hero badges
        const speedBadge = document.getElementById('speed-badge');
        const innovationBadge = document.getElementById('innovation-badge');
        const excellenceBadge = document.getElementById('excellence-badge');
        if (speedBadge) speedBadge.textContent = t.speed;
        if (innovationBadge) innovationBadge.textContent = t.innovation;
        if (excellenceBadge) excellenceBadge.textContent = t.excellence;
        
        // Our Story section
        const ourStory = document.getElementById('our-story');
        const storyContent = document.getElementById('story-content');
        if (ourStory) ourStory.textContent = t.ourStory;
        if (storyContent) storyContent.textContent = t.storyContent;
        
        // Stats
        const teamMembersLabel = document.getElementById('team-members-label');
        const departmentsLabel = document.getElementById('departments-label');
        const awardsLabel = document.getElementById('awards-label');
        if (teamMembersLabel) teamMembersLabel.textContent = t.teamMembersLabel;
        if (departmentsLabel) departmentsLabel.textContent = t.departmentsLabel;
        if (awardsLabel) awardsLabel.textContent = t.awardsLabel;
        
        // Mission & Vision
        const ourMission = document.getElementById('our-mission');
        const missionContent = document.getElementById('mission-content');
        const ourVision = document.getElementById('our-vision');
        const visionContent = document.getElementById('vision-content');
        if (ourMission) ourMission.textContent = t.ourMission;
        if (missionContent) missionContent.textContent = t.missionContent;
        if (ourVision) ourVision.textContent = t.ourVision;
        if (visionContent) visionContent.textContent = t.visionContent;
        
        // Departments
        const ourDepartments = document.getElementById('our-departments');
        if (ourDepartments) ourDepartments.textContent = t.ourDepartments;
        
        // Department cards
        const marketingTitle = document.getElementById('marketing-title');
        const marketingDesc = document.getElementById('marketing-desc');
        const sponsorshipsTitle = document.getElementById('sponsorships-title');
        const sponsorshipsDesc = document.getElementById('sponsorships-desc');
        const managementTitle = document.getElementById('management-title');
        const managementDesc = document.getElementById('management-desc');
        const chassisAeroTitle = document.getElementById('chassis-aero-title');
        const chassisAeroDesc = document.getElementById('chassis-aero-desc');
        const suspensionSteeringTitle = document.getElementById('suspension-steering-title');
        const suspensionSteeringDesc = document.getElementById('suspension-steering-desc');
        const transmissionBrakingTitle = document.getElementById('transmission-braking-title');
        const transmissionBrakingDesc = document.getElementById('transmission-braking-desc');
        const highVoltageTitle = document.getElementById('high-voltage-title');
        const highVoltageDesc = document.getElementById('high-voltage-desc');
        const lowVoltageTitle = document.getElementById('low-voltage-title');
        const lowVoltageDesc = document.getElementById('low-voltage-desc');

        if (marketingTitle) marketingTitle.textContent = t.marketingTitle;
        if (marketingDesc) marketingDesc.textContent = t.marketingDesc;
        if (sponsorshipsTitle) sponsorshipsTitle.textContent = t.sponsorshipsTitle;
        if (sponsorshipsDesc) sponsorshipsDesc.textContent = t.sponsorshipsDesc;
        if (managementTitle) managementTitle.textContent = t.managementTitle;
        if (managementDesc) managementDesc.textContent = t.managementDesc;
        if (chassisAeroTitle) chassisAeroTitle.textContent = t.chassisAeroTitle;
        if (chassisAeroDesc) chassisAeroDesc.textContent = t.chassisAeroDesc;
        if (suspensionSteeringTitle) suspensionSteeringTitle.textContent = t.suspensionSteeringTitle;
        if (suspensionSteeringDesc) suspensionSteeringDesc.textContent = t.suspensionSteeringDesc;
        if (transmissionBrakingTitle) transmissionBrakingTitle.textContent = t.transmissionBrakingTitle;
        if (transmissionBrakingDesc) transmissionBrakingDesc.textContent = t.transmissionBrakingDesc;
        if (highVoltageTitle) highVoltageTitle.textContent = t.highVoltageTitle;
        if (highVoltageDesc) highVoltageDesc.textContent = t.highVoltageDesc;
        if (lowVoltageTitle) lowVoltageTitle.textContent = t.lowVoltageTitle;
        if (lowVoltageDesc) lowVoltageDesc.textContent = t.lowVoltageDesc;
    };
    
    // Update projects page content
    window.updateProjectsPageContent = function() {
        const t = translations[currentLanguage];
        
        // Hero section
        const ourProjects = document.getElementById('our-projects');
        const projectsSubtitle = document.getElementById('projects-subtitle');
        if (ourProjects) ourProjects.textContent = t.ourProjects;
        if (projectsSubtitle) projectsSubtitle.textContent = t.projectsSubtitle;
        
        // Future Projects title
        const futureProjectsTitle = document.getElementById('future-projects-title');
        if (futureProjectsTitle) futureProjectsTitle.textContent = t.futureProjects;
    };
    
    // Update gallery page content
    window.updateGalleryPageContent = function() {
        const t = translations[currentLanguage];
        
        // Hero section
        const ourGallery = document.getElementById('our-gallery');
        const gallerySubtitle = document.getElementById('gallery-subtitle');
        if (ourGallery) ourGallery.textContent = t.ourGallery;
        if (gallerySubtitle) gallerySubtitle.textContent = t.gallerySubtitle;
        
        // Section titles
        const raceCarsTitle = document.getElementById('race-cars-title');
        const raceCarsDesc = document.getElementById('race-cars-desc');
        const teamSectionTitle = document.getElementById('team-section-title');
        const teamSectionDesc = document.getElementById('team-section-desc');
        const eventsTitle = document.getElementById('events-title');
        const eventsDesc = document.getElementById('events-desc');
        const workshopTitle = document.getElementById('workshop-title');
        const workshopDesc = document.getElementById('workshop-desc');
        
        if (raceCarsTitle) raceCarsTitle.textContent = t.raceCarsTitle;
        if (raceCarsDesc) {
            raceCarsDesc.innerHTML = t.raceCarsDesc.replace(/Black Hornets Racing/, '<span class="highlight">Black Hornets Racing</span>')
                .replace(/inovacija|innovation/, '<span class="highlight-secondary">$&</span>')
                .replace(/preciznog inženjeringa|precision engineering/, '<span class="highlight-secondary">$&</span>')
                .replace(/aerodinamičke izvrsnosti|aerodynamic excellence/, '<span class="highlight-secondary">$&</span>');
        }
        if (teamSectionTitle) teamSectionTitle.textContent = t.teamSectionTitle;
        if (teamSectionDesc) {
            teamSectionDesc.innerHTML = t.teamSectionDesc.replace(/strastvene umove|passionate minds/, '<span class="highlight">$&</span>')
                .replace(/inženjera|engineers/, '<span class="highlight-secondary">$&</span>')
                .replace(/dizajnera|designers/, '<span class="highlight-secondary">$&</span>')
                .replace(/inovatora|innovators/, '<span class="highlight-secondary">$&</span>');
        }
        if (eventsTitle) eventsTitle.textContent = t.eventsTitle;
        if (eventsDesc) {
            eventsDesc.innerHTML = t.eventsDesc.replace(/competitive spirit|takmičarskom duhu/, '<span class="highlight">$&</span>')
                .replace(/Formula Student competitions|Formula Student takmičenja/, '<span class="highlight-secondary">$&</span>')
                .replace(/engineering showcases|inženjerskih predstavljanja/, '<span class="highlight-secondary">$&</span>');
        }
        if (workshopTitle) workshopTitle.textContent = t.workshopTitle;
        if (workshopDesc) {
            workshopDesc.innerHTML = t.workshopDesc.replace(/inženjersko utočište|engineering sanctuary/, '<span class="highlight">$&</span>')
                .replace(/ideje pretvaraju u stvarnost|ideas transform into reality/, '<span class="highlight-secondary">$&</span>')
                .replace(/inovacije se susreću sa zanatstvom|innovation meets craftsmanship/, '<span class="highlight-secondary">$&</span>');
        }
    };
    
    // Update sponsors page content
    window.updateSponsorsPageContent = function() {
        const t = translations[currentLanguage];
        
        // Hero section
        const ourSponsors = document.getElementById('our-sponsors');
        const partnersInnovation = document.getElementById('partners-innovation');
        if (ourSponsors) ourSponsors.textContent = t.ourSponsors;
        if (partnersInnovation) partnersInnovation.textContent = t.partnersInnovation;
        
        // Sponsorship tiers
        const sponsorshipTiers = document.getElementById('sponsorship-tiers');
        const sponsorshipTiersMain = document.getElementById('sponsorship-tiers-main');
        if (sponsorshipTiers) sponsorshipTiers.textContent = t.sponsorshipTiers;
        if (sponsorshipTiersMain) sponsorshipTiersMain.textContent = t.sponsorshipTiers;
        
        const institutionsTierTitle = document.getElementById('institutions-tier-title');
        const platinumTierTitle = document.getElementById('platinum-tier-title');
        const goldTierTitle = document.getElementById('gold-tier-title');
        const silverTierTitle = document.getElementById('silver-tier-title');
        const bronzeTierTitle = document.getElementById('bronze-tier-title');
        const friendsTierTitle = document.getElementById('friends-tier-title');
        
        if (institutionsTierTitle) institutionsTierTitle.textContent = t.institutionsTier;
        if (platinumTierTitle) platinumTierTitle.textContent = t.platinumTier;
        if (goldTierTitle) goldTierTitle.textContent = t.goldTier;
        if (silverTierTitle) silverTierTitle.textContent = t.silverTier;
        if (bronzeTierTitle) bronzeTierTitle.textContent = t.bronzeTier;
        if (friendsTierTitle) friendsTierTitle.textContent = t.friendsTier;
        
        // Current sponsors
        const currentSponsorsTitle = document.getElementById('current-sponsors-title');
        if (currentSponsorsTitle) currentSponsorsTitle.textContent = t.currentSponsorsTitle;
        
        // Become a sponsor section
        const becomeSponsor = document.getElementById('become-sponsor');
        const joinJourney = document.getElementById('join-journey');
        const partnerNewsletter = document.getElementById('partner-newsletter');
        const partnerBrochure = document.getElementById('partner-brochure');
        
        if (becomeSponsor) becomeSponsor.textContent = t.becomeSponsor;
        if (joinJourney) joinJourney.textContent = t.joinJourney;
        if (partnerNewsletter) partnerNewsletter.textContent = t.partnerNewsletter;
        if (partnerBrochure) partnerBrochure.textContent = t.partnerBrochure;

        // Brochure flipbook section
        const brochureTitle = document.getElementById('brochure-title');
        const brochureSubtitle = document.getElementById('brochure-subtitle');
        const previousPage = document.getElementById('previous-page');
        const nextPageText = document.getElementById('next-page-text');
        
        if (brochureTitle) brochureTitle.textContent = t.brochureTitle;
        if (brochureSubtitle) brochureSubtitle.textContent = t.brochureSubtitle;
        if (previousPage) previousPage.textContent = t.previousPage;
        if (nextPageText) nextPageText.textContent = t.nextPage;

        // Download brochure button
        const downloadBrochureText = document.getElementById('download-brochure-text');
        if (downloadBrochureText) downloadBrochureText.textContent = t.downloadBrochure;
    };
    
    // Update contact page content
    window.updateContactPageContent = function() {
        // Only run on contact page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('contact')) {
            return;
        }
        
        const t = translations[currentLanguage];
        
        // Hero section
        const heroTitle = document.getElementById('hero-title');
        const heroSubtitle = document.getElementById('hero-subtitle');
        if (heroTitle) heroTitle.textContent = t.contactUs;
        if (heroSubtitle) heroSubtitle.textContent = t.contactHeroSubtitle;
        
        // Contact info cards
        const locationTitle = document.getElementById('location-title');
        const locationAddress = document.getElementById('location-address');
        const emailTitle = document.getElementById('email-title');
        const followTitle = document.getElementById('follow-title');
        
        if (locationTitle) locationTitle.textContent = t.visitUs;
        if (locationAddress) locationAddress.textContent = t.locationAddress;
        if (emailTitle) emailTitle.textContent = t.writeUs;
        if (followTitle) followTitle.textContent = t.followUs;
        
        // Contact form
        const formTitle = document.getElementById('form-title');
        const nameLabel = document.getElementById('name-label');
        const emailLabel = document.getElementById('email-label');
        const subjectLabel = document.getElementById('subject-label');
        const messageLabel = document.getElementById('message-label');
        const submitButton = document.getElementById('submit-button');
        
        if (formTitle) formTitle.textContent = t.sendMessage;
        if (nameLabel) nameLabel.textContent = t.fullName;
        if (emailLabel) emailLabel.textContent = t.emailAddress;
        if (subjectLabel) subjectLabel.textContent = t.subject;
        if (messageLabel) messageLabel.textContent = t.yourMessage;
        if (submitButton) submitButton.textContent = t.sendMessageButton;
        
        // FAQ section
        const faqHeading = document.getElementById('faq-heading');
        const faq1Question = document.getElementById('faq1-question');
        const faq1Answer = document.getElementById('faq1-answer');
        const faq2Question = document.getElementById('faq2-question');
        const faq2Answer = document.getElementById('faq2-answer');
        
        // Map overlay
        const ourLocation = document.getElementById('our-location');
        const locationDesc = document.getElementById('location-desc');
        if (ourLocation) ourLocation.textContent = t.ourLocation;
        if (locationDesc) locationDesc.textContent = t.locationDesc;

        if (faqHeading) faqHeading.textContent = t.faqHeading;
        if (faq1Question) faq1Question.textContent = t.faq1Question;
        if (faq1Answer) faq1Answer.textContent = t.faq1Answer;
        if (faq2Question) faq2Question.textContent = t.faq2Question;
        if (faq2Answer) faq2Answer.textContent = t.faq2Answer;
    };
    
    // Update apply page content
    window.updateApplyPageContent = function() {
        // Only run on apply page
        const currentPath = window.location.pathname;
        if (!currentPath.includes('apply')) {
            return;
        }
        
        const t = translations[currentLanguage];
        
        // Hero section
        const joinTeam = document.getElementById('join-team');
        const bePart = document.getElementById('be-part');
        if (joinTeam) joinTeam.textContent = t.joinOurTeam;
        if (bePart) bePart.textContent = t.bePart;
        
        // Info Cards Section
        const requirementsTitle = document.getElementById('requirements-title');
        const req1Title = document.getElementById('req1-title');
        const req1Desc = document.getElementById('req1-desc');
        const req2Title = document.getElementById('req2-title');
        const req2Desc = document.getElementById('req2-desc');
        const req3Title = document.getElementById('req3-title');
        const req3Desc = document.getElementById('req3-desc');
        
        if (requirementsTitle) requirementsTitle.textContent = t.requirements;
        if (req1Title) req1Title.textContent = t.studentStatus;
        if (req1Desc) req1Desc.textContent = t.studentStatusDesc;
        if (req2Title) req2Title.textContent = t.passion;
        if (req2Desc) req2Desc.textContent = t.passionDesc;
        if (req3Title) req3Title.textContent = t.teamSpirit;
        if (req3Desc) req3Desc.textContent = t.teamSpiritDesc;
        
        // Departments
        const departmentsTitle = document.getElementById('departments-title');
        const businessOps = document.getElementById('business-ops');
        const marketingDept = document.getElementById('marketing-dept');
        const sponsorshipsDept = document.getElementById('sponsorships-dept');
        const managementDept = document.getElementById('management-dept');
        const mechanicalEng = document.getElementById('mechanical-eng');
        const chassisAeroDept = document.getElementById('chassis-aero-dept');
        const suspensionSteeringDept = document.getElementById('suspension-steering-dept');
        const transmissionBrakingDept = document.getElementById('transmission-braking-dept');
        const electricalEng = document.getElementById('electrical-eng');
        const highVoltageDept = document.getElementById('high-voltage-dept');
        const lowVoltageDept = document.getElementById('low-voltage-dept');

        if (departmentsTitle) departmentsTitle.textContent = t.availableDepartments;
        if (businessOps) businessOps.textContent = t.businessTeam;
        if (marketingDept) marketingDept.textContent = t.marketing;
        if (sponsorshipsDept) sponsorshipsDept.textContent = t.sponsorships;
        if (managementDept) managementDept.textContent = t.management;
        if (mechanicalEng) mechanicalEng.textContent = t.mechanicalEngineering;
        if (chassisAeroDept) chassisAeroDept.textContent = t.chassisAero;
        if (suspensionSteeringDept) suspensionSteeringDept.textContent = t.suspensionSteering;
        if (transmissionBrakingDept) transmissionBrakingDept.textContent = t.transmissionBraking;
        if (electricalEng) electricalEng.textContent = t.electricalEngineering;
        if (highVoltageDept) highVoltageDept.textContent = t.highVoltage;
        if (lowVoltageDept) lowVoltageDept.textContent = t.lowVoltage;
        
        // Form headings
        const applicationFormTitle = document.getElementById('application-form-title');
        const applicationFormSubtitle = document.getElementById('application-form-subtitle');
        const personalInfo = document.getElementById('personal-info');
        const academicInfo = document.getElementById('academic-info');
        const teamPreferences = document.getElementById('team-preferences');
        const additionalDocs = document.getElementById('additional-docs');
        
        if (applicationFormTitle) applicationFormTitle.textContent = t.applicationForm;
        if (applicationFormSubtitle) applicationFormSubtitle.textContent = t.applicationFormSubtitle;
        if (personalInfo) personalInfo.textContent = t.personalInfo;
        if (academicInfo) academicInfo.textContent = t.academicInfo;
        if (teamPreferences) teamPreferences.textContent = t.teamPreferences;
        if (additionalDocs) additionalDocs.textContent = t.additionalDocuments;
        
        // Form labels
        const firstNameLabel = document.getElementById('first-name-label');
        const lastNameLabel = document.getElementById('last-name-label');
        const emailLabel = document.getElementById('email-label');
        const phoneLabel = document.getElementById('phone-label');
        const studentIdLabel = document.getElementById('student-id-label');
        const facultyLabel = document.getElementById('faculty-label');
        const majorLabel = document.getElementById('major-label');
        const academicYearLabel = document.getElementById('academic-year-label');
        const gpaLabel = document.getElementById('gpa-label');
        const positionLabel = document.getElementById('position-label');
        const experienceLabel = document.getElementById('experience-label');
        const motivationLabel = document.getElementById('motivation-label');
        const resumeText = document.getElementById('resume-text');
        const submitApplication = document.getElementById('submit-application');
        
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
        
        // Form options (academic year dropdown)
        const selectYear = document.getElementById('select-year');
        const firstYear = document.getElementById('first-year');
        const secondYear = document.getElementById('second-year');
        const thirdYear = document.getElementById('third-year');

        if (selectYear) selectYear.textContent = t.selectYear;
        if (firstYear) firstYear.textContent = t.firstYear;
        if (secondYear) secondYear.textContent = t.secondYear;
        if (thirdYear) thirdYear.textContent = t.thirdYear;
        if (fourthYear) fourthYear.textContent = t.fourthYear;
        
        // Update select options
        updateSelectOptions(t);
    };
    
    // Helper function to update select options
    function updateSelectOptions(t) {
        // Major select
        const majorSelect = document.getElementById('major');
        if (majorSelect) {
            const options = majorSelect.querySelectorAll('option');
            if (options[0]) options[0].textContent = t.selectMajor;
            if (options[1]) options[1].textContent = t.mechanicalEngineering;
            if (options[2]) options[2].textContent = t.electricalEngineering;
            if (options[3]) options[3].textContent = t.computerScience;
            if (options[4]) options[4].textContent = t.businessAdministration;
            if (options[5]) options[5].textContent = t.marketing;
            if (options[6]) options[6].textContent = t.logistics;
            if (options[7]) options[7].textContent = t.other;
        }
        
        // Academic year select
        const yearSelect = document.getElementById('academic_year');
        if (yearSelect) {
            const options = yearSelect.querySelectorAll('option');
            if (options[0]) options[0].textContent = t.selectYear;
            if (options[1]) options[1].textContent = t.firstYear;
            if (options[2]) options[2].textContent = t.secondYear;
            if (options[3]) options[3].textContent = t.thirdYear;
            if (options[4]) options[4].textContent = t.fourthYear;
        }
        
        // Team select
        const teamSelect = document.getElementById('team');
        if (teamSelect) {
            const options = teamSelect.querySelectorAll('option');
            if (options[0]) options[0].textContent = t.selectTeam;
            if (options[1]) options[1].textContent = t.mechanicalEngineering;
            if (options[2]) options[2].textContent = t.electricalEngineering;
            if (options[3]) options[3].textContent = t.businessOperations;
        }
        
        // Department select - update optgroup labels and options
        const deptSelect = document.getElementById('department');
        if (deptSelect) {
            const deptOptions = deptSelect.querySelectorAll('option');
            if (deptOptions[0]) deptOptions[0].textContent = t.selectDepartment;
            
            const optgroups = deptSelect.querySelectorAll('optgroup');
            if (optgroups[0]) optgroups[0].label = t.businessOperations;
            if (optgroups[1]) optgroups[1].label = t.electricalEngineering;
            if (optgroups[2]) optgroups[2].label = t.mechanicalEngineering;

            // Update department options
            const marketingOpt = deptSelect.querySelector('option[value="marketing"]');
            const sponsorshipsOpt = deptSelect.querySelector('option[value="sponsorships"]');
            const managementOpt = deptSelect.querySelector('option[value="management"]');
            const chassisAeroOpt = deptSelect.querySelector('option[value="chassis_aero"]');
            const suspensionSteeringOpt = deptSelect.querySelector('option[value="suspension_steering"]');
            const transmissionBrakingOpt = deptSelect.querySelector('option[value="transmission_braking"]');
            const highVoltageOpt = deptSelect.querySelector('option[value="high_voltage"]');
            const lowVoltageOpt = deptSelect.querySelector('option[value="low_voltage"]');

            if (marketingOpt) marketingOpt.textContent = t.marketing;
            if (sponsorshipsOpt) sponsorshipsOpt.textContent = t.sponsorships;
            if (managementOpt) managementOpt.textContent = t.management;
            if (chassisAeroOpt) chassisAeroOpt.textContent = t.chassisAero;
            if (suspensionSteeringOpt) suspensionSteeringOpt.textContent = t.suspensionSteering;
            if (transmissionBrakingOpt) transmissionBrakingOpt.textContent = t.transmissionBraking;
            if (highVoltageOpt) highVoltageOpt.textContent = t.highVoltage;
            if (lowVoltageOpt) lowVoltageOpt.textContent = t.lowVoltage;
        }
        
        // Update position placeholder
        const positionInput = document.getElementById('position');
        if (positionInput) {
            positionInput.placeholder = t.yourDesiredPosition;
        }
    }

    // تحميل الهيدر
    const loadHeader = () => {
        const header = document.querySelector(CONFIG.selectors.header);
        if (!header) return;

        const imagePath = getImagePath();
        
        const headerContent = `
            <div class="main-header">
                <nav class="navbar">
                    <div class="nav-brand">
                        <a href="${getPagePath()}">
                            <img src="${imagePath}W logo.png" alt="Black Hornets Logo" class="nav-logo">
                        </a>
                    </div>

                    <div class="nav-links" id="nav-links">
                        <div class="language-switcher mobile-only">
                            <button class="lang-btn ${currentLanguage === 'en' ? 'active' : ''}" 
                                    data-lang="en"
                                    onclick="changeLanguage('en')">
                                <span>EN</span>
                            </button>
                            <button class="lang-btn ${currentLanguage === 'sr' ? 'active' : ''}" 
                                    data-lang="sr"
                                    onclick="changeLanguage('sr')">
                                <span>SR</span>
                            </button>
                        </div>

                        <a href="${getPagePath()}" class="nav-link">
                            <i class="fas fa-home"></i>
                            <span>${translations[currentLanguage].home}</span>
                        </a>
                        <a href="${getPagePath()}pages/team.html" class="nav-link">
                            <i class="fas fa-users"></i>
                            <span>${translations[currentLanguage].team}</span>
                        </a>
                        <a href="${getPagePath()}pages/about.html" class="nav-link">
                            <i class="fas fa-info-circle"></i>
                            <span>${translations[currentLanguage].about}</span>
                        </a>
                        <a href="${getPagePath()}pages/projects.html" class="nav-link">
                            <i class="fas fa-project-diagram"></i>
                            <span>${translations[currentLanguage].projects}</span>
                        </a>
                        <a href="${getPagePath()}pages/gallery.html" class="nav-link">
                            <i class="fas fa-images"></i>
                            <span>${translations[currentLanguage].gallery}</span>
                        </a>
                        <a href="${getPagePath()}pages/sponsors.html" class="nav-link">
                            <i class="fas fa-handshake"></i>
                            <span>${translations[currentLanguage].sponsors}</span>
                        </a>
                        <a href="${getPagePath()}pages/contact.html" class="nav-link">
                            <i class="fas fa-envelope"></i>
                            <span>${translations[currentLanguage].contact}</span>
                        </a>
                    </div>
                    
                    <div class="nav-actions">
                        <a href="${getPagePath()}admin/login.php" class="login-btn">
                            <i class="fas fa-sign-in-alt"></i>
                            <span>${translations[currentLanguage].login}</span>
                        </a>
                        <a href="${getPagePath()}pages/apply.html" class="apply-btn">
                            <i class="fas fa-user-plus"></i>
                            <span>${translations[currentLanguage].applyNow}</span>
                        </a>
                    </div>

                    <button class="mobile-toggle" id="mobile-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </nav>
                
                <!-- Desktop Language Switcher -->
                <div class="language-switcher desktop-only">
                    <button class="lang-btn ${currentLanguage === 'en' ? 'active' : ''}" 
                            data-lang="en"
                            onclick="changeLanguage('en')">
                        <span>EN</span>
                    </button>
                    <button class="lang-btn ${currentLanguage === 'sr' ? 'active' : ''}" 
                            data-lang="sr"
                            onclick="changeLanguage('sr')">
                        <span>SR</span>
                    </button>
                </div>
            </div>
        `;

        header.innerHTML = headerContent;
        setupMobileMenu();
        setupHeaderScroll();
        setActiveNavLink();
    };

    const loadFooter = () => {
        const footer = document.querySelector(CONFIG.selectors.footer);
        if (!footer) return;

        footer.classList.add('footer');

        const imagePath = getImagePath();
        const basePath = getPagePath();
        const t = translations[currentLanguage];

        const footerContent = `
            <div class="footer-waves">
                <div class="wave" id="wave1"></div>
                <div class="wave" id="wave2"></div>
            </div>

            <div class="footer-content">
                <div class="footer-section brand">
                    <img src="${imagePath}Tipografija_belo.png" alt="Black Hornets Logo" class="footer-logo">
                    <div class="social-links">
                        <a href="https://www.facebook.com" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://www.instagram.com/blackhornets.ns/" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-instagram"></i></a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-linkedin-in"></i></a>
                        <a href="https://www.youtube.com" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-youtube"></i></a>
                    </div>
                </div>

                <div class="footer-section links">
                    <h3>${t.quickLinks}</h3>
                    <div class="link-grid">
                        <a href="${basePath}pages/about.html" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.about}</a>
                        <a href="${basePath}pages/projects.html" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.projects}</a>
                        <a href="${basePath}pages/team.html" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.team}</a>
                        <a href="${basePath}pages/gallery.html" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.gallery}</a>
                        <a href="${basePath}pages/sponsors.html" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.sponsors}</a>
                        <a href="${basePath}pages/contact.html" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.contact}</a>
                    </div>
                </div>

                <div class="footer-section contact">
                    <h3>${t.contactUs}</h3>
                    <div class="contact-info">
                        <a href="https://maps.google.com/?q=Faculty+of+Technical+Sciences+Novi+Sad" target="_blank" rel="noopener" class="contact-item"><i class="fas fa-map-marker-alt"></i> <span>Univerzitet u Novom Sadu, Srbija</span></a>
                        <a href="mailto:formulastudentftn@gmail.com" class="contact-item"><i class="fas fa-envelope"></i> <span>formulastudentftn@gmail.com</span></a>
                        <a href="tel:+381627825688" class="contact-item"><i class="fas fa-phone"></i> <span>+381 62 782 568</span></a>
                    </div>
                </div>
            </div>

            <div class="footer-bottom">
                <div class="copyright">
                    <p>&copy; 2024 Black Hornets Racing</p>
                    <span class="separator">|</span>
                    <p>Powered by CodeHive</p>
                </div>
            </div>
        `;

        footer.innerHTML = footerContent;
    };
    

    // تهيئة جميع المكونات
    const initComponents = () => {
        // Apply saved language immediately before loading components
        const savedLanguage = localStorage.getItem('language');
        if (savedLanguage && savedLanguage !== currentLanguage) {
            currentLanguage = savedLanguage;
        }
        
        loadHeader();
        loadFooter();
        
        // Update language buttons to reflect current language
        setTimeout(() => {
            document.querySelectorAll('.lang-btn').forEach(btn => {
                btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLanguage);
            });
        }, 50);
        
        // Update homepage content on initial load
        updateHomepageContent();
        
        // Update team page content if on team page (with slight delay to ensure DOM is ready)
        setTimeout(() => {
            if (window.updateTeamPageContent) {
                window.updateTeamPageContent();
            }
        }, 100);
        
        // Update about page content if on about page
        if (typeof window.updateAboutPageContent === 'function') {
            window.updateAboutPageContent();
        }
        
        // Update projects page content if on projects page
        if (typeof window.updateProjectsPageContent === 'function') {
            window.updateProjectsPageContent();
        }
        
        // Update gallery page content if on gallery page
        if (typeof window.updateGalleryPageContent === 'function') {
            window.updateGalleryPageContent();
        }
        
        // Update sponsors page content if on sponsors page
        if (typeof window.updateSponsorsPageContent === 'function') {
            window.updateSponsorsPageContent();
        }
        
        // Update contact page content if on contact page
        if (typeof window.updateContactPageContent === 'function') {
            window.updateContactPageContent();
        }
        
        // Update apply page content if on apply page
        if (typeof window.updateApplyPageContent === 'function') {
            window.updateApplyPageContent();
        }
    };

    // تحسين التعامل مع القائمة المتنقلة
    const setupMobileMenu = () => {
        const mobileToggle = document.querySelector(CONFIG.selectors.mobileToggle);
        const navLinks = document.querySelector(CONFIG.selectors.navLinks);
        
        if (mobileToggle && navLinks) {
            mobileToggle.addEventListener('click', () => {
                navLinks.classList.toggle(CONFIG.classes.active);
                mobileToggle.classList.toggle(CONFIG.classes.active);
            });

            // إغلاق القائمة عند النقر على الروابط
            const links = document.querySelectorAll(CONFIG.selectors.navLink);
            links.forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove(CONFIG.classes.active);
                    mobileToggle.classList.remove(CONFIG.classes.active);
                });
            });
        }
    };

    // تحسين سلوك الهيدر عند التمرير
    const setupHeaderScroll = () => {
        const header = document.querySelector('.main-header');
        if (!header) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add(CONFIG.classes.scrolled);
            } else {
                header.classList.remove(CONFIG.classes.scrolled);
            }
        }, { passive: true });
    };

    // تحديد الرابط النشط
    const setActiveNavLink = () => {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll(CONFIG.selectors.navLink);

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (currentPath.includes(href) && href !== 'index.html') {
                link.classList.add(CONFIG.classes.active);
            } else if (currentPath.endsWith('/') && href === 'index.html') {
                link.classList.add(CONFIG.classes.active);
            }
        });
    };

    // بدء التحميل
    initComponents();
    
    // Force immediate team page translation on load
    setTimeout(() => {
        if (document.querySelector('.department-box') && window.updateTeamPageContent) {
            window.updateTeamPageContent();
        }
    }, 10);
    
    // Ensure team page translations are applied after full page load
    window.addEventListener('load', function() {
        if (window.updateTeamPageContent && document.querySelector('.department-box')) {
            window.updateTeamPageContent();
        }
    });
});
