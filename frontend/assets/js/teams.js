const TEAM_HELPERS = [
    '/frontend/pages/team/helpers/utils.js',
    '/frontend/pages/team/helpers/touch.js',
    '/frontend/pages/team/helpers/card.js',
    '/frontend/pages/team/helpers/hierarchy.js',
    '/frontend/pages/team/helpers/members.js',
];

const TEAM_HOOKS = [
    '/frontend/pages/team/hooks/fetch.js',
];

const loadTeamScripts = (srcs) => Promise.all(
    srcs.map(src => new Promise(resolve => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = resolve;
        document.head.appendChild(s);
    }))
);

document.addEventListener('DOMContentLoaded', () => {
    Promise.all([loadTeamScripts(TEAM_HELPERS), loadTeamScripts(TEAM_HOOKS)]).then(() => {
        // Shared state
        window.allTeamMembers = [];
        window.currentViewTeam = null;
        window.currentViewDepartmentEnglish = null;

        // Back button
        document.querySelector('.back-btn')?.addEventListener('click', () => {
            window.clearActiveStates();
            window.currentViewTeam = null;
            window.currentViewDepartmentEnglish = null;
            const departmentView = document.querySelector('.department-members-view');
            if (departmentView) departmentView.style.display = 'none';
            document.querySelector('.leadership-hierarchy')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        // Modal close
        const modal = document.getElementById('memberModal');
        const closeModal = () => {
            if (modal) modal.style.display = 'none';
            document.body.style.overflow = '';
        };

        document.querySelector('.close-modal')?.addEventListener('click', closeModal);
        window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
        window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal?.style.display === 'block') closeModal(); });

        // Load data
        window.fetchTeamMembers();

        // Re-render on language change
        window.addEventListener('languageChanged', () => {
            window.updateTeamPageContent?.();

            if ((window.allTeamMembers || []).length > 0) {
                window.fetchTeamMembers().then(() => {
                    if (window.currentViewTeam) {
                        const translatedDept = window.getTranslatedDeptName(window.currentViewDepartmentEnglish);
                        window.showDepartmentMembers(window.currentViewTeam, translatedDept, true);
                    }
                });
            }
        });
    });
});
