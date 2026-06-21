document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('#add-post-form') || document.querySelector('#addPostForm');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(form);
        const isEdit = !!form.querySelector('input[name="id"]');

        window.apiReady.then(() => window.API.posts.create(formData))
        .then(data => {
            if (data.status === 'success') {
                window.location.href = 'add-edit-post.php?msg=' + encodeURIComponent(isEdit ? 'Post updated successfully!' : 'Post added successfully!');
            } else {
                alert('Error: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error(error);
        });
    });
});
