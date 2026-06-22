window.loadFooter = () => {
	const footer = document.querySelector("footer");
	if (!footer) return;

	footer.classList.add("footer");

	const imagePath = window.getImagePath?.();
	const t = window.getTranslations?.();
	const r = window.ROUTES;

	footer.innerHTML = `
        <div class="footer-waves">
            <div class="wave" id="wave1"></div>
            <div class="wave" id="wave2"></div>
        </div>

        <div class="footer-content">
            <div class="footer-section brand">
                <img src="${imagePath}Tipografija_belo.png" alt="Black Hornets Logo" class="footer-logo">
                <div class="social-links">
                    <a href="https://www.facebook.com" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://www.instagram.com/blackhornets.ns/" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-instagram"></i></a>
                    <a href="https://www.linkedin.com" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-linkedin-in"></i></a>
                    <a href="https://www.youtube.com" target="_blank" rel="noopener" class="social-btn"><i class="fab fa-youtube"></i></a>
                </div>
            </div>

            <div class="footer-section links">
                <h3>${t.quickLinks}</h3>
                <div class="link-grid">
                    <a href="${r.about}" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.about}</a>
                    <a href="${r.projects}" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.projects}</a>
                    <a href="${r.team}" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.team}</a>
                    <a href="${r.gallery}" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.gallery}</a>
                    <a href="${r.sponsors}" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.sponsors}</a>
                    <a href="${r.contact}" class="footer-link"><i class="fas fa-chevron-right"></i> ${t.contact}</a>
                </div>
            </div>

            <div class="footer-section contact">
                <h3>${t.contactUs}</h3>
                <div class="contact-info">
                    <a href="https://maps.google.com/?q=Faculty+of+Technical+Sciences+Novi+Sad" target="_blank" rel="noopener" class="contact-item"><i class="fas fa-map-marker-alt"></i> <span>Univerzitet u Novom Sadu, Srbija</span></a>
                    <a href="mailto:formulastudentftn@gmail.com" class="contact-item"><i class="fas fa-envelope"></i> <span>formulastudentftn@gmail.com</span></a>
                    <a href="tel:+381627825688" class="contact-item"><i class="fas fa-phone"></i> <span>+381 62 782 568</span></a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="copyright">
                <p>&copy; 2024 Black Hornets Racing</p>
                <span class="separator">|</span>
                <p>Powered by CodeHive</p>
            </div>
        </div>
    `;
};
