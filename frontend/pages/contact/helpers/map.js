window.setupContactMap = () => {
	const mapEl = document.getElementById("map");
	if (!mapEl || typeof L === "undefined") return;

	const map = L.map(mapEl, { zoomControl: false, scrollWheelZoom: false }).setView([45.24565, 19.85045], 17);
	L.control.zoom({ position: "bottomright" }).addTo(map);

	L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
		attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
		subdomains: "abcd",
		maxZoom: 20,
	}).addTo(map);

	const icon = L.divIcon({
		className: "",
		html: '<div style="width:14px;height:14px;background:#FFD700;border-radius:50%;border:3px solid #111;box-shadow:0 0 8px rgba(255,215,0,0.8);"></div>',
		iconSize: [14, 14],
		iconAnchor: [7, 7],
	});

	L.marker([45.24565, 19.85045], { icon })
		.addTo(map)
		.bindPopup(
			'<div style="font-family:Michroma,sans-serif;text-align:center;line-height:1.5;">' +
			'<strong style="color:#FFD700;font-size:0.85rem;">Black Hornets Racing</strong><br>' +
			'<span style="font-size:0.75rem;color:#555;">Faculty of Technical Sciences<br>Novi Sad, Serbia</span>' +
			"</div>",
			{ maxWidth: 200, className: "bh-popup" },
		)
		.openPopup();
};
