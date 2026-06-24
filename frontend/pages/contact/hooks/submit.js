window.setupContactForm = () => {
	const form = document.getElementById("contactForm");
	if (!form) return;

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const btn = form.querySelector(".submit-btn");
		const orig = btn.innerHTML;
		btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
		btn.disabled = true;

		try {
			// reCAPTCHA v3 token
			if (typeof grecaptcha !== "undefined") {
				const siteKey = document
					.querySelector('script[src*="recaptcha"]')
					?.src.match(/render=([^&]+)/)?.[1];
				if (siteKey) {
					const token = await new Promise((resolve) =>
						grecaptcha.ready(() =>
							grecaptcha.execute(siteKey, { action: "contact" }).then(resolve),
						),
					);
					document.getElementById("recaptcha_token").value = token;
				}
			}

			const formData = new FormData();
			formData.append("name", form.querySelector("#name").value);
			formData.append("email", form.querySelector("#email").value);
			formData.append("subject", form.querySelector("#subject").value);
			formData.append("message", form.querySelector("#message").value);
			formData.append(
				"website_url",
				form.querySelector("#website_url")?.value || "",
			);
			formData.append(
				"recaptcha_token",
				document.getElementById("recaptcha_token")?.value || "",
			);

			await window.apiReady;
			const data = await window.API.contact.send(formData);

			if (data.status === "success") {
				window.showFormMessage(`
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i> ${data.message}
                    </div>`);
				form.reset();
			} else {
				window.showFormMessage(`
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i> ${data.message}
                    </div>`);
			}
		} catch (err) {
			console.error("Contact form error:", err);
			window.showFormMessage(`
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    ${err.message || "An error occurred. Please try again later."}
                </div>`);
		} finally {
			btn.innerHTML = orig;
			btn.disabled = false;
		}
	});
};
