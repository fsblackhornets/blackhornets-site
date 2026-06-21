document.addEventListener('DOMContentLoaded', function() {
    const applyForm = document.getElementById('applyForm');
    const fileInput = document.getElementById('resume');
    const formMessage = document.getElementById('formMessage');

    if (applyForm) {
        // Add a strongly-enforced event prevention 
        applyForm.onsubmit = function() { return false; };
        
        applyForm.addEventListener('submit', async function(e) {
            // Prevent default multiple times to ensure it works
            e.preventDefault();
            e.stopPropagation();
            
            try {
                const requiredFields = {
                    'firstName': 'First Name',
                    'lastName': 'Last Name',
                    'email': 'Email',
                    'phone': 'Phone Number',
                    'studentId': 'Student ID',
                    'faculty': 'Faculty',
                    'major': 'Major',
                    'academic_year': 'Academic Year',
                    'gpa': 'GPA',
                    'position': 'Desired Position',
                    'motivation': 'Motivation'
                };

                for (const [fieldId, fieldName] of Object.entries(requiredFields)) {
                    const field = document.getElementById(fieldId);
                    if (!field || !field.value.trim()) {
                        throw new Error(`${fieldName} is required`);
                    }
                }

                const file = fileInput.files[0];
                if (!file) {
                    throw new Error('Please select a resume file');
                }

                if (file.type !== 'application/pdf') {
                    throw new Error('Please upload a PDF file only');
                }

                if (file.size > 5 * 1024 * 1024) {
                    throw new Error('File size should be less than 5MB');
                }

                // Get reCAPTCHA v3 token
                if (typeof grecaptcha !== 'undefined') {
                    const siteKey = document.querySelector('script[src*="recaptcha"]')?.src.match(/render=([^&]+)/)?.[1];
                    if (siteKey) {
                        const token = await new Promise((resolve) => {
                            grecaptcha.ready(function() {
                                grecaptcha.execute(siteKey, {action: 'apply'}).then(resolve);
                            });
                        });
                        document.getElementById('recaptcha_token').value = token;
                    }
                }

                const submitBtn = this.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                const formData = new FormData(this);
                const response = await fetch('/frontend/apply.php', {
                    method: 'POST',
                    body: formData
                });

                // Check if response is actually JSON
                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    console.error('Server returned non-JSON response:', text.substring(0, 500));
                    throw new Error('Server error. Please check the console for details.');
                }

                const data = await response.json();

                if (data.status === 'success') {
                    showSuccessMessage(data.message);
                    applyForm.reset();
                    const departmentGroup = document.getElementById('department-group');
                    if (departmentGroup) {
                        departmentGroup.style.display = 'none';
                    }
                } else {
                    throw new Error(data.message);
                }

            } catch (error) {
                console.error('Error:', error);
                showMessage(`
                    <div class="error-message">
                        <i class="fas fa-exclamation-circle"></i>
                        ${error.message || 'An error occurred. Please try again later.'}
                    </div>
                `);
            } finally {
                const submitBtn = this.querySelector('.submit-btn');
                if (submitBtn) {
                    submitBtn.innerHTML = '<span id="submit-text">Submit Application</span><i class="fas fa-paper-plane"></i>';
                    submitBtn.disabled = false;
                }
            }
        });
    }

    function showMessage(html) {
        if (formMessage) {
            formMessage.innerHTML = html;
            formMessage.style.display = 'block';
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }
    
    function showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="success-content">
                <h3>Application Submitted Successfully!</h3>
                <p>${message}</p>
                <p>Thank you for your interest in joining our team.</p>
            </div>
        `;
        
        formMessage.innerHTML = '';
        formMessage.appendChild(successDiv);
        formMessage.style.display = 'block';
        
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        setTimeout(() => {
            successDiv.classList.add('animated');
        }, 100);
    }

    // File upload handler
    const resumeInput = document.getElementById('resume');
    const fileNameSpan = document.getElementById('file-name');
    
    if (resumeInput && fileNameSpan) {
        resumeInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                fileNameSpan.textContent = this.files[0].name;
                fileNameSpan.style.color = 'var(--primary-color)';
            } else {
                fileNameSpan.textContent = 'No file chosen';
                fileNameSpan.style.color = 'var(--text-light)';
            }
        });
    }
}); 