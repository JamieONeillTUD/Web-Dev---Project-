document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('error')) {
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = params.get('error');
        errorMessage.style.display = 'block';
    }
});