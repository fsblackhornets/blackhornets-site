window.showApplyMessage = (html) => {
	const div = document.getElementById("formMessage");
	if (!div) return;
	div.innerHTML = html;
	div.style.display = "block";
	div.scrollIntoView({ behavior: "smooth", block: "nearest" });
};

window.showApplySuccess = (message) => {
	window.showApplyMessage(`
        <div class="success-notification">
            <div class="success-icon"><i class="fas fa-check-circle"></i></div>
            <div class="success-content">
                <h3>Application Submitted Successfully!</h3>
                <p>${message}</p>
                <p>Thank you for your interest in joining our team.</p>
            </div>
        </div>`);
};

window.setupFileUpload = () => {
	const input = document.getElementById("resume");
	const nameSpan = document.getElementById("file-name");
	if (!input || !nameSpan) return;

	input.addEventListener("change", () => {
		if (input.files?.[0]) {
			nameSpan.textContent = input.files[0].name;
			nameSpan.style.color = "var(--primary-color)";
		} else {
			nameSpan.textContent = "No file chosen";
			nameSpan.style.color = "";
		}
	});
};
