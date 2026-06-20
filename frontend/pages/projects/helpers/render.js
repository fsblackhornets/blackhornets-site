window.getStatusClass = (status) => {
    switch (status.toLowerCase()) {
        case 'active':    return 'active';
        case 'completed': return 'completed';
        default:          return 'pending';
    }
};

window.getProgressColor = (progress) => {
    if (progress >= 80) return '#4CAF50';
    if (progress >= 60) return '#FF9800';
    if (progress >= 40) return '#FFC107';
    return '#F44336';
};

window.formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

window.displayProjects = (projects, container) => {
    const t = window.getTranslations?.() || {};

    let html = '';

    projects.forEach(project => {
        const imageHtml = project.image_url
            ? `<img src="/frontend/${project.image_url}" alt="${project.name}" class="project-image">`
            : `<div class="project-placeholder">${project.name.charAt(0)}</div>`;

        const statusClass = window.getStatusClass(project.status);
        const progressColor = window.getProgressColor(project.progress);

        let translatedStatus = project.status;
        if (project.status.toLowerCase() === 'active')    translatedStatus = t.active    || project.status;
        else if (project.status.toLowerCase() === 'completed') translatedStatus = t.completed || project.status;
        else if (project.status.toLowerCase() === 'pending')   translatedStatus = t.pending   || project.status;

        const daysText = project.is_overdue
            ? `${Math.abs(project.days_remaining)} ${t.daysOverdue  || 'days overdue'}`
            : `${project.days_remaining} ${t.daysRemaining || 'days remaining'}`;

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
                            <span>${t.dueDate || 'Due'}: ${window.formatDate(project.due_date)}</span>
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
                            <span class="label">${t.progress || 'Progress'}</span>
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
};
