<script>
document.getElementById('requestForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = this.querySelector('.btn-submit');
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Remove old alerts
    document.querySelectorAll('.form-alert').forEach(el => el.remove());

    const formData = new FormData(this);

    try {
        const res  = await fetch('/backend/api/requests/create.php', { method: 'POST', body: formData });
        const data = await res.json();

        const alert = document.createElement('div');
        alert.className = `alert alert-${data.success ? 'success' : 'error'} form-alert`;
        alert.innerHTML = `<i class="fas fa-${data.success ? 'check-circle' : 'exclamation-circle'}"></i> ${data.message}`;
        this.insertAdjacentElement('beforebegin', alert);

        if (data.success) {
            this.reset();
            setTimeout(() => { window.location.href = '/frontend/manager/dashboard.php'; }, 1800);
        }
    } catch (err) {
        const alert = document.createElement('div');
        alert.className = 'alert alert-error form-alert';
        alert.innerHTML = '<i class="fas fa-exclamation-circle"></i> Network error. Please try again.';
        this.insertAdjacentElement('beforebegin', alert);
    }

    btn.disabled = false;
    btn.innerHTML = original;
});
</script>
