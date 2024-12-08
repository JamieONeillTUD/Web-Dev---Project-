/**
 * Summary:
 * This script handles various functionalities on the Recipe Website's main page. 
 * It manages the dynamic display of the navigation links based on the user's login status,
 * populates filter options for searching recipes, fetches default recipes, and applies filters for searching. 
 * Additionally, it allows users to add recipes to their favorites, view recipe details, and navigate between pages. 
 * It also dynamically updates the displayed content based on user interactions and input.
 * 
    Author: [Andrea Luca - C22390831 / Jamie O'Neill - C22320302]
    Date: [28/10/24] - [02/12/24]
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Handle navigation links active state on click
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(link => link.classList.remove('active')); // Remove active class from all links
            link.classList.add('active'); // Add active class to clicked link
        });
    });

    // 2. Initialize the page with default filters and recipes
    loadFilterOptions(); 
    applyDefaultRecipes(); 

    // 3. Add event listeners for search functionality
    document.getElementById('searchButton').addEventListener('click', () => {
        applyFilters();
        resetFilters(); // Reset the filters after searching
    });

    // 4. Add event listener for 'Enter' key press in the search bar
    document.getElementById('searchBar').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            applyFilters();
            resetFilters(); // Reset the filters after searching
        }
    });
});

// 5. Load Filter Options (Cuisines & Categories)
async function loadFilterOptions() {
    try {
        // Fetch cuisines and categories from API
        const cuisines = await fetch('/api/cuisines').then(res => res.json());
        const categories = await fetch('/api/categories').then(res => res.json());

        // Populate dropdowns with fetched data
        populateDropdown('cuisineFilter', cuisines, 'strArea');
        populateDropdown('categoryFilter', categories, 'strCategory');
    } catch (error) {
        console.error("Error loading filter options:", error); // Handle errors during fetch
    }
}

// 6. Populate Dropdowns for filter options
function populateDropdown(elementId, items, key) {
    const select = document.getElementById(elementId);
    select.innerHTML = `<option value="">Any</option>`; // Default option

    // Loop through items and add each to dropdown
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[key];
        option.textContent = item[key];
        select.appendChild(option);
    });
}

// 7. Load Default Recipes when the page loads
async function applyDefaultRecipes() {
    try {
        const response = await fetch('/api/search');
        const recipes = await response.json();
        displayRecipes(recipes); // Display the fetched recipes
    } catch (error) {
        console.error("Error loading default recipes:", error);
    }
}

// 8. Apply Filters based on user input
async function applyFilters() {
    const query = document.getElementById('searchBar').value.trim();
    const ingredient = document.getElementById('ingredientFilter').value.trim();
    const cuisine = document.getElementById('cuisineFilter').value;
    const category = document.getElementById('categoryFilter').value;

    // Create query parameters for search
    const queryParams = new URLSearchParams();
    if (query) queryParams.append("q", query);
    if (ingredient) queryParams.append("ingredient", ingredient);
    if (cuisine) queryParams.append("cuisine", cuisine);
    if (category) queryParams.append("category", category);

    // Fetch recipes based on filters
    try {
        const response = await fetch(`/api/search?${queryParams}`);
        if (!response.ok) throw new Error('Failed to fetch recipes');
        const recipes = await response.json();
        displayRecipes(recipes); // Display filtered recipes
    } catch (error) {
        console.error("Error searching recipes:", error);
        alert('Failed to load recipes. Please try again.');
    }
}

// 9. Reset Filters to default values
function resetFilters() {
    document.getElementById('searchBar').value = '';
    document.getElementById('ingredientFilter').value = '';
    document.getElementById('cuisineFilter').selectedIndex = 0;
    document.getElementById('categoryFilter').selectedIndex = 0;
}

// 10. Display Recipes on the page
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

// 11. Add recipe to Favorites
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

// 12. Fetch and display recipe details when viewing a recipe
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

// 13. Display recipe details
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

// 14. Check if user is logged in and show appropriate links
document.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = true; // Replace this with actual session validation
    const createRecipeLink = document.getElementById('create-recipe-link');
    if (isLoggedIn) {
        createRecipeLink.style.display = 'block';
    } else {
        createRecipeLink.style.display = 'none';
    }
});

// 15. Fetch login status from server and update navigation links accordingly
document.addEventListener('DOMContentLoaded', () => {
    fetch('/check-login-status', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then((response) => response.json())
    .then((data) => {
        const loginLink = document.getElementById('login-link');
        const registerLink = document.getElementById('register-link');
        const dashboardLink = document.getElementById('dashboard-link');
        const logoutLink = document.getElementById('logout-link');
        const createRecipeLink = document.getElementById('create-recipe-link');

        const isLoggedIn = data.loggedIn;

        if (isLoggedIn) {
            loginLink.style.display = 'none';
            registerLink.style.display = 'none';
            dashboardLink.style.display = 'block';
            logoutLink.style.display = 'block';
            createRecipeLink.style.display = 'block';
        } else {
            loginLink.style.display = 'block';
            registerLink.style.display = 'block';
            dashboardLink.style.display = 'none';
            logoutLink.style.display = 'none';
            createRecipeLink.style.display = 'none';
        }
    })
    .catch((error) => {
        console.error('Error checking login status:', error);
    });
});
