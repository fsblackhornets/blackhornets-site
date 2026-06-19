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
            const response = await fetch('/backend/api/team/read.php');
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

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

        hierarchyBox.appendChild(sectorsContainer);
    }
    
    // وظيفة لإنشاء بطاقة قائد
    function createLeaderCard(leader, position, department = '') {
        const t = window.getTranslations ? window.getTranslations() : {
            teamLeader: 'Team Leader',
            projectLeader: 'Project Leader',
            subLeader: 'Sub Leader',
            email: 'EMAIL',
            studyField: 'STUDY FIELD',
            academicYear: 'ACADEMIC YEAR',
            mechanicalEngineering: 'Mechanical Engineering',
            electricalEngineering: 'Electrical Engineering',
            businessTeam: 'Business Team'
        };

        // Translate position
        let translatedPosition = position;
        if (position === 'Team Leader') translatedPosition = t.teamLeader;
        else if (position === 'Project Leader') translatedPosition = t.projectLeader;
        else if (position === 'Sub Leader') translatedPosition = t.subLeader;

        // Translate department
        let translatedDepartment = department;
        if (department === 'Mechanical Engineering') translatedDepartment = t.mechanicalEngineering;
        else if (department === 'Electrical Engineering') translatedDepartment = t.electricalEngineering;
        else if (department === 'Business Team') translatedDepartment = t.businessTeam;
        
        const leaderPosition = document.createElement('div');
        leaderPosition.className = 'leader-position';
        
        const positionClass = position === 'Project Leader' ? 'project-leader-card' : 
                             position === 'Team Leader' ? 'team-leader-card' : 
                             position === 'Sub Leader' ? 'sub-leader-card' : '';
        
        const leaderHTML = `
            <div class="member-card ${positionClass}">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="member-image">
                            <img src="${leader.profile_picture && leader.profile_picture !== 'default.jpg' ? '../uploads/profiles/' + leader.profile_picture : '../assets/images/W logo.png'}" alt="${translatedPosition}">
                        </div>
                        <div class="member-info">
                            <h3>${decodeHtmlEntities(leader.full_name)}</h3>
                            <p class="position">${translatedPosition}</p>
                            ${translatedDepartment ? `<p class="department">${translatedDepartment}</p>` : ''}
                        </div>
                    </div>
                    <div class="card-back">
                        <div class="info-item">
                            <div class="info-label"><i class="fas fa-university"></i> ${t.faculty || 'Faculty'}</div>
                            <div class="info-value">${decodeHtmlEntities(leader.faculty) || 'N/A'}</div>
                        </div>
                        <div class="info-item">
                            <div class="info-label"><i class="fas fa-graduation-cap"></i> ${t.studyField}</div>
                            <div class="info-value">${decodeHtmlEntities(leader.study_field) || 'N/A'}</div>
                        </div>
                        ${translatedDepartment ? `<div class="info-item">
                            <div class="info-label"><i class="fas fa-sitemap"></i> ${t.department || 'Department'}</div>
                            <div class="info-value">${translatedDepartment}</div>
                        </div>` : ''}
                    </div>
                </div>
            </div>
        `;
        
        leaderPosition.innerHTML = leaderHTML;
        const card = leaderPosition.querySelector('.member-card');
        
        // إضافة مستمعات اللمس للبطاقة
        card.addEventListener('touchstart', handleTouchStart, false);
        card.addEventListener('touchmove', handleTouchMove, false);
        card.addEventListener('touchend', () => handleTouchEnd(card), false);

        // Click to open modal
        card.addEventListener('click', () => showMemberDetails(leader));

        return leaderPosition;
    }

    function showDepartmentMembers(team, specificDepartment = null, skipScroll = false) {
        const actualTeam = team === 'bot' ? 'operating_business' : team;
        const teamStructure = getTeamStructure();
        const teamData = teamStructure[actualTeam];
        const t = window.getTranslations ? window.getTranslations() : {};

        if (!teamData) {
            showError('Team not found: ' + actualTeam);
            return;
        }

        // Department name mapping: translated names -> database department_name values
        const departmentMapping = {
            // Business Team departments
            'Marketing': 'Marketing',
            'Sponsorships': 'Sponsorships',
            'Sponzorstva': 'Sponsorships',
            'Management': 'Management',
            'Menadžment': 'Management',
            // Mechanical Engineering departments
            'Chassis and Aerodynamics': 'Chassis and Aerodynamics',
            'Šasije i aerodinamika': 'Chassis and Aerodynamics',
            'Suspension and Steering': 'Suspension and Steering',
            'Oslanjanje i upravljanje': 'Suspension and Steering',
            'Transmission and Braking': 'Transmission and Braking',
            'Transmisija i kočenje': 'Transmission and Braking',
            // Electrical Engineering departments
            'High Voltage': 'High Voltage',
            'Visoki napon': 'High Voltage',
            'Low Voltage': 'Low Voltage',
            'Niski napon': 'Low Voltage'
        };

        // Track current view for language switch re-rendering (store English name)
        currentViewTeam = actualTeam;
        if (specificDepartment) {
            currentViewDepartmentEnglish = departmentMapping[specificDepartment] || specificDepartment;
        } else {
            currentViewDepartmentEnglish = null;
        }

        membersGrid.innerHTML = '';
        membersGrid.style.display = 'block';
        departmentView.style.display = 'block';

        // Scroll to the members view (skip when re-rendering for language change)
        if (!skipScroll) {
            setTimeout(() => {
                departmentView.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 50);
        }

        // عرض جميع أعضاء الفريق
        const teamMembers = allMembers.filter(m => m.team === actualTeam);

        const teamHeader = document.createElement('div');
        teamHeader.className = 'team-header';
        teamHeader.innerHTML = `<h2 class="team-title">${teamData.name}</h2>`;
        if (specificDepartment) {
            teamHeader.innerHTML += `<h3 class="department-title">${specificDepartment}</h3>`;
        }
        membersGrid.appendChild(teamHeader);

        let hasMembers = false;
        let departmentMembers;

        if (specificDepartment) {
            // Convert translated department name to English for database comparison
            const englishDept = departmentMapping[specificDepartment] || specificDepartment;
            
            // فلترة الأعضاء حسب القسم
            departmentMembers = teamMembers.filter(m => {
                const memberDept = m.department_name || m.department;
                return memberDept && typeof memberDept === 'string' && memberDept.toLowerCase() === englishDept.toLowerCase();
            });
        } else {
            // Show all members of the team
            departmentMembers = teamMembers;
        }

        if (departmentMembers.length > 0) {
            hasMembers = true;
            const deptSection = document.createElement('div');
            deptSection.className = 'department-section';
            
            // إنشاء عنوان القسم
            if (specificDepartment) {
                deptSection.innerHTML = `<h3 class="department-title">${specificDepartment}</h3>`;
            } else {
                deptSection.innerHTML = `<h3 class="department-title">${t.allMembers || 'All Members'} - ${teamData.name}</h3>`;
            }
            
            // البحث عن Sub Leader في هذا القسم
            const subLeader = departmentMembers.find(m => m.role === 'sub_leader');
            const regularMembers = departmentMembers.filter(m => m.role !== 'sub_leader');
            
            // إذا كان هناك sub leader، عرضه في الأعلى
            if (subLeader) {
                const subLeaderContainer = document.createElement('div');
                subLeaderContainer.className = 'sub-leader-container';
                
                const subLeaderCard = createMemberCard(subLeader);
                subLeaderContainer.appendChild(subLeaderCard);
                deptSection.appendChild(subLeaderContainer);
            }
            
            // إضافة بقية الأعضاء في صف منفصل
            if (regularMembers.length > 0) {
                const membersContainer = document.createElement('div');
                membersContainer.className = 'members-row';
                
                regularMembers.forEach(member => {
                    const memberCard = createMemberCard(member);
                    membersContainer.appendChild(memberCard);
                });
                
                deptSection.appendChild(membersContainer);
            }

            membersGrid.appendChild(deptSection);
        }

        if (!hasMembers) {
            const noMembersText = t.noMembersFound || 'No members found';
            if (specificDepartment) {
                showError(`${noMembersText} - ${specificDepartment}`);
            } else {
                showError(`${noMembersText} - ${teamData.name}`);
            }
        }
    }

    function createMemberCard(member) {
        const t = window.getTranslations ? window.getTranslations() : {
            teamMember: 'Team Member',
            subLeader: 'Sub Leader',
            email: 'Email',
            studyField: 'Study Field',
            academicYear: 'Academic Year',
            motivation: 'Motivation',
            skills: 'Skills',
            marketing: 'Marketing',
            sponsorships: 'Sponsorships',
            management: 'Management',
            chassisAero: 'Chassis and Aerodynamics',
            suspensionSteering: 'Suspension and Steering',
            transmissionBraking: 'Transmission and Braking',
            highVoltage: 'High Voltage',
            lowVoltage: 'Low Voltage'
        };

        const card = document.createElement('div');
        card.className = 'member-card';

        // إضافة فئة خاصة للـ sub-leader
        if (member.role === 'sub_leader') {
            card.classList.add('sub-leader-card');
        }

        // Translate position using key-based translation system
        let translatedPosition = translatePosition(member.position, member.position_en) || t.teamMember;
        if (member.role === 'sub_leader') {
            translatedPosition = t.subLeader;
        }

        // Translate department name
        const deptName = member.department_name || member.department;
        let translatedDepartment = decodeHtmlEntities(deptName);

        // Map English department names to translations
        const deptMapping = {
            'Marketing': t.marketing,
            'Sponsorships': t.sponsorships,
            'Management': t.management,
            'Chassis and Aerodynamics': t.chassisAero,
            'Suspension and Steering': t.suspensionSteering,
            'Transmission and Braking': t.transmissionBraking,
            'High Voltage': t.highVoltage,
            'Low Voltage': t.lowVoltage
        };
        
        if (deptMapping[deptName]) {
            translatedDepartment = deptMapping[deptName];
        }
        
        const defaultImage = '../assets/images/W logo.png';
        const profileImage = member.profile_picture && member.profile_picture !== 'default.jpg' ? 
            `../uploads/profiles/${member.profile_picture}` : 
            defaultImage;
        
        card.innerHTML = `
            <div class="card-inner">
                <div class="card-front">
                    <div class="member-image">
                        <img src="${profileImage}" 
                             alt="${decodeHtmlEntities(member.full_name)}"
                             loading="lazy"
                             onerror="this.src='${defaultImage}'">
                    </div>
                    <div class="member-info">
                        <h3>${decodeHtmlEntities(member.full_name)}</h3>
                        <p class="position">${translatedPosition}</p>
                        <p class="department">${translatedDepartment}</p>
                    </div>
                </div>
                <div class="card-back">
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-university"></i> ${t.faculty || 'Faculty'}</div>
                        <div class="info-value">${decodeHtmlEntities(member.faculty) || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-graduation-cap"></i> ${t.studyField}</div>
                        <div class="info-value">${decodeHtmlEntities(member.study_field) || 'N/A'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label"><i class="fas fa-sitemap"></i> ${t.department || 'Department'}</div>
                        <div class="info-value">${translatedDepartment}</div>
                    </div>
                </div>
            </div>
        `;

        // إضافة مستمعات اللمس للبطاقة
        const cardInner = card.querySelector('.card-inner');
        card.addEventListener('touchstart', handleTouchStart, false);
        card.addEventListener('touchmove', handleTouchMove, false);
        card.addEventListener('touchend', () => handleTouchEnd(card), false);

        // إضافة مستمع النقر للتفاصيل
        card.addEventListener('click', () => showMemberDetails(member));

        return card;
    }

    function showMemberDetails(member) {
        if (!modal) return;

        const t = window.getTranslations ? window.getTranslations() : {
            teamMember: 'Team Member',
            subLeader: 'Sub Leader',
            department: 'Department',
            studyField: 'Study Field',
            academicYear: 'Academic Year',
            email: 'Email',
            motivation: 'Motivation',
            marketing: 'Marketing',
            sponsorships: 'Sponsorships',
            management: 'Management',
            chassisAero: 'Chassis and Aerodynamics',
            suspensionSteering: 'Suspension and Steering',
            transmissionBraking: 'Transmission and Braking',
            highVoltage: 'High Voltage',
            lowVoltage: 'Low Voltage'
        };

        const defaultImage = '../assets/images/W logo.png';
        const modalImage = document.getElementById('modalMemberImage');
        const modalName = document.getElementById('modalMemberName');
        const modalPosition = document.getElementById('modalMemberPosition');
        const modalDepartment = document.getElementById('modalMemberDepartment');
        const modalFaculty = document.getElementById('modalMemberFaculty');
        const modalStudy = document.getElementById('modalMemberStudy');
        const modalYear = document.getElementById('modalMemberYear');
        const modalMotivation = document.getElementById('modalMemberMotivation');
        const modalEmail = document.getElementById('modalMemberEmail');

        if (modalImage) {
            const profileImage = member.profile_picture && member.profile_picture !== 'default.jpg' ?
                `../uploads/profiles/${member.profile_picture}` :
                defaultImage;
            modalImage.src = profileImage;
            modalImage.onerror = () => {
                modalImage.src = defaultImage;
            };
        }

        let position = translatePosition(member.position, member.position_en) || t.teamMember;
        if (member.role === 'sub_leader') position = t.subLeader;

        // Translate department name for modal
        const modalDeptName = member.department_name || member.department;
        const modalDeptMapping = {
            'Marketing': t.marketing || 'Marketing',
            'Sponsorships': t.sponsorships || 'Sponsorships',
            'Management': t.management || 'Management',
            'Chassis and Aerodynamics': t.chassisAero || 'Chassis and Aerodynamics',
            'Suspension and Steering': t.suspensionSteering || 'Suspension and Steering',
            'Transmission and Braking': t.transmissionBraking || 'Transmission and Braking',
            'High Voltage': t.highVoltage || 'High Voltage',
            'Low Voltage': t.lowVoltage || 'Low Voltage'
        };
        const translatedModalDept = modalDeptMapping[modalDeptName] || decodeHtmlEntities(modalDeptName) || 'N/A';

        if (modalName) modalName.textContent = decodeHtmlEntities(member.full_name);
        if (modalPosition) modalPosition.textContent = position;
        if (modalDepartment) modalDepartment.innerHTML = `<i class="fas fa-sitemap"></i> ${t.department}: ${translatedModalDept}`;
        if (modalFaculty) modalFaculty.innerHTML = `<i class="fas fa-university"></i> ${t.faculty || 'Faculty'}: ${decodeHtmlEntities(member.faculty) || 'N/A'}`;
        if (modalStudy) modalStudy.innerHTML = `<i class="fas fa-graduation-cap"></i> ${t.studyField}: ${decodeHtmlEntities(member.study_field) || 'N/A'}`;
        if (modalYear) modalYear.style.display = 'none';
        if (modalEmail) modalEmail.style.display = 'none';
        if (modalMotivation) modalMotivation.innerHTML = '';

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Back button — hide member view, scroll to leadership section
    document.querySelector('.back-btn')?.addEventListener('click', () => {
        clearActiveStates();
        currentViewTeam = null;
        currentViewDepartmentEnglish = null;
        departmentView.style.display = 'none';
        const leadershipSection = document.querySelector('.leadership-hierarchy');
        if (leadershipSection) {
            leadershipSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });

    // إغلاق النافذة المنبثقة
    document.querySelector('.close-modal')?.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // تحميل البيانات عند بدء التشغيل
    fetchTeamMembers();
    
    // Listen for language changes and update all dynamic translations
    window.addEventListener('languageChanged', function() {
        if (window.updateTeamPageContent) {
            window.updateTeamPageContent();
        }

        if (allMembers.length > 0) {
            // Rebuild the hierarchy (leader cards, sector titles, subteam boxes, buttons)
            fetchTeamMembers().then(() => {
                // If we were viewing a department/team, re-render those member cards too
                if (currentViewTeam) {
                    const translatedDept = getTranslatedDeptName(currentViewDepartmentEnglish);
                    showDepartmentMembers(currentViewTeam, translatedDept, true);
                }
            });
        }
    });
});

