window.loadGalleryImages = async (category, gridId) => {
    try {
        await window.apiReady;
        const data = await window.API.gallery.getByCategory(category);
        window.renderGalleryGrid(data, gridId);
    } catch (error) {
        console.error(`Gallery fetch error [${category}]:`, error);
        window.renderGalleryError(gridId);
    }
};

window.reloadAllGallery = () => {
    window.allGalleryImages  = [];
    window.currentImageIndex = -1;
    window.loadGalleryImages('race_cars', 'race-cars-grid');
    window.loadGalleryImages('team',      'team-grid');
    window.loadGalleryImages('events',    'events-grid');
    window.loadGalleryImages('workshop',  'workshop-grid');
};
