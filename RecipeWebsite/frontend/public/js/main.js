// Smooth Scroll for Recipe Cards
function scrollLeft() {
    const container = document.querySelector('.recipe-container');
    container.scrollBy({
        left: -300, // Scroll by 300px to the left
        behavior: 'smooth'
    });
}

function scrollRight() {
    const container = document.querySelector('.recipe-container');
    container.scrollBy({
        left: 300, // Scroll by 300px to the right
        behavior: 'smooth'
    });
}

// Add active class to navbar items when clicked
document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(link => link.classList.remove('active'));
            link.classList.add('active');
        });
    });
});
