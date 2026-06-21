window.setupContactMap = () => {
	const mapEl = document.getElementById("map");
	if (!mapEl) return;

	mapEl.innerHTML = `<iframe
        src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d1221.2460984893037!2d19.851080151508224!3d45.24514145239378!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2srs!4v1782072795078!5m2!1sen!2srs"
        width="600" height="450"
        style="border:0;width:100%;height:100%;"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>`;
};
