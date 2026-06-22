window.setupBlogSearch = (onSearch) => {
    const form = document.getElementById('blogSearchForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        onSearch(document.getElementById('searchInput')?.value.trim() || '');
    });
};
