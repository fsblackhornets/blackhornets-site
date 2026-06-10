document.addEventListener('DOMContentLoaded', function() {
    // تهيئة مكتبة AOS للتأثيرات
    AOS.init({
        duration: 1000,
        once: true
    });

    // تأثير تتبع المؤشر للبطاقات
    const cards = document.querySelectorAll('.tier-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = -(x - centerX) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // تحريك الأرقام الإحصائية
    const stats = document.querySelectorAll('.stat-number');
    
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    // مراقب التمرير للإحصائيات
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateValue(entry.target, 0, target, 2000);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    // تأثير الخلفية التفاعلية في Hero Section
    const heroSection = document.querySelector('.sponsors-hero');
    const heroContent = document.querySelector('.hero-content');

    heroSection.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { width, height } = heroSection.getBoundingClientRect();
        
        // حساب موقع المؤشر النسبي
        const x = (clientX / width - 0.5) * 2;
        const y = (clientY / height - 0.5) * 2;

        // تحريك العنوان
        heroContent.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
        
        // تأثير الظل
        heroContent.querySelector('h1').style.textShadow = 
            `${x * 10}px ${y * 10}px 20px rgba(255, 215, 0, 0.5)`;
    });

    // إعادة تعيين الموضع عند مغادرة المؤشر
    heroSection.addEventListener('mouseleave', () => {
        heroContent.style.transform = 'translate(0, 0)';
        heroContent.querySelector('h1').style.textShadow = 
            '0 0 20px rgba(255, 215, 0, 0.5)';
    });

    // تأثير التمرير السلس للروابط
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // تأثير توهج للبطاقات عند التمرير
    const glowObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('glow');
                setTimeout(() => {
                    entry.target.classList.remove('glow');
                }, 2000);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.tier-card').forEach(card => {
        glowObserver.observe(card);
    });

    // تحميل وعرض الداعمين من قاعدة البيانات
    loadSponsors();

    // Load brochure PDF into flipbook
    loadBrochure();

    // Reload sponsors when language changes to show correct descriptions
    window.addEventListener('languageChanged', function() {
        loadSponsors();
    });
});

// دالة تحميل الداعمين
async function loadSponsors() {
    const t = window.getTranslations ? window.getTranslations() : {
        comingSoon: 'Coming Soon',
        sponsorsComingSoon: 'We are in the process of confirming our sponsor partnerships. Stay tuned for updates!',
        errorLoadingSponsors: 'Error Loading Sponsors',
        unableToLoadSponsors: 'Unable to load sponsors at this time. Please try again later.',
        loadingSponsors: 'Loading sponsors...'
    };
    
    try {
        const response = await fetch('../api/sponsors/read.php');
        const data = await response.json();
        
        const sponsorsContainer = document.getElementById('sponsors-container');
        
        if (data.success && data.data.length > 0) {
            // تجميع الداعمين حسب الفئة
            const sponsorsByTier = groupSponsorsByTier(data.data);
            
            // عرض الداعمين
            displaySponsors(sponsorsByTier, sponsorsContainer);
        } else {
            // عرض رسالة "قريباً" إذا لم يكن هناك داعمين
            sponsorsContainer.innerHTML = `
                <div class="sponsor-category" data-aos="fade-up">
                    <div class="coming-soon-container">
                        <div class="coming-soon-text">
                            <i class="fas fa-clock"></i>
                            <h3>${t.comingSoon}</h3>
                            <p>${t.sponsorsComingSoon}</p>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading sponsors:', error);
        const sponsorsContainer = document.getElementById('sponsors-container');
        sponsorsContainer.innerHTML = `
            <div class="sponsor-category" data-aos="fade-up">
                <div class="error-container">
                    <div class="error-text">
                        <i class="fas fa-exclamation-triangle"></i>
                        <h3>${t.errorLoadingSponsors}</h3>
                        <p>${t.unableToLoadSponsors}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

// دالة تجميع الداعمين حسب الفئة
function groupSponsorsByTier(sponsors) {
    const tiers = {
        'Institucija': [],
        'F1 - Platinum': [],
        'F2 - Gold': [],
        'F3 - Silver': [],
        'F4 - Bronze': [],
        'Friends of the Project': []
    };
    
     sponsors.forEach(sponsor => {
        // تنظيف وتوحيد اسم الفئة
        const cleanTier = sponsor.tier.trim();
        
        // البحث عن الفئة المناسبة (مع مرونة في المطابقة)
        let matchedTier = null;
        
        if (cleanTier.toLowerCase().includes('institucija')) {
            matchedTier = 'Institucija';
        } else if (cleanTier.toLowerCase().includes('platinum') || cleanTier.toLowerCase().includes('f1')) {
            matchedTier = 'F1 - Platinum';
        } else if (cleanTier.toLowerCase().includes('gold') || cleanTier.toLowerCase().includes('f2')) {
            matchedTier = 'F2 - Gold';
        } else if (cleanTier.toLowerCase().includes('silver') || cleanTier.toLowerCase().includes('f3')) {
            matchedTier = 'F3 - Silver';
        } else if (cleanTier.toLowerCase().includes('bronze') || cleanTier.toLowerCase().includes('f4')) {
            matchedTier = 'F4 - Bronze';
        } else if (cleanTier.toLowerCase().includes('friends')) {
            matchedTier = 'Friends of the Project';
        }
        
        if (matchedTier) {
            tiers[matchedTier].push(sponsor);
        } else {
            // إذا لم يتم العثور على فئة مناسبة، نضيف إلى F1 - Platinum كافتراضي
            tiers['F1 - Platinum'].push(sponsor);
        }
    });
    
    return tiers;
}
// دالة عرض الداعمين
function displaySponsors(sponsorsByTier, container) {
    const t = window.getTranslations ? window.getTranslations() : {
        institutionsTier: 'Institutions',
        platinumTier: 'F1 - Platinum',
        goldTier: 'F2 - Gold',
        silverTier: 'F3 - Silver',
        bronzeTier: 'F4 - Bronze',
        friendsTier: 'Friends of the Project',
        visitWebsite: 'Visit Website'
    };

    // Map tier keys to translated names
    const tierTranslations = {
        'Institucija': t.institutionsTier,
        'F1 - Platinum': t.platinumTier,
        'F2 - Gold': t.goldTier,
        'F3 - Silver': t.silverTier,
        'F4 - Bronze': t.bronzeTier,
        'Friends of the Project': t.friendsTier
    };
    
    let html = '';
    
    Object.keys(sponsorsByTier).forEach(tier => {
        const sponsors = sponsorsByTier[tier];
        if (sponsors.length > 0) {
            const translatedTierName = tierTranslations[tier] || tier;
            html += `
                <div class="sponsor-category" data-aos="fade-up">
                    <h3 class="tier-title">${translatedTierName}</h3>
                    <div class="sponsors-list">
            `;
            
            sponsors.forEach(sponsor => {
                const logoHtml = sponsor.logo_url ?
                    `<img src="../${sponsor.logo_url}" alt="${sponsor.name}" class="sponsor-logo" onerror="console.error('Failed to load image:', this.src); this.parentElement.innerHTML='<div class=\\'sponsor-logo-placeholder\\'>${sponsor.name.charAt(0)}</div>'">` :
                    `<div class="sponsor-logo-placeholder">${sponsor.name.charAt(0)}</div>`;

                const lang = (typeof window.getCurrentLanguage === 'function') ? window.getCurrentLanguage() : (localStorage.getItem('language') || 'en');
                const desc = (lang === 'en' && sponsor.description_en) ? sponsor.description_en : (sponsor.description || '');
                const descHtml = desc ? `<p class="sponsor-description">${desc}</p>` : '';
                const websiteHtml = sponsor.website ? `<a href="${sponsor.website}" target="_blank" rel="noopener" class="sponsor-website" onclick="event.stopPropagation()"><i class="fas fa-external-link-alt"></i> ${t.visitWebsite || 'Visit Website'}</a>` : '';

                const hasHoverContent = desc || sponsor.website;
                const hoverHtml = hasHoverContent ? `
                        <div class="sponsor-hover-info">
                            <p class="sponsor-hover-name">${sponsor.name}</p>
                            ${descHtml}
                            ${websiteHtml}
                        </div>` : '';

                html += `
                    <div class="sponsor-item" data-aos="zoom-in">
                        ${logoHtml}
                        <p class="sponsor-name">${sponsor.name}</p>
                        ${hoverHtml}
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
    
}

// Current brochure download handler reference (for cleanup)
let brochureDownloadHandler = null;

// Get current language
function getBrochureLang() {
    if (typeof window.getCurrentLanguage === 'function') return window.getCurrentLanguage();
    return localStorage.getItem('language') || 'sr';
}

// Reset brochure UI to loading state
function resetBrochureUI() {
    const loadingEl = document.getElementById('brochure-loading');
    const flipbookWrapper = document.getElementById('flipbook-wrapper');
    const flipbookControls = document.getElementById('flipbook-controls');
    const downloadSection = document.getElementById('brochure-download');
    const flipbookEl = document.getElementById('flipbook');

    // Destroy Turn.js if active
    if (typeof jQuery !== 'undefined' && jQuery('#flipbook').data('turn')) {
        jQuery('#flipbook').turn('destroy');
    }

    if (flipbookEl) flipbookEl.innerHTML = '';
    if (flipbookWrapper) flipbookWrapper.style.display = 'none';
    if (flipbookControls) flipbookControls.style.display = 'none';
    if (downloadSection) downloadSection.style.display = 'none';
    if (loadingEl) {
        loadingEl.style.display = '';
        loadingEl.innerHTML = '<div class="spinner"></div><p>Loading brochure...</p>';
    }
}

// Listen for language changes and reload brochure
window.addEventListener('languageChanged', function() {
    resetBrochureUI();
    loadBrochure();
});

// Load brochure PDF and render into flipbook
async function loadBrochure() {
    const loadingEl = document.getElementById('brochure-loading');
    const flipbookWrapper = document.getElementById('flipbook-wrapper');
    const flipbookControls = document.getElementById('flipbook-controls');
    const downloadSection = document.getElementById('brochure-download');
    const downloadLink = document.getElementById('brochure-download-link');

    if (!flipbookWrapper) return;

    const lang = getBrochureLang();

    try {
        const response = await fetch('../api/brochure/read.php?lang=' + lang);
        const data = await response.json();

        if (!data.success || !data.data || !data.data.pdf_url) {
            if (loadingEl) loadingEl.innerHTML = '<p style="color:#888;">Brochure coming soon.</p>';
            return;
        }

        const pdfUrl = '../' + data.data.pdf_url;

        // Show download link
        if (downloadSection && downloadLink) {
            // Remove old handler if exists
            if (brochureDownloadHandler) {
                downloadLink.removeEventListener('click', brochureDownloadHandler);
            }
            brochureDownloadHandler = function(e) {
                e.preventDefault();
                e.stopPropagation();
                const a = document.createElement('a');
                a.href = pdfUrl;
                a.download = 'brochure_' + lang + '.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
            downloadLink.href = pdfUrl;
            downloadLink.setAttribute('download', 'brochure_' + lang + '.pdf');
            downloadLink.addEventListener('click', brochureDownloadHandler);
            downloadSection.style.display = 'block';
        }

        // Wait for PDF.js
        if (typeof pdfjsLib === 'undefined') {
            if (loadingEl) loadingEl.innerHTML = '<p style="color:#e53935;">Error loading PDF viewer.</p>';
            return;
        }

        // Load PDF
        const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
        const numPages = pdf.numPages;
        const flipbookEl = document.getElementById('flipbook');

        // Render each page to canvas, then convert to image
        for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const scale = 1.5;
            const viewport = page.getViewport({ scale: scale });

            const canvas = document.createElement('canvas');
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            const ctx = canvas.getContext('2d');

            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

            const pageDiv = document.createElement('div');
            pageDiv.className = 'page';
            const img = document.createElement('img');
            img.src = canvas.toDataURL('image/jpeg', 0.85);
            img.alt = 'Page ' + i;
            pageDiv.appendChild(img);
            flipbookEl.appendChild(pageDiv);
        }

        // Hide loading, show flipbook
        if (loadingEl) loadingEl.style.display = 'none';
        flipbookWrapper.style.display = '';
        if (flipbookControls) flipbookControls.style.display = '';

        // Wait for jQuery and Turn.js then initialize
        initFlipbookAfterLoad(numPages);

    } catch (error) {
        console.error('Error loading brochure:', error);
        if (loadingEl) loadingEl.innerHTML = '<p style="color:#e53935;">Unable to load brochure.</p>';
    }
}

function initFlipbookAfterLoad(numPages) {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.turn === 'undefined') {
        setTimeout(function() { initFlipbookAfterLoad(numPages); }, 100);
        return;
    }

    const flipbookElement = $('#flipbook');
    if (flipbookElement.length === 0) return;

    // Landscape single-page mode for landscape PDFs
    const containerWidth = Math.min($('.flipbook-container').width() - 40, 900);
    const pageHeight = Math.round(containerWidth * 9 / 16);

    flipbookElement.turn({
        width: containerWidth,
        height: pageHeight,
        autoCenter: true,
        acceleration: true,
        gradients: true,
        elevation: 50,
        duration: 1000,
        display: 'single'
    });

    $('#total-pages').text(numPages);

    flipbookElement.bind('turned', function(event, page) {
        $('#current-page').text(page);
        $('#prev-page').prop('disabled', page === 1);
        $('#next-page').prop('disabled', page === numPages);
    });

    $('#prev-page').click(function() {
        flipbookElement.turn('previous');
    });

    $('#next-page').click(function() {
        flipbookElement.turn('next');
    });

    $('#prev-page').prop('disabled', true);

    $(window).resize(function() {
        const newWidth = Math.min($('.flipbook-container').width() - 40, 900);
        const newHeight = Math.round(newWidth * 9 / 16);
        flipbookElement.turn('size', newWidth, newHeight);
    });
} 