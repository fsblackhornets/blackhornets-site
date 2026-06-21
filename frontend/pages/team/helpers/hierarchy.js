window.getTeamStructure = () => {
    const t = window.getTranslations?.() || {};
    return {
        mechanical: {
            name: t.mechanicalEngineering || 'Mechanical Engineering',
            departments: [
                t.chassisAero         || 'Chassis and Aerodynamics',
                t.suspensionSteering  || 'Suspension and Steering',
                t.transmissionBraking || 'Transmission and Braking',
            ],
        },
        electrical: {
            name: t.electricalEngineering || 'Electrical Engineering',
            departments: [
                t.highVoltage || 'High Voltage',
                t.lowVoltage  || 'Low Voltage',
            ],
        },
        operating_business: {
            name: t.businessTeam || 'Business Team',
            departments: [
                t.marketing    || 'Marketing',
                t.sponsorships || 'Sponsorships',
                t.management   || 'Management',
            ],
        },
    };
};

window.updateLeadershipStructure = (data) => {
    const hierarchyBox = document.querySelector('.hierarchy-box');
    if (!hierarchyBox) return;

    hierarchyBox.innerHTML = '';

    const orgStructure = document.querySelector('.org-structure');
    if (orgStructure) orgStructure.style.display = 'none';

    const t = window.getTranslations?.() || {};
    const teamStructure = window.getTeamStructure();

    // Team Leader at top
    if (data.team_leader) {
        hierarchyBox.appendChild(window.createLeaderCard(data.team_leader, 'Team Leader'));
    }

    // Get sub_leaders grouped by team from allTeamMembers
    const allMembers = window.allTeamMembers || [];
    const subLeadersByTeam = {};
    allMembers.filter(m => m.role === 'sub_leader').forEach(m => {
        const team = m.team || 'unknown';
        if (!subLeadersByTeam[team]) subLeadersByTeam[team] = [];
        subLeadersByTeam[team].push(m);
    });

    const sectors = [
        { key: 'operating_business', pl: data.business_project_leader,  label: 'Business Team',          cssClass: 'operating-business', structure: teamStructure.operating_business },
        { key: 'mechanical',         pl: data.mechanical_project_leader, label: 'Mechanical Engineering', cssClass: 'mechanical',         structure: teamStructure.mechanical },
        { key: 'electrical',         pl: data.electrical_project_leader, label: 'Electrical Engineering', cssClass: 'electrical',         structure: teamStructure.electrical },
    ];

    const sectorsContainer = document.createElement('div');
    sectorsContainer.className = 'sectors-container';

    sectors.forEach(sector => {
        const column = document.createElement('div');
        column.className = `sector-column ${sector.cssClass}`;

        // Team name title
        const sectorTitle = document.createElement('h3');
        sectorTitle.className = 'sector-title';
        sectorTitle.textContent = sector.structure.name;
        column.appendChild(sectorTitle);

        // Project Leader card
        if (sector.pl) {
            column.appendChild(window.createLeaderCard(sector.pl, 'Project Leader', sector.label));
        }

        // Sub Leaders for this team
        const subs = subLeadersByTeam[sector.key] || [];
        if (subs.length > 0) {
            const subRow = document.createElement('div');
            subRow.className = 'subteams-row';

            subs.forEach(sub => {
                const item = document.createElement('div');
                item.className = 'subteam-item';

                // Sub leader card (clickable — shows their dept members)
                const card = window.createLeaderCard(sub, 'Sub Leader', sub.department_name || sub.department || '');
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => window.showDepartmentMembers(sector.key, sub.department_name || sub.department));
                item.appendChild(card);

                subRow.appendChild(item);
            });

            column.appendChild(subRow);
        } else {
            // Fallback: department boxes if no sub leaders
            const subteamsRow = document.createElement('div');
            subteamsRow.className = 'subteams-row';
            sector.structure.departments.forEach(subteamName => {
                const item = document.createElement('div');
                item.className = 'subteam-item';
                const box = document.createElement('div');
                box.className = 'subteam-box';
                box.textContent = subteamName;
                box.addEventListener('click', () => window.showDepartmentMembers(sector.key, subteamName));
                item.appendChild(box);
                subteamsRow.appendChild(item);
            });
            column.appendChild(subteamsRow);
        }

        // See All Members button
        const btn = document.createElement('button');
        btn.className = 'see-team-btn';
        btn.textContent = t.seeTeamMembers || 'See Team Members';
        btn.addEventListener('click', () => window.showDepartmentMembers(sector.key));
        column.appendChild(btn);

        sectorsContainer.appendChild(column);
    });

    hierarchyBox.appendChild(sectorsContainer);
};
