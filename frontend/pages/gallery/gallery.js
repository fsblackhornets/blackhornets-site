// HTML escape helper to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Store all loaded images for navigation
let allGalleryImages = [];
let currentImageIndex = -1;

document.addEventListener('DOMContentLoaded', function() {
    // Load images for all gallery sections
    loadGalleryImages('race_cars', 'race-cars-grid');
    loadGalleryImages('team', 'team-grid');
    loadGalleryImages('events', 'events-grid');
    loadGalleryImages('workshop', 'workshop-grid');

    // Modal close handlers
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.querySelector('.close-modal').addEventListener('click', closeGalleryModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeGalleryModal();
        });
    }

    // Nav buttons
    const prevBtn = document.getElementById('galleryModalPrev');
    const nextBtn = document.getElementById('galleryModalNext');
    if (prevBtn) prevBtn.addEventListener('click', function(e) { e.stopPropagation(); navigateGallery(-1); });
    if (nextBtn) nextBtn.addEventListener('click', function(e) { e.stopPropagation(); navigateGallery(1); });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        const modal = document.getElementById('galleryModal');
        if (!modal || modal.style.display !== 'flex') return;
        if (e.key === 'Escape') closeGalleryModal();
        if (e.key === 'ArrowLeft') navigateGallery(-1);
        if (e.key === 'ArrowRight') navigateGallery(1);
    });

    // Reload gallery when language changes to show correct descriptions
    window.addEventListener('languageChanged', function() {
        allGalleryImages = [];
        currentImageIndex = -1;
        loadGalleryImages('race_cars', 'race-cars-grid');
        loadGalleryImages('team', 'team-grid');
        loadGalleryImages('events', 'events-grid');
        loadGalleryImages('workshop', 'workshop-grid');
    });
});

function getGalleryTranslations() {
    if (typeof window.getTranslations === 'function') {
        return window.getTranslations();
    }
    return null;
}

function getLang() {
    if (typeof window.getCurrentLanguage === 'function') {
        return window.getCurrentLanguage();
    }
    return localStorage.getItem('language') || 'en';
}

function getCategoryName(category) {
    const t = getGalleryTranslations();
    if (t) {
        const map = {
            'race_cars': t.categoryRaceCars,
            'team': t.categoryTeam,
            'events': t.categoryEvents,
            'workshop': t.categoryWorkshop
        };
        if (map[category]) return map[category];
    }
    const fallback = {
        'race_cars': 'Race Cars',
        'team': 'Team',
        'events': 'Events & Competitions',
        'workshop': 'Workshop'
    };
    return fallback[category] || category;
}

function getImageDescription(image) {
    const lang = getLang();
    if (lang === 'en' && image.description_en) {
        return image.description_en;
    }
    return image.description || '';
}

async function loadGalleryImages(category, gridId) {
    const grid = document.getElementById(gridId);
    if (!grid) return;

    try {
        await window.apiReady;
        const data = await window.API.gallery.getByCategory(category);

            if (data.success && data.data.length > 0) {
                grid.innerHTML = '';
                data.data.forEach((image) => {
                    const imagePath = image.image_path
                        ? `/frontend/admin/${image.image_path}`
                        : '';

                    // Store for navigation
                    const entry = { image, imagePath };
                    allGalleryImages.push(entry);
                    const entryIndex = allGalleryImages.length - 1;

                    const desc = getImageDescription(image);
                    const item = document.createElement('div');
                    item.className = 'gallery-item';
                    item.innerHTML = `
                        <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(image.alt_text || image.title)}" loading="lazy">
                        <div class="gallery-item-info">
                            <h3 class="gallery-item-title">${escapeHtml(image.title)}</h3>
                            <p class="gallery-item-description">${escapeHtml(desc)}</p>
                        </div>
                    `;

                    item.addEventListener('click', function() {
                        currentImageIndex = entryIndex;
                        showGalleryDetail(image, imagePath);
                    });

                    grid.appendChild(item);
                });
            } else {
                const t = getGalleryTranslations();
                grid.innerHTML = `
                    <div class="gallery-item placeholder">
                        <div class="placeholder-content">
                            <i class="fas fa-image"></i>
                            <p>${t ? t.noImagesAvailable : 'No images available'}</p>
                        </div>
                    </div>
                `;
            }
    } catch (error) {
        console.error(`Error loading gallery images for [${category}]:`, error);
        const t = getGalleryTranslations();
        grid.innerHTML = `
            <div class="gallery-item placeholder">
                <div class="placeholder-content">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${t ? t.errorLoadingImages : 'Error loading images'}</p>
                </div>
            </div>
        `;
    }
}

function navigateGallery(direction) {
    if (allGalleryImages.length === 0) return;

    currentImageIndex += direction;
    if (currentImageIndex < 0) currentImageIndex = allGalleryImages.length - 1;
    if (currentImageIndex >= allGalleryImages.length) currentImageIndex = 0;

    const entry = allGalleryImages[currentImageIndex];
    showGalleryDetail(entry.image, entry.imagePath);
}

function showGalleryDetail(image, imagePath) {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;

    const t = getGalleryTranslations();
    const lang = getLang();

    // Set image
    document.getElementById('galleryModalImage').src = imagePath;
    document.getElementById('galleryModalImage').alt = image.alt_text || image.title;

    // Set title
    document.getElementById('galleryModalTitle').textContent = image.title;

    // Set category with label
    const categoryLabel = t ? t.galleryCategory : 'Category';
    const categoryName = getCategoryName(image.category);
    document.getElementById('galleryModalCategory').innerHTML =
        `<i class="fas fa-tag"></i> <span>${categoryLabel}: ${categoryName}</span>`;

    // Set date with locale
    const dateLabel = t ? t.galleryDate : 'Added';
    const date = new Date(image.created_at);
    const locale = lang === 'sr' ? 'sr-Latn-RS' : 'en-US';
    const formattedDate = date.toLocaleDateString(locale, {
        year: 'numeric', month: 'long', day: 'numeric'
    });
    document.getElementById('galleryModalDate').innerHTML =
        `<i class="fas fa-calendar-alt"></i> <span>${dateLabel}: ${formattedDate}</span>`;

    // Set description based on language
    const descEl = document.getElementById('galleryModalDescription');
    descEl.textContent = getImageDescription(image);

    // Update nav button visibility
    const prevBtn = document.getElementById('galleryModalPrev');
    const nextBtn = document.getElementById('galleryModalNext');
    if (prevBtn) prevBtn.style.display = allGalleryImages.length > 1 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = allGalleryImages.length > 1 ? 'flex' : 'none';

    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}
