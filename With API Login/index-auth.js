<script src="https://cdn.reflow.io/api.js"></script>
<script>
    window.addEventListener('reflow:ready', () => {
        if (!window.Reflow.customer.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    });
</script>