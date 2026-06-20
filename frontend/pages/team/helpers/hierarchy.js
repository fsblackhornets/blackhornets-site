window.getTeamStructure = () => {
    const t = window.getTranslations?.() || {};
    return {
        mechanical: {
            name: t.mechanicalEngineering || 'Mechanical Engineering',
            departments: [
                t.chassisAero          || 'Chassis and Aerodynamics',
                t.suspensionSteering   || 'Suspension and Steering',
                t.transmissionBraking  || 'Transmission and Braking',
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

    if (data.team_leader) {
        hierarchyBox.appendChild(window.createLeaderCard(data.team_leader, 'Team Leader'));
    }

    const placeholderBusinessPL = {
        full_name: 'Jana Petrović',
        profile_picture: 'default.jpg',
        email: 'business@blackhornets.rs',
        study_field: 'Business Administration',
        academic_year: '4',
        motivation: '',
    };

    const sectors = [
        { key: 'operating_business', pl: data.business_project_leader || placeholderBusinessPL, label: 'Business Team',          cssClass: 'operating-business', structure: teamStructure.operating_business },
        { key: 'mechanical',         pl: data.mechanical_project_leader,                         label: 'Mechanical Engineering', cssClass: 'mechanical',         structure: teamStructure.mechanical },
        { key: 'electrical',         pl: data.electrical_project_leader,                         label: 'Electrical Engineering', cssClass: 'electrical',         structure: teamStructure.electrical },
    ];

    const sectorsContainer = document.createElement('div');
    sectorsContainer.className = 'sectors-container';

    sectors.forEach(sector => {
        const column = document.createElement('div');
        column.className = `sector-column ${sector.cssClass}`;

        const sectorTitle = document.createElement('h3');
        sectorTitle.className = 'sector-title';
        sectorTitle.textContent = sector.structure.name;
        column.appendChild(sectorTitle);

        if (sector.pl) {
            column.appendChild(window.createLeaderCard(sector.pl, 'Project Leader', sector.label));
        }

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

        const btn = document.createElement('button');
        btn.className = 'see-team-btn';
        btn.textContent = t.seeTeamMembers || 'See Team Members';
        btn.addEventListener('click', () => window.showDepartmentMembers(sector.key));
        column.appendChild(btn);

        sectorsContainer.appendChild(column);
    });

    hierarchyBox.appendChild(sectorsContainer);
};
