window.setupContactMap = () => {
	const mapEl = document.getElementById("map");
	if (!mapEl) return;

	mapEl.innerHTML = `<iframe
        src="https://www.google.com/maps?q=45.24514145239378,19.851080151508224&t=k&z=19&output=embed"
        width="600" height="450"
        style="border:0;width:100%;height:100%;"
        allowfullscreen loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
    </iframe>`;
};
