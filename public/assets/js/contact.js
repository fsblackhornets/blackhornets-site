document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Maps iframe
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        mapContainer.innerHTML = '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2809.0836556467316!2d19.84682588665857!3d45.246101096480615!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475b100d462acd9f%3A0x6c6724453c8b1fc6!2sFaculty%20of%20Technical%20Sciences!5e0!3m2!1sen!2srs!4v1763596953471!5m2!1sen!2srs" width="600" height="450" style="border:0; width:100%; height:100%;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
    }

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Add loading state
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            try {
                // Get reCAPTCHA v3 token
                if (typeof grecaptcha !== 'undefined') {
                    const siteKey = document.querySelector('script[src*="recaptcha"]')?.src.match(/render=([^&]+)/)?.[1];
                    if (siteKey) {
                        const token = await new Promise((resolve) => {
                            grecaptcha.ready(function() {
                                grecaptcha.execute(siteKey, {action: 'contact'}).then(resolve);
                            });
                        });
                        document.getElementById('recaptcha_token').value = token;
                    }
                }

                const formData = new FormData();
                formData.append('name', this.querySelector('#name').value);
                formData.append('email', this.querySelector('#email').value);
                formData.append('subject', this.querySelector('#subject').value);
                formData.append('message', this.querySelector('#message').value);
                formData.append('website_url', this.querySelector('#website_url')?.value || '');
                formData.append('recaptcha_token', document.getElementById('recaptcha_token')?.value || '');

                const response = await fetch('../contact.php', {
                    method: 'POST',
                    body: formData
                });

                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error('Server returned non-JSON response');
                }

                const data = await response.json();
                const messageDiv = document.getElementById('formMessage');

                if (data.status === 'success') {
                    messageDiv.innerHTML = `
                        <div class="success-message">
                            <i class="fas fa-check-circle"></i>
                            ${data.message}
                        </div>`;
                    contactForm.reset();
                } else {
                    messageDiv.innerHTML = `
                        <div class="error-message">
                            <i class="fas fa-exclamation-circle"></i>
                            ${data.message}
                        </div>`;
                }

            } catch (error) {
                console.error('Error:', error);
                document.getElementById('formMessage').innerHTML = `
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        ${error.message || 'An error occurred. Please try again later.'}
                    </div>`;
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                const messageDiv = document.getElementById('formMessage');
                messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(faq => faq.classList.remove('active'));
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Form Input Animation
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
    });

});