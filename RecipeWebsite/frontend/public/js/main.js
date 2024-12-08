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

    loadFilterOptions(); 
    applyDefaultRecipes(); 

    document.getElementById('searchButton').addEventListener('click', () => {
        applyFilters();
        resetFilters(); // Reset after search
    });

    document.getElementById('searchBar').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            applyFilters();
            resetFilters(); // Reset after search
        }
    });
});

// Load Filter Options
async function loadFilterOptions() {
    try {
        const cuisines = await fetch('/api/cuisines').then(res => res.json());
        const categories = await fetch('/api/categories').then(res => res.json());

        populateDropdown('cuisineFilter', cuisines, 'strArea');
        populateDropdown('categoryFilter', categories, 'strCategory');
    } catch (error) {
        console.error("Error loading filter options:", error);
    }
}

// Populate Dropdown
function populateDropdown(elementId, items, key) {
    const select = document.getElementById(elementId);
    select.innerHTML = `<option value="">Any</option>`;
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[key];
        option.textContent = item[key];
        select.appendChild(option);
    });
}

// Load Default Recipes
async function applyDefaultRecipes() {
    try {
        const response = await fetch('/api/search');
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error("Error loading default recipes:", error);
    }
}

// Apply Filters
async function applyFilters() {
    const query = document.getElementById('searchBar').value.trim();
    const ingredient = document.getElementById('ingredientFilter').value.trim();
    const cuisine = document.getElementById('cuisineFilter').value;
    const category = document.getElementById('categoryFilter').value;

    // Combine query parameters only if present
    const queryParams = new URLSearchParams();
    if (query) queryParams.append("q", query);
    if (ingredient) queryParams.append("ingredient", ingredient);
    if (cuisine) queryParams.append("cuisine", cuisine);
    if (category) queryParams.append("category", category);

    try {
        const response = await fetch(`/api/search?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const recipes = await response.json();
        displayRecipes(recipes);
    } catch (error) {
        console.error("Error searching recipes:", error);
        alert('Failed to load recipes. Please try again.');
    }
}

// Reset Filters
function resetFilters() {
    document.getElementById('searchBar').value = '';
    document.getElementById('ingredientFilter').value = '';
    document.getElementById('cuisineFilter').selectedIndex = 0;
    document.getElementById('categoryFilter').selectedIndex = 0;
}

// Display Recipes
function displayRecipes(recipes) {
    const container = document.getElementById('recipeResults');
    
    if (!recipes || recipes.length === 0) {
        container.innerHTML = `<p class="text-center text-danger">No recipes found. Try different filters!</p>`;
        return;
    }

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
                                <a href="recipeDetails.html?id=${recipe.idMeal}" class="btn btn-primary">View Recipe Details</a>
                                <button class="btn btn-secondary mt-2" onclick="addToFavorites(${recipe.idMeal}, '${recipe.strMeal}', '${recipe.strMealThumb}')">Add to Favorites</button>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
    `;
}

// adding external api to favourites
async function addToFavorites(recipeId, title, image) {
    console.log('Adding to favorites:', { recipeId, title, image }); // Debugging
    try {
        const response = await fetch('/recipes/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                recipe_id: recipeId,
                title: title,
                image: image,
            }),
        });

        if (response.ok) {
            alert('Recipe added to favorites!');
        } else {
            const error = await response.json();
            console.error('Error response from server:', error); // Debugging
            alert(`Failed to add to favorites: ${error.message}`);
        }
    } catch (error) {
        console.error('Error adding to favorites:', error);
        alert('Error adding to favorites. Please try again.');
    }
}




// // Hook up the search bar and button
// document.getElementById('searchBarButton').addEventListener('click', () => {
//     const query = document.getElementById('searchBar').value;
//     searchRecipes(query);
// });

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

document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = true; // Replace this with actual session validation
    const createRecipeLink = document.getElementById('create-recipe-link');
    if (isLoggedIn) {
        createRecipeLink.style.display = 'block';
    } else {
        createRecipeLink.style.display = 'none';
    }
});
