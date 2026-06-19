document.addEventListener('DOMContentLoaded', () => {
    const showMoreNewsBtn = () => {
        const btn = document.querySelector('.more-news-btn-container');
        if (btn) {
            btn.style.display = 'block';
            btn.style.visibility = 'visible';
            btn.style.opacity = '1';
        }
    };

    showMoreNewsBtn();

    const buildImagePath = (image) => {
        if (!image) return '';
        let cleanPath = image.replace(/^\.\.\//, '').replace(/^\//, '');
        if (!cleanPath.startsWith('uploads/')) {
            cleanPath = `uploads/${cleanPath}`;
        }
        return `/frontend/${cleanPath}`;
    };

    const renderNewsCard = (post, lang) => {
        const featuredText = lang === 'en' ? 'Featured' : 'Istaknuto';
        const readMoreText = lang === 'en' ? 'Read More' : 'Pročitaj više';

        const title = (lang === 'en'
            ? (post.title_en || post.title_sr || post.title)
            : (post.title_sr || post.title || post.title_en)) || 'Untitled';

        const content = (lang === 'en'
            ? (post.content_en || post.content_sr || post.content)
            : (post.content_sr || post.content || post.content_en)) || '';

        const imagePath = buildImagePath(post.image);
        const dateObj = new Date(post.created_at.replace(' ', 'T'));
        const formattedDate = dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : 'sr-RS', {
            year: 'numeric', month: 'long', day: 'numeric',
        });
        const shortContent = content.length > 150 ? `${content.substring(0, 147)}...` : content;

        return `
            <div class="news-card-featured">
                ${post.featured === 1 ? `<span class="news-badge">${featuredText}</span>` : ''}
                ${imagePath ? `<div class="news-image" style="width:100%;height:220px;overflow:hidden;border-radius:8px;margin-bottom:15px;">
                    <img src="${imagePath}" alt="${title}" style="width:100%;height:100%;object-fit:cover;" onerror="this.parentElement.style.display='none'">
                </div>` : ''}
                <div class="news-meta-row">
                    <span class="news-meta-item"><i class="fa-regular fa-calendar"></i> ${formattedDate}</span>
                    <span class="news-meta-item"><i class="fa-regular fa-user"></i> ${post.author || 'Team Black Hornets'}</span>
                </div>
                <h3 class="news-title-featured" style="padding-left:20px;">${title}</h3>
                <p class="news-text-featured" style="padding-left:20px;">${shortContent}</p>
                <a href="/frontend/pages/blog-post.html?id=${post.id}" class="news-readmore">${readMoreText}</a>
            </div>
        `;
    };

    const loadHomeNews = () => {
        fetch('/backend/api/posts/read.php')
            .then(response => response.json())
            .then(data => {
                const newsGrid = document.getElementById('newsGrid');
                newsGrid.innerHTML = '';
                const posts = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : []);
                const lang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'sr';

                if (posts.length > 0) {
                    posts.slice(0, 2).forEach(post => {
                        newsGrid.innerHTML += renderNewsCard(post, lang);
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
                    emptyRow.style.display = 'flex';
                    emptyRow.style.justifyContent = 'center';
                    emptyRow.style.alignItems = 'center';
                    emptyRow.style.gap = '10px';
                }

                showMoreNewsBtn();
            })
            .catch(error => {
                console.error('Error loading news:', error);
                document.getElementById('newsGrid').innerHTML = '<p style="color:red;">Error loading news.</p>';
                showMoreNewsBtn();
            });
    };

    loadHomeNews();
    window.addEventListener('languageChanged', loadHomeNews);

    gsap.registerPlugin(ScrollTrigger);

    gsap.from('.who-we-are-text', {
        scrollTrigger: {
            trigger: '#who-we-are',
            start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: 'power2.out',
    });

    gsap.from('.who-we-are-text p', {
        scrollTrigger: {
            trigger: '#who-we-are',
            start: 'top 70%',
        },
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.25,
        ease: 'power2.out',
        delay: 0.4,
    });
});
