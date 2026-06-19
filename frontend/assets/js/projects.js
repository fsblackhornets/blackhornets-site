document.addEventListener('DOMContentLoaded', function() {
    // تهيئة المتغيرات
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const stats = document.querySelectorAll('.stat-item h3');
    let isAnimated = false;

    // تفعيل فلترة المشاريع
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // إزالة الكلاس النشط من جميع الأزرار
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // إضافة الكلاس النشط للزر المضغوط
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            // فلترة المشاريع
            projectCards.forEach(card => {
                // تأثير التلاشي عند التغيير
                card.style.opacity = '0';
                card.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    // تفعيل تأثير Coming Soon
    document.querySelectorAll('.coming-soon .view-project').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('This project is currently under development. Stay tuned!');
        });
    });

    // تحريك الإحصائيات عند الوصول إليها
    const animateStats = () => {
        if (isAnimated) return;

        stats.forEach(stat => {
            const target = parseInt(stat.textContent);
            let current = 0;
            const increment = target / 50; // سرعة العد
            const updateCount = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current) + (stat.textContent.includes('+') ? '+' : '');
                    requestAnimationFrame(updateCount);
                } else {
                    stat.textContent = target + (stat.textContent.includes('+') ? '+' : '');
                }
            };
            updateCount();
        });
        isAnimated = true;
    };

    // مراقبة ظهور قسم الإحصائيات
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.project-stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // دالة إظهار الإشعارات
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <i class="fas fa-info-circle"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // إضافة الستايل للإشعار
        const style = document.createElement('style');
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: var(--primary-color);
                color: var(--dark-bg);
                padding: 15px 25px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                gap: 10px;
                transform: translateY(100px);
                opacity: 0;
                transition: all 0.3s ease;
                z-index: 1000;
                font-weight: bold;
            }

            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
        `;
        document.head.appendChild(style);

        // إظهار الإشعار
        setTimeout(() => notification.classList.add('show'), 100);

        // إخفاء الإشعار بعد 3 ثواني
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    const video = document.getElementById('projectVideo');
    
    if (video) {
        video.addEventListener('loadeddata', function() {
            video.play();
        });

        video.addEventListener('ended', function() {
            video.play();
        });

        video.addEventListener('error', function(e) {
            console.error('Error loading video:', e);
        });
    }
}); 


   
    loadProjects();


// دالة تحميل المشاريع
async function loadProjects() {
    const t = window.getTranslations ? window.getTranslations() : {
        projectsComingSoon: 'Projekti uskoro',
        workingOnProjects: 'Naš tim vredno radi na neverovatnim projektima.',
        stayTuned: 'Pratite nas za najnovije informacije!',
        errorLoadingProjects: 'Greška pri učitavanju projekata',
        unableToLoad: 'Trenutno nije moguće učitati projekte. Pokušajte ponovo kasnije.',
        loadingProjects: 'Učitavam projekte...'
    };
    
    try {
        const response = await fetch('/backend/api/projects/read.php');
        const data = await response.json();
        
        const projectsContainer = document.getElementById('projects-container');
        
        if (data.success && data.data.length > 0) {
            // عرض المشاريع
            displayProjects(data.data, projectsContainer);
        } else {
            // عرض رسالة "قريباً" إذا لم يكن هناك مشاريع
            projectsContainer.innerHTML = `
                <div class="coming-soon-section">
                    <div class="coming-soon-content">
                        <div class="coming-soon-icon">
                            <i class="fas fa-cog fa-spin"></i>
                            <i class="fas fa-cog fa-spin-reverse"></i>
                        </div>
                        <h2>${t.projectsComingSoon}</h2>
                        <p>${t.workingOnProjects}</p>
                        <p>${t.stayTuned}</p>
                        <div class="progress-bar">
                            <div class="progress-fill"></div>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        const projectsContainer = document.getElementById('projects-container');
        projectsContainer.innerHTML = `
            <div class="error-container">
                <div class="error-text">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${t.errorLoadingProjects}</h3>
                    <p>${t.unableToLoad}</p>
                </div>
            </div>
        `;
    }
}

// دالة عرض المشاريع
function displayProjects(projects, container) {
    const t = window.getTranslations ? window.getTranslations() : {
        progress: 'Napredak',
        dueDate: 'Rok',
        duration: 'Trajanje',
        daysRemaining: 'dana preostalo',
        daysOverdue: 'dana zakašnjenja',
        active: 'Aktivan',
        completed: 'Završen',
        pending: 'Na čekanju'
    };
    
    let html = '';
    
    projects.forEach(project => {
        const imageHtml = project.image_url ? 
            `<img src="../${project.image_url}" alt="${project.name}" class="project-image">` :
            `<div class="project-placeholder">${project.name.charAt(0)}</div>`;
        
        const statusClass = getStatusClass(project.status);
        const progressColor = getProgressColor(project.progress);
        
        // Translate status
        let translatedStatus = project.status;
        if (project.status.toLowerCase() === 'active') translatedStatus = t.active;
        else if (project.status.toLowerCase() === 'completed') translatedStatus = t.completed;
        else if (project.status.toLowerCase() === 'pending') translatedStatus = t.pending;
        
        const daysText = project.is_overdue ? 
            `${Math.abs(project.days_remaining)} ${t.daysOverdue}` : 
            `${project.days_remaining} ${t.daysRemaining}`;
        
        html += `
            <div class="project-card ${statusClass}" data-aos="fade-up">
                <div class="project-content">
                    ${imageHtml}
                    <div class="status-badge ${statusClass}">${translatedStatus}</div>
                    <h3 class="project-title">${project.name}</h3>
                    <p class="project-description">${project.description}</p>
                    
                    <div class="project-meta">
                        <div class="meta-item">
                            <i class="fas fa-calendar"></i>
                            <span>${t.dueDate}: ${formatDate(project.due_date)}</span>
                        </div>
                        <div class="meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${project.duration}</span>
                        </div>
                        <div class="meta-item ${project.is_overdue ? 'overdue' : ''}">
                            <i class="fas fa-hourglass-half"></i>
                            <span>${daysText}</span>
                        </div>
                    </div>
                    
                    <div class="development-progress">
                        <div class="progress-item">
                            <span class="label">${t.progress}</span>
                            <div class="progress-bar">
                                <div class="progress" style="width: ${project.progress}%; background: ${progressColor}"></div>
                            </div>
                            <span class="percentage">${project.progress}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// دالة الحصول على كلاس الحالة
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'active':
            return 'active';
        case 'completed':
            return 'completed';
        case 'pending':
            return 'pending';
        default:
            return 'pending';
    }
}

// دالة الحصول على لون التقدم
function getProgressColor(progress) {
    if (progress >= 80) return '#4CAF50'; // أخضر
    if (progress >= 60) return '#FF9800'; // برتقالي
    if (progress >= 40) return '#FFC107'; // أصفر
    return '#F44336'; // أحمر
}

// دالة تنسيق التاريخ
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
} 