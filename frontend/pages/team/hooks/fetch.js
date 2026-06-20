window.showApiError = (message) => {
    const hierarchyBox = document.querySelector('.hierarchy-box');
    if (hierarchyBox) {
        hierarchyBox.innerHTML = `<div class="error-message" style="padding:2rem;text-align:center;color:#ff4444;">${message}</div>`;
    }
    const orgStructure = document.querySelector('.org-structure');
    if (orgStructure) orgStructure.style.display = 'none';
};

window.fetchTeamMembers = async () => {
    try {
        const data = await window.API.team.getAll();

        if (data.success) {
            window.allTeamMembers = data.members;
            window.preloadImages(data.members);
            window.updateLeadershipStructure(data);
        } else {
            console.error('API error:', data.message);
            window.showApiError(`Failed to load team members: ${data.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        window.showApiError(`Failed to load team members: ${error.message}`);
    }
};
