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

document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display default recipes on page load
    fetch('/api/recipes') // No query provided for default recipes
        .then(response => response.json())
        .then(recipes => displayRecipes(recipes))
        .catch(error => console.error('Error fetching default recipes:', error));
});

function displayRecipes(recipes) {
    const container = document.getElementById('recipeResults');
    container.innerHTML = recipes.map(recipe => `
        <div class="recipe-card">
            <h3>${recipe.strMeal}</h3>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
            <p>${recipe.strInstructions.substring(0, 100)}...</p>
            <a href="/recipeDetails.html?id=${recipe.idMeal}" class="btn btn-primary">View Recipe Details</a>
        </div>
    `).join('');
    container.innerHTML = `
        <section class="container py-5">
            <h2 class="text-center mb-4">Search Results</h2>
            <div class="row">
                ${recipes.map(recipe => `
                    <div class="col-md-4 mb-4">
                        <div class="card">
                            <img src="${recipe.strMealThumb}" class="card-img-top" alt="${recipe.strMeal}">
                            <div class="card-body">
                                <h5 class="card-title">${recipe.strMeal}</h5>
                                <p class="card-text">${recipe.strInstructions.substring(0, 100)}...</p>
                                <a href="recipeDetails.html?id=${recipe.idMeal}" class="btn btn-primary">View Recipe Details</a>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}




// Hook up the search bar and button
document.getElementById('searchBarButton').addEventListener('click', () => {
    const query = document.getElementById('searchBar').value;
    searchRecipes(query);
});

async function viewRecipeDetails(recipeId) {
    try {
        const response = await fetch(`/api/recipe/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch recipe details');

        const recipe = await response.json();
        displayRecipeDetails(recipe); // Function to display details on your webpage
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        alert('Failed to load recipe details. Please try again.');
    }
}

function displayRecipeDetails(recipe) {
    const container = document.getElementById('recipeDetails');
    container.innerHTML = `
        <div class="recipe-details">
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" />
            <h3>Ingredients</h3>
            <ul>
                ${Object.keys(recipe)
                    .filter(key => key.startsWith('strIngredient') && recipe[key])
                    .map(key => `<li>${recipe[key]} - ${recipe[`strMeasure${key.match(/\d+/)[0]}`]}</li>`)
                    .join('')}
            </ul>
            <h3>Instructions</h3>
            <p>${recipe.strInstructions}</p>
        </div>
    `;
}
