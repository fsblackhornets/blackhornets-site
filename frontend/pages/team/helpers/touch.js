window._teamTouch = { startX: 0, endX: 0 };

window.handleTouchStart = (e) => {
    window._teamTouch.startX = e.touches[0].clientX;
};

window.handleTouchMove = (e) => {
    window._teamTouch.endX = e.touches[0].clientX;
};

window.handleTouchEnd = (card) => {
    const dist = window._teamTouch.endX - window._teamTouch.startX;
    if (Math.abs(dist) > 50) {
        card.querySelector('.card-inner').style.transform = dist > 0 ? 'rotateY(0deg)' : 'rotateY(180deg)';
    }
};
