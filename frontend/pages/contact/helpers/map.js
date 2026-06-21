window.setupContactMap = () => {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    mapEl.innerHTML = `<iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2809.0836556467316!2d19.84682588665857!3d45.246101096480615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475b100d462acd9f%3A0x6c6724453c8b1fc6!2sFaculty%20of%20Technical%20Sciences!5e0!3m2!1sen!2srs!4v1763596953471!5m2!1sen!2srs"
        width="600" height="450"
        style="border:0;width:100%;height:100%;"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>`;
};
