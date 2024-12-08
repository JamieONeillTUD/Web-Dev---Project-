/**
 * Summary:
 * This script is used to fetch and display detailed information about a specific recipe from the API based on the `id` query parameter in the URL.
 * It retrieves the recipe data, including its title, ingredients, instructions, and additional details such as category and area, and dynamically updates the webpage.
 * If an error occurs while fetching the recipe details, it provides feedback to the user. If no recipe ID is provided in the URL, it shows a message indicating that the recipe ID is missing.
 * This script is used for the Recipe Details page of the Recipe Website.
 * 
    Author: [Andrea Luca - C22390831]
    Date: [20/11/24] - [06/12/24]
 */

// Wait for the page content to fully load
document.addEventListener('DOMContentLoaded', async () => {
    // Get the recipe ID from the URL query parameters
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    // If no recipe ID is found in the URL, show a message indicating this
    if (!recipeId) {
        document.getElementById('recipeDetails').innerHTML = '<p>No recipe ID provided.</p>';
        return; // Exit the function if there's no ID
    }

    try {
        // Fetch the recipe details from the API using the recipe ID
        const response = await fetch(`/api/recipe/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch recipe details'); // If the fetch fails, throw an error

        // Parse the JSON response from the API
        const recipe = await response.json();

        // Get the container element where the recipe details will be displayed
        const detailsContainer = document.getElementById('recipeDetails');

        // Dynamically populate the recipe details in the container
        detailsContainer.innerHTML = `
            <h2 class="text-center">${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="rounded mb-3">
            
            <h4 class="mb-2">Details</h4>
            <p><strong>Category:</strong> ${recipe.strCategory || 'N/A'}</p>
            <p><strong>Area:</strong> ${recipe.strArea || 'N/A'}</p>

            <h4 class="mb-2">Ingredients</h4>
            <ul class="ingredient-list list-group list-group-flush mb-3">
                ${Object.keys(recipe)
                    .filter(key => key.startsWith('strIngredient') && recipe[key]) // Filter keys for ingredients
                    .map(key => `<li class="list-group-item">${recipe[key]} - ${recipe[`strMeasure${key.match(/\d+/)[0]}`] || ''}</li>`)
                    .join('')} <!-- List each ingredient with its corresponding measurement -->
            </ul>

            <h4 class="mb-2">Instructions</h4>
            <p>${recipe.strInstructions || 'No instructions available.'}</p> <!-- Display instructions if available -->
        `;
    } catch (error) {
        // If an error occurs while fetching the recipe details, display an error message
        console.error('Error fetching recipe details:', error);
        document.getElementById('recipeDetails').innerHTML = '<p>Failed to load recipe details. Please try again later.</p>';
    }
});
