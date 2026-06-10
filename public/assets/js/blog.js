// HTML escape helper to prevent XSS
function escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Initialize when DOM content is loaded
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    setupSearch();
    loadCategories();
    setupNewsletter();
    
    // Listen for language change events to reload posts with correct language
    window.addEventListener('languageChanged', function() {
        loadPosts();
    });
});

// Load blog posts
// تحميل المقالات
async function loadPosts(page = 1, category = '', search = '') {
    try {
        const response = await fetch(`../api/posts/read.php?page=${page}&category=${category}&search=${search}`);
        const data = await response.json();
        
        if (data.status === 'success') {
            displayPosts(data.data);
            setupPagination(data.pagination);
        }
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Display posts in the grid
// عرض المقالات في الشبكة
function displayPosts(posts) {
    const blogGrid = document.querySelector('.blog-grid');
    blogGrid.innerHTML = '';

    if (!posts || posts.length === 0) {
        blogGrid.innerHTML = '<p style="color:#FFD700;text-align:center;font-size:1.2rem;">No news available.</p>';
        return;
    }

    // Get current language
    const currentLang = window.getCurrentLanguage ? window.getCurrentLanguage() : 'sr';

    posts.forEach((post, index) => {
        // Get bilingual content based on current language
        let title = (currentLang === 'en' ? (post.title_en || post.title_sr || post.title) : (post.title_sr || post.title || post.title_en)) || 'Untitled';
        let content = (currentLang === 'en' ? (post.content_en || post.content_sr || post.content) : (post.content_sr || post.content || post.content_en)) || '';
        
        // Handle image path - use absolute path
        let imagePath = '';
        if (post.image) {
            if (post.image.startsWith('http') || post.image.startsWith('/')) {
                imagePath = post.image;
            } else {
                imagePath = '/' + post.image.replace(/^\.\.\//, '');
            }
        }
        
        const dateObj = new Date(post.created_at.replace(' ', 'T'));
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = dateObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'sr-RS', options);

        const shortContent = content.length > 150 ? content.substring(0, 147) + '...' : content;
        const featuredText = currentLang === 'en' ? 'Featured' : 'Istaknuto';
        const featuredBadge = post.featured == 1 ? `<span class="news-badge">${featuredText}</span>` : '';
        const readMoreText = currentLang === 'en' ? 'Read More' : 'Pročitaj više';

        blogGrid.innerHTML += `
            <a href="blog-post.html?id=${parseInt(post.id)}" class="blog-post-link">
                <article class="blog-post">
                    <div class="post-image">
                        ${featuredBadge}
                        ${imagePath ? `<img src="${escapeHtml(imagePath)}" alt="${escapeHtml(title)}" onerror="this.parentElement.style.display='none'">` : '<div style="height:200px;background:#222;display:flex;align-items:center;justify-content:center;"><i class="fas fa-image" style="font-size:3rem;color:#333;"></i></div>'}
                        <div class="post-category">${escapeHtml(post.category || '')}</div>
                    </div>
                    <div class="post-content">
                        <div class="post-meta">
                            <span><i class="far fa-calendar"></i> ${escapeHtml(formattedDate)}</span>
                            <span><i class="far fa-user"></i> ${escapeHtml(post.author || 'Team Black Hornets')}</span>
                        </div>
                        <h3>${escapeHtml(title)}</h3>
                        <p>${escapeHtml(shortContent)}</p>
                        <span class="read-more-btn">${readMoreText} <i class="fas fa-arrow-right"></i></span>
                    </div>
                </article>
            </a>
        `;
    });
}

// Setup search functionality
// إعداد وظيفة البحث
function setupSearch() {
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const searchTerm = this.querySelector('input').value.trim();
        loadPosts(1, '', searchTerm);
    });
}

// Load blog categories
// تحميل تصنيفات المدونة
async function loadCategories() {
    try {
        const response = await fetch('../api/posts/categories.php');
        const data = await response.json();
        
        if (data.status === 'success') {
            displayCategories(data.data);
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Display categories in sidebar
// عرض التصنيفات في الشريط الجانبي
function displayCategories(categories) {
    const categoryList = document.querySelector('.category-list');
    categoryList.innerHTML = categories.map(cat => `
        <li>
            <a href="#" data-category="${cat.name}">
                ${cat.name} <span>(${cat.count})</span>
            </a>
        </li>
    `).join('');

    // Add event listeners to category links
    // إضافة مستمعي الأحداث لروابط التصنيفات
    categoryList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadPosts(1, this.dataset.category);
        });
    });
}

// Setup newsletter subscription
// إعداد الاشتراك في النشرة الإخبارية
function setupNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    newsletterForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value.trim();
        
        try {
            const response = await fetch('api/newsletter/subscribe.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            alert(data.message);
            
            if (data.status === 'success') {
                this.reset();
            }
        } catch (error) {
            console.error('Error subscribing to newsletter:', error);
        }
    });
}

// Helper functions
// دوال مساعدة

// Format date to readable string
// تنسيق التاريخ إلى نص مقروء
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Setup pagination
// إعداد الترقيم
function setupPagination(pagination) {
    const paginationDiv = document.querySelector('.pagination');
    let html = '';
    
    for (let i = 1; i <= pagination.total_pages; i++) {
        html += `
            <a href="#" class="page-link ${i === pagination.current_page ? 'active' : ''}" 
               data-page="${i}">${i}</a>
        `;
    }
    
    if (pagination.current_page < pagination.total_pages) {
        html += `
            <a href="#" class="page-link next" data-page="${pagination.current_page + 1}">
                Next <i class="fas fa-arrow-right"></i>
            </a>
        `;
    }
    
    paginationDiv.innerHTML = html;
    
    // Add event listeners to pagination links
    // إضافة مستمعي الأحداث لروابط الترقيم
    paginationDiv.querySelectorAll('.page-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            loadPosts(parseInt(this.dataset.page));
        });
    });
} 