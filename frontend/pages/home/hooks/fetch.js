window.loadHomeNews = () => {
    window.API.posts.getAll()
        .then(data => {
            const newsGrid = document.getElementById('newsGrid');
            newsGrid.innerHTML = '';
            const posts = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
            const lang = window.getCurrentLanguage?.() || 'sr';

            if (posts.length > 0) {
                posts.slice(0, 2).forEach(post => {
                    newsGrid.innerHTML += window.renderNewsCard(post, lang);
                });
                const emptyRow = document.getElementById('newsEmptyRow');
                if (emptyRow) emptyRow.style.display = 'none';
            } else {
                let emptyRow = document.getElementById('newsEmptyRow');
                if (!emptyRow) {
                    emptyRow = document.createElement('div');
                    emptyRow.className = 'news-empty-row';
                    emptyRow.id = 'newsEmptyRow';
                    newsGrid.parentNode.insertBefore(emptyRow, newsGrid.nextSibling);
                }
                emptyRow.innerHTML = '<span class="no-news">No news found</span><a href="/frontend/pages/blog-post.html" class="more-news-btn"></a>';
                emptyRow.style.cssText = 'display:flex;justify-content:center;align-items:center;gap:10px;';
            }

            window.showMoreNewsBtn?.();
        })
        .catch(error => {
            console.error('Error loading news:', error);
            document.getElementById('newsGrid').innerHTML = '<p style="color:red;">Error loading news.</p>';
            window.showMoreNewsBtn?.();
        });
};
