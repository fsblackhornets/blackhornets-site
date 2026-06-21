window.brochureDownloadHandler = null;

window.getBrochureLang = () =>
    window.getCurrentLanguage?.() || localStorage.getItem('language') || 'sr';

window.resetBrochureUI = () => {
    const flipbookEl = document.getElementById('flipbook');
    if (typeof jQuery !== 'undefined' && jQuery('#flipbook').data('turn')) {
        jQuery('#flipbook').turn('destroy');
    }
    if (flipbookEl) flipbookEl.innerHTML = '';

    const ids = { w: 'flipbook-wrapper', c: 'flipbook-controls', d: 'brochure-download', l: 'brochure-loading' };
    document.getElementById(ids.w)?.style.setProperty('display', 'none');
    document.getElementById(ids.c)?.style.setProperty('display', 'none');
    document.getElementById(ids.d)?.style.setProperty('display', 'none');
    const loadingEl = document.getElementById(ids.l);
    if (loadingEl) {
        loadingEl.style.display = '';
        loadingEl.innerHTML = '<div class="spinner"></div><p>Loading brochure...</p>';
    }
};

window.initFlipbook = (numPages) => {
    if (typeof jQuery === 'undefined' || typeof jQuery.fn.turn === 'undefined') {
        setTimeout(() => window.initFlipbook(numPages), 100);
        return;
    }

    const flipbookEl = jQuery('#flipbook');
    if (!flipbookEl.length) return;

    const containerWidth = Math.min(jQuery('.flipbook-container').width() - 40, 900);
    const pageHeight     = Math.round(containerWidth * 9 / 16);

    flipbookEl.turn({
        width: containerWidth, height: pageHeight,
        autoCenter: true, acceleration: true, gradients: true,
        elevation: 50, duration: 1000, display: 'single',
    });

    jQuery('#total-pages').text(numPages);

    flipbookEl.bind('turned', (event, page) => {
        jQuery('#current-page').text(page);
        jQuery('#prev-page').prop('disabled', page === 1);
        jQuery('#next-page').prop('disabled', page === numPages);
    });

    jQuery('#prev-page').click(() => flipbookEl.turn('previous'));
    jQuery('#next-page').click(() => flipbookEl.turn('next'));
    jQuery('#prev-page').prop('disabled', true);

    jQuery(window).resize(() => {
        const w = Math.min(jQuery('.flipbook-container').width() - 40, 900);
        flipbookEl.turn('size', w, Math.round(w * 9 / 16));
    });
};
