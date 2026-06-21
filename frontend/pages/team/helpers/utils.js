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
    'Softverski programer': 'software_developer', 'Specijalista za baterije': 'battery_specialist',
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
