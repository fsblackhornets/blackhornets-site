window.loadProjects = async () => {
    const t = window.getTranslations?.() || {};
    const projectsContainer = document.getElementById('projects-container');
    if (!projectsContainer) return;

    try {
        const data = await window.API.projects.getAll();

        if (data.success && data.data.length > 0) {
            window.displayProjects(data.data, projectsContainer);
        } else {
            projectsContainer.innerHTML = `
                <div class="coming-soon-section">
                    <div class="coming-soon-content">
                        <div class="coming-soon-icon">
                            <i class="fas fa-cog fa-spin"></i>
                            <i class="fas fa-cog fa-spin-reverse"></i>
                        </div>
                        <h2>${t.projectsComingSoon || 'Projects Coming Soon'}</h2>
                        <p>${t.workingOnProjects || ''}</p>
                        <p>${t.stayTuned || ''}</p>
                        <div class="progress-bar"><div class="progress-fill"></div></div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsContainer.innerHTML = `
            <div class="error-container">
                <div class="error-text">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h3>${t.errorLoadingProjects || 'Error Loading Projects'}</h3>
                    <p>${t.unableToLoad || ''}</p>
                </div>
            </div>
        `;
    }
};
