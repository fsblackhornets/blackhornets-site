window.setupContactMap = () => {
    const mapEl = document.getElementById('map');
    if (!mapEl || typeof L === 'undefined') return;

    // Coordinates: Laboratorija za monitoring životne sredine, FTN Novi Sad
    const LAB_COORDS  = [45.2447, 19.8458];
    const PARK_COORDS = [45.2451, 19.8453];

    const map = L.map('map', {
        center: LAB_COORDS,
        zoom: 17,
        scrollWheelZoom: false,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
        maxZoom: 19,
    }).addTo(map);

    // Custom gold pin icon
    const goldIcon = L.divIcon({
        className: '',
        html: `<div style="
            width:32px;height:40px;position:relative;
        ">
            <svg viewBox="0 0 32 40" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 0C9.37 0 4 5.37 4 12c0 9 12 28 12 28S28 21 28 12C28 5.37 22.63 0 16 0z"
                      fill="#FFD700" stroke="#cc9900" stroke-width="1.5"/>
                <circle cx="16" cy="12" r="5" fill="#1a1a1a"/>
            </svg>
        </div>`,
        iconSize: [32, 40],
        iconAnchor: [16, 40],
        popupAnchor: [0, -40],
    });

    // Parking icon
    const parkIcon = L.divIcon({
        className: '',
        html: `<div style="
            width:28px;height:28px;background:#2196F3;border-radius:6px;
            display:flex;align-items:center;justify-content:center;
            font-family:Arial,sans-serif;font-weight:bold;font-size:16px;color:#fff;
            border:2px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.5);
        ">P</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
    });

    L.marker(LAB_COORDS, { icon: goldIcon })
        .addTo(map)
        .bindPopup('<b>Black Hornets Racing</b><br>Laboratorija za monitoring životne i.<br>FTN, Novi Sad')
        .openPopup();

    L.marker(PARK_COORDS, { icon: parkIcon })
        .addTo(map)
        .bindPopup('<b>Parking</b>');
};
