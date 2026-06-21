// DEPT_TRANS_KEYS and POSITION_SR_TO_KEY loaded from frontend/constants/positions.js
// Expose as old names for backward compatibility
window.deptTransKeys    = window.DEPT_TRANS_KEYS    || {};
window.positionSrToKey  = window.POSITION_SR_TO_KEY || {};

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
