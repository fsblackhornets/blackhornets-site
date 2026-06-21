// SPONSOR_TIERS and TIER_KEYWORDS loaded from frontend/constants/sponsors.js

window.groupSponsorsByTier = (sponsors) => {
    const tiers = {};
    (window.SPONSOR_TIERS || []).forEach(t => { tiers[t] = []; });

    sponsors.forEach(sponsor => {
        const raw = sponsor.tier.trim().toLowerCase();
        const match = (window.TIER_KEYWORDS || []).find(rule =>
            rule.keywords.some(kw => raw.includes(kw))
        );
        const key = match ? match.tier : 'F1 - Platinum';
        if (tiers[key]) tiers[key].push(sponsor);
    });

    return tiers;
};

window.displaySponsors = (sponsorsByTier, container) => {
    const t = window.getTranslations?.() || {};
    const lang = window.getCurrentLanguage?.() || localStorage.getItem('language') || 'en';

    const tierNames = {
        'Institucija':            t.institutionsTier  || 'Institutions',
        'F1 - Platinum':          t.platinumTier      || 'F1 - Platinum',
        'F2 - Gold':              t.goldTier          || 'F2 - Gold',
        'F3 - Silver':            t.silverTier        || 'F3 - Silver',
        'F4 - Bronze':            t.bronzeTier        || 'F4 - Bronze',
        'Friends of the Project': t.friendsTier       || 'Friends of the Project',
    };

    let html = '';

    Object.keys(sponsorsByTier).forEach(tier => {
        const sponsors = sponsorsByTier[tier];
        if (!sponsors.length) return;

        html += `<div class="sponsor-category" data-aos="fade-up">
            <h3 class="tier-title">${tierNames[tier] || tier}</h3>
            <div class="sponsors-list">`;

        sponsors.forEach(sponsor => {
            const logoHtml = sponsor.logo_url
                ? `<img src="/frontend/${sponsor.logo_url}" alt="${sponsor.name}" class="sponsor-logo"
                       onerror="this.parentElement.innerHTML='<div class=\\'sponsor-logo-placeholder\\'>${sponsor.name.charAt(0)}</div>'">`
                : `<div class="sponsor-logo-placeholder">${sponsor.name.charAt(0)}</div>`;

            const desc       = (lang === 'en' && sponsor.description_en) ? sponsor.description_en : (sponsor.description || '');
            const descHtml   = desc             ? `<p class="sponsor-description">${desc}</p>` : '';
            const websiteHtml = sponsor.website ? `<a href="${sponsor.website}" target="_blank" rel="noopener" class="sponsor-website" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> ${t.visitWebsite || 'Visit Website'}</a>` : '';
            const hoverHtml  = (desc || sponsor.website) ? `<div class="sponsor-hover-info"><p class="sponsor-hover-name">${sponsor.name}</p>${descHtml}${websiteHtml}</div>` : '';

            html += `<div class="sponsor-item" data-aos="zoom-in">${logoHtml}<p class="sponsor-name">${sponsor.name}</p>${hoverHtml}</div>`;
        });

        html += `</div></div>`;
    });

    container.innerHTML = html;
};
