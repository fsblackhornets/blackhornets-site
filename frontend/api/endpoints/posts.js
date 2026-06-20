window.API.posts = {
    getAll:        ()     => window._apiGet('posts/read.php'),
    getCategories: ()     => window._apiGet('posts/categories.php'),
    create:        (data) => window._apiPost('posts/create.php', data),
};
