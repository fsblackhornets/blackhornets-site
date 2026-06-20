window.deptTransKeys = {
    'Marketing':               'marketing',
    'Sponsorships':            'sponsorships',
    'Management':              'management',
    'Chassis and Aerodynamics': 'chassisAero',
    'Suspension and Steering': 'suspensionSteering',
    'Transmission and Braking': 'transmissionBraking',
    'High Voltage':            'highVoltage',
    'Low Voltage':             'lowVoltage',
};

window.positionSrToKey = {
    'Inženjer': 'engineer', 'Dizajner': 'designer', 'CAD Inženjer': 'cad_engineer',
    'Inženjer oslanjanja': 'suspension_engineer', 'Inženjer aerodinamike': 'aerodynamics_engineer',
    'Termalni inženjer': 'thermal_engineer', 'Inženjer šasije': 'chassis_engineer',
    'Inženjer elektronike': 'electronics_engineer', 'Programer firmvera': 'firmware_developer',
    'Softverski programer': 'software_developer', 'Specijalista za baterije': 'battery_specialist',
    'PCB Dizajner': 'pcb_designer', 'Kreator sadržaja': 'content_creator',
    'Menadžer društvenih mreža': 'social_media_manager', 'Menadžer marketinga': 'marketing_manager',
    'Menadžer sponzorstava': 'sponsorship_manager', 'Koordinator događaja': 'event_coordinator',
    'Grafički dizajner': 'graphic_designer', 'Fotograf': 'photographer',
    'Finansijski analitičar': 'budget_analyst', 'Koordinator projekta': 'project_coordinator',
};

window.decodeHtmlEntities = (text) => {
    if (!text) return text;
    const textarea = document.createElement('textarea');
    textarea.innerHTML = text;
    return textarea.value;
};

window.translatePosition = (positionValue, positionEn) => {
    if (!positionValue) return null;
    const t = window.getTranslations?.() || {};
    const lang = window.getCurrentLanguage?.() || 'sr';

    const directKey = `pos_${positionValue}`;
    if (t[directKey]) return t[directKey];

    const mappedKey = window.positionSrToKey[positionValue];
    if (mappedKey && t[`pos_${mappedKey}`]) return t[`pos_${mappedKey}`];

    if (lang === 'en' && positionEn) return positionEn;

    return positionValue;
};

window.getTranslatedDeptName = (englishName) => {
    if (!englishName) return null;
    const t = window.getTranslations?.() || {};
    const key = window.deptTransKeys[englishName];
    return key ? (t[key] || englishName) : englishName;
};

window.preloadImages = (members) => {
    members.forEach(member => {
        if (member.profile_picture && member.profile_picture !== 'default.jpg') {
            const img = new Image();
            img.src = `/uploads/profiles/${member.profile_picture}`;
        }
    });
};
