window.TEAM_COLOR_CLASS = {
    mechanical:         'team--mechanical',
    electrical:         'team--electrical',
    operating_business: 'team--business',
};

window.DEPT_TO_TEAM = {
    'Mechanical Engineering': 'mechanical',
    'Electrical Engineering': 'electrical',
    'Business Team':          'operating_business',
};

window.buildCardElement = (person, { positionLabel, positionClass = '', team = '', departmentLabel = '', t }) => {
    const defaultImage = '/frontend/assets/images/W logo.png';
    const profileImage = person.profile_picture && person.profile_picture !== 'default.jpg'
        ? `/uploads/profiles/${person.profile_picture}`
        : defaultImage;

    const teamClass = window.TEAM_COLOR_CLASS[team] || '';
    const card = document.createElement('div');
    card.className = ['member-card', positionClass, teamClass].filter(Boolean).join(' ');

    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <div class="member-image">
                    <img src="${profileImage}" alt="${window.decodeHtmlEntities(person.full_name)}" loading="lazy" onerror="this.src='${defaultImage}'">
                </div>
                <div class="member-info">
                    <h3>${window.decodeHtmlEntities(person.full_name)}</h3>
                    <p class="position">${positionLabel}</p>
                    ${departmentLabel ? `<p class="department">${departmentLabel}</p>` : ''}
                </div>
            </div>
            <div class="card-back">
                <div class="info-item">
                    <div class="info-label"><i class="fas fa-university"></i> ${t.faculty || 'Faculty'}</div>
                    <div class="info-value">${window.decodeHtmlEntities(person.faculty) || 'N/A'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label"><i class="fas fa-graduation-cap"></i> ${t.studyField || 'Study Field'}</div>
                    <div class="info-value">${window.decodeHtmlEntities(person.study_field) || 'N/A'}</div>
                </div>
                ${departmentLabel ? `<div class="info-item">
                    <div class="info-label"><i class="fas fa-sitemap"></i> ${t.department || 'Department'}</div>
                    <div class="info-value">${departmentLabel}</div>
                </div>` : ''}
            </div>
        </div>
    `;

    card.addEventListener('touchstart', window.handleTouchStart, false);
    card.addEventListener('touchmove', window.handleTouchMove, false);
    card.addEventListener('touchend', () => window.handleTouchEnd(card), false);
    card.addEventListener('click', () => window.showMemberDetails(person));

    return card;
};

window.createLeaderCard = (leader, position, department = '') => {
    const t = window.getTranslations?.() || {};

    const positionLabel = position === 'Team Leader'    ? (t.teamLeader    || position)
                        : position === 'Project Leader' ? (t.projectLeader || position)
                        : position === 'Sub Leader'     ? (t.subLeader     || position)
                        : position;

    const departmentLabel = department === 'Mechanical Engineering' ? (t.mechanicalEngineering || department)
                          : department === 'Electrical Engineering'  ? (t.electricalEngineering  || department)
                          : department === 'Business Team'           ? (t.businessTeam           || department)
                          : department;

    const positionClass = position === 'Project Leader' ? 'project-leader-card'
                        : position === 'Team Leader'    ? 'team-leader-card'
                        : position === 'Sub Leader'     ? 'sub-leader-card'
                        : '';

    const card = window.buildCardElement(leader, {
        positionLabel,
        positionClass,
        team: window.DEPT_TO_TEAM[department] || '',
        departmentLabel,
        t,
    });

    const wrapper = document.createElement('div');
    wrapper.className = 'leader-position';
    wrapper.appendChild(card);
    return wrapper;
};

window.createMemberCard = (member) => {
    const t = window.getTranslations?.() || {};

    const positionClass = member.role === 'sub_leader' ? 'sub-leader-card' : '';

    const positionLabel = member.role === 'sub_leader'
        ? (t.subLeader || 'Sub Leader')
        : (window.translatePosition(member.position, member.position_en) || t.teamMember || 'Team Member');

    const deptName = member.department_name || member.department || '';
    const deptMapping = {
        'Marketing':               t.marketing,
        'Sponsorships':            t.sponsorships,
        'Management':              t.management,
        'Chassis and Aerodynamics': t.chassisAero,
        'Suspension and Steering': t.suspensionSteering,
        'Transmission and Braking': t.transmissionBraking,
        'High Voltage':            t.highVoltage,
        'Low Voltage':             t.lowVoltage,
    };
    const departmentLabel = deptMapping[deptName] || window.decodeHtmlEntities(deptName);

    const team = member.team === 'bot' ? 'operating_business' : (member.team || '');

    return window.buildCardElement(member, { positionLabel, positionClass, team, departmentLabel, t });
};
