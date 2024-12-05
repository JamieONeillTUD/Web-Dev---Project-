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

async function searchRecipes() {
    const query = document.getElementById('searchBar').value;

    try {
        const response = await fetch(`/api/recipes?q=${query}`);
        if (!response.ok) throw new Error('Failed to fetch recipes');

        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Failed to load recipes. Please try again.');
    }
}

function displayRecipes(recipes) {
    const container = document.getElementById('recipeResults');
    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
            <p>${recipe.strInstructions.substring(0, 100)}...</p>
            <a href="${recipe.strSource}" target="_blank">View Full Recipe</a>
        </div>
    `).join('');
}

// Hook up the search bar and button
document.getElementById('searchBarButton').addEventListener('click', () => {
    const query = document.getElementById('searchBar').value;
    searchRecipes(query);
});