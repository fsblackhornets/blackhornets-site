    document.addEventListener('DOMContentLoaded', function() {
    let allMembers = [];
    const departmentView = document.querySelector('.department-members-view');
    const membersGrid = document.querySelector('.members-grid');
    const orgStructure = document.querySelector('.org-structure');
    const modal = document.getElementById('memberModal');
    let touchStartX = 0;
    let touchEndX = 0;

    // Track current view state for language switching (English dept name for consistency)
    let currentViewTeam = null;
    let currentViewDepartmentEnglish = null;

    // Map English department names to translation keys
    const deptTransKeys = {
        'Marketing': 'marketing',
        'Sponsorships': 'sponsorships',
        'Management': 'management',
        'Chassis and Aerodynamics': 'chassisAero',
        'Suspension and Steering': 'suspensionSteering',
        'Transmission and Braking': 'transmissionBraking',
        'High Voltage': 'highVoltage',
        'Low Voltage': 'lowVoltage'
    };

    function getTranslatedDeptName(englishName) {
        if (!englishName) return null;
        const t = window.getTranslations ? window.getTranslations() : {};
        const key = deptTransKeys[englishName];
        return key ? (t[key] || englishName) : englishName;
    }

    // Translate a position value (key or text) to the current language
    // Handles: predefined keys (e.g. "designer"), old Serbian text (e.g. "Dizajner"),
    // and custom positions (with position_en fallback for English)
    const positionSrToKey = {
        'Inženjer': 'engineer', 'Dizajner': 'designer', 'CAD Inženjer': 'cad_engineer',
        'Inženjer oslanjanja': 'suspension_engineer', 'Inženjer aerodinamike': 'aerodynamics_engineer',
        'Termalni inženjer': 'thermal_engineer', 'Inženjer šasije': 'chassis_engineer',
        'Inženjer elektronike': 'electronics_engineer', 'Programer firmvera': 'firmware_developer',
        'Softverski programer': 'software_developer', 'Specijalista za baterije': 'battery_specialist',
        'PCB Dizajner': 'pcb_designer', 'Kreator sadržaja': 'content_creator',
        'Menadžer društvenih mreža': 'social_media_manager', 'Menadžer marketinga': 'marketing_manager',
        'Menadžer sponzorstava': 'sponsorship_manager', 'Koordinator događaja': 'event_coordinator',
        'Grafički dizajner': 'graphic_designer', 'Fotograf': 'photographer',
        'Finansijski analitičar': 'budget_analyst', 'Koordinator projekta': 'project_coordinator'
    };

    function translatePosition(positionValue, positionEn) {
        if (!positionValue) return null;
        const t = window.getTranslations ? window.getTranslations() : {};
        const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'sr';

        // Direct key lookup (new data stored as keys like "designer")
        const directKey = 'pos_' + positionValue;
        if (t[directKey]) return t[directKey];

        // Reverse mapping for old data stored as Serbian text
        const mappedKey = positionSrToKey[positionValue];
        if (mappedKey) {
            const transKey = 'pos_' + mappedKey;
            if (t[transKey]) return t[transKey];
        }

        // Custom position: use position_en when English is selected
        if (lang === 'en' && positionEn) return positionEn;

        return positionValue;
    }

    // Function to decode HTML entities for proper Serbian character display
    function decodeHtmlEntities(text) {
        if (!text) return text;
        const textarea = document.createElement('textarea');
        textarea.innerHTML = text;
        return textarea.value;
    }

    // تعريف هيكل الفرق والأقسام
    const getTeamStructure = () => {
        const t = window.getTranslations ? window.getTranslations() : {
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
            lowVoltage: 'Low Voltage'
        };

        return {
            mechanical: {
                name: t.mechanicalEngineering,
                departments: [t.chassisAero, t.suspensionSteering, t.transmissionBraking]
            },
            electrical: {
                name: t.electricalEngineering,
                departments: [t.highVoltage, t.lowVoltage]
            },
            operating_business: {
                name: t.businessTeam,
                departments: [t.marketing, t.sponsorships, t.management]
            }
        };
    };

    // إضافة دالة لإزالة الحالة النشطة من جميع الأقسام
    function clearActiveStates() {
        document.querySelectorAll('.department-box').forEach(box => {
            box.classList.remove('active');
        });
    }

    // إضافة دالة لتحديث حالة القسم النشط
    function setActiveDepartment(department) {
        clearActiveStates();
        const departmentBox = document.querySelector(`.department-box[data-department="${department}"]`);
        if (departmentBox) {
            departmentBox.classList.add('active');
        }
    }

    // تحسين أداء تحميل الصور
    function preloadImages(members) {
        members.forEach(member => {
            if (member.profile_picture && member.profile_picture !== 'default.jpg') {
                const img = new Image();
                img.src = `/uploads/profiles/${member.profile_picture}`;
            }
        });
    }

    // إضافة دالة للتعامل مع اللمس
    function handleTouchStart(e) {
        touchStartX = e.touches[0].clientX;
    }

    function handleTouchMove(e) {
        touchEndX = e.touches[0].clientX;
    }

    function handleTouchEnd(card) {
        const swipeDistance = touchEndX - touchStartX;
        if (Math.abs(swipeDistance) > 50) { // الحد الأدنى للمسافة للتحريك
            if (swipeDistance > 0) {
                card.querySelector('.card-inner').style.transform = 'rotateY(0deg)';
            } else {
                card.querySelector('.card-inner').style.transform = 'rotateY(180deg)';
            }
        }
    }

    async function fetchTeamMembers() {
        try {
            await window.apiReady;
            const data = await window.API.team.getAll();

            if (data.success) {
                allMembers = data.members;

                // Preload images
                preloadImages(allMembers);

                // Build full org chart (includes PL cards, connections, subteam boxes, buttons)
                updateLeadershipStructure(data);
            } else {
                console.error('API returned error:', data.message);
                showApiError('Failed to load team members: ' + (data.message || 'Unknown error'));
            }
        } catch (error) {
            console.error('Fetch error:', error);
            showApiError('Failed to load team members: ' + error.message);
        }
    }

    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        membersGrid.innerHTML = '';
        membersGrid.appendChild(errorDiv);
    }

    function showApiError(message) {
        const hierarchyBox = document.querySelector('.hierarchy-box');
        if (hierarchyBox) {
            hierarchyBox.innerHTML = `<div class="error-message" style="padding:2rem;text-align:center;color:#ff4444;">${message}</div>`;
        }
        if (orgStructure) orgStructure.style.display = 'none';
    }

    // Build full org chart hierarchy with connections
    function updateLeadershipStructure(data) {
        const hierarchyBox = document.querySelector('.hierarchy-box');
        if (!hierarchyBox) return;

        hierarchyBox.innerHTML = '';

        // Hide the static org-structure — hierarchy now includes everything
        if (orgStructure) orgStructure.style.display = 'none';

        const t = window.getTranslations ? window.getTranslations() : {
            seeTeamMembers: 'See Team Members'
        };
        const teamStructure = getTeamStructure();

        // 1. Team Leader at the top
        if (data.team_leader) {
            hierarchyBox.appendChild(createLeaderCard(data.team_leader, 'Team Leader'));

            const vLine = document.createElement('div');
            vLine.className = 'vertical-line';
            hierarchyBox.appendChild(vLine);
        }

        // 2. Horizontal branch from TL to 3 sectors
        const branch = document.createElement('div');
        branch.className = 'hierarchy-branch';
        hierarchyBox.appendChild(branch);

        // 3. Three sector columns (PL → connector → subteam boxes)
        const sectors = [
            { key: 'mechanical', pl: data.mechanical_project_leader, label: 'Mechanical Engineering', cssClass: 'mechanical', structure: teamStructure.mechanical },
            { key: 'electrical', pl: data.electrical_project_leader, label: 'Electrical Engineering', cssClass: 'electrical', structure: teamStructure.electrical },
            { key: 'operating_business', pl: data.business_project_leader, label: 'Business Team', cssClass: 'operating-business', structure: teamStructure.operating_business }
        ];

        const sectorsContainer = document.createElement('div');
        sectorsContainer.className = 'sectors-container';

        sectors.forEach(sector => {
            const column = document.createElement('div');
            column.className = `sector-column ${sector.cssClass}`;

            // Drop connector from branch
            const drop = document.createElement('div');
            drop.className = 'sector-drop';
            column.appendChild(drop);

            // Sector/project title above PL card
            const sectorTitle = document.createElement('h3');
            sectorTitle.className = 'sector-title';
            sectorTitle.textContent = sector.structure.name;
            column.appendChild(sectorTitle);

            // PL card
            if (sector.pl) {
                column.appendChild(createLeaderCard(sector.pl, 'Project Leader', sector.label));
            }

            // Vertical line from PL to subteams
            const vLine = document.createElement('div');
            vLine.className = 'vertical-line';
            column.appendChild(vLine);

            // Sub-branch (horizontal line spanning subteams)
            if (sector.structure.departments.length > 1) {
                const subBranch = document.createElement('div');
                subBranch.className = 'sub-branch';
                column.appendChild(subBranch);
            }

            // Subteam boxes
            const subteamsRow = document.createElement('div');
            subteamsRow.className = 'subteams-row';

            sector.structure.departments.forEach(subteamName => {
                const item = document.createElement('div');
                item.className = 'subteam-item';

                const subDrop = document.createElement('div');
                subDrop.className = 'subteam-drop';
                item.appendChild(subDrop);

                const box = document.createElement('div');
                box.className = 'subteam-box';
                box.textContent = subteamName;
                box.addEventListener('click', () => {
                    showDepartmentMembers(sector.key, subteamName);
                });
                item.appendChild(box);

                subteamsRow.appendChild(item);
            });

            column.appendChild(subteamsRow);

            // "See Team Members" button
            const btn = document.createElement('button');
            btn.className = 'see-team-btn';
            btn.textContent = t.seeTeamMembers || 'See Team Members';
            btn.addEventListener('click', () => {
                showDepartmentMembers(sector.key);
            });
            column.appendChild(btn);

            sectorsContainer.appendChild(column);
        });

        // Modal close
        const modal = document.getElementById('memberModal');
        const closeModal = () => {
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        document.querySelector('.close-modal')?.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal?.style.display === 'block') closeModal(); });

        // Load data
        window.fetchTeamMembers();

        // Re-render on language change
        window.addEventListener('languageChanged', () => {
            window.updateTeamPageContent?.();

            if ((window.allTeamMembers || []).length > 0) {
                window.fetchTeamMembers().then(() => {
                    if (window.currentViewTeam) {
                        const translatedDept = window.getTranslatedDeptName(window.currentViewDepartmentEnglish);
                        window.showDepartmentMembers(window.currentViewTeam, translatedDept, true);
                    }
                });
            }
        });
    });
});
