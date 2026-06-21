window.setupApplyForm = () => {
    const form = document.getElementById('applyForm');
    if (!form) return;

    form.onsubmit = () => false;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const btn  = form.querySelector('.submit-btn');
        const orig = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled  = true;

        try {
            window.validateApplyForm?.(form);

            // reCAPTCHA v3
            if (typeof grecaptcha !== 'undefined') {
                const siteKey = document.querySelector('script[src*="recaptcha"]')
                    ?.src.match(/render=([^&]+)/)?.[1];
                if (siteKey) {
                    const token = await new Promise(resolve =>
                        grecaptcha.ready(() => grecaptcha.execute(siteKey, { action: 'apply' }).then(resolve))
                    );
                    document.getElementById('recaptcha_token').value = token;
                }
            }

            const formData = new FormData(form);

            await window.apiReady;
            const data = await window.API.applications.submit(formData);

            if (data.status === 'success') {
                window.showApplySuccess?.(data.message);
                form.reset();
                document.getElementById('file-name').textContent = 'No file chosen';
            } else {
                throw new Error(data.message);
            }

        } catch (err) {
            console.error('Apply error:', err);
            window.showApplyMessage?.(`
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    ${err.message || 'An error occurred. Please try again later.'}
                </div>`);
        } finally {
            btn.innerHTML = orig;
            btn.disabled  = false;
        }
    });
};
