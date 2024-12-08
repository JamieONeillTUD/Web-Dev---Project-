/**
 * Summary:
 * This JavaScript code manages the user's favorites on the dashboard of the Recipe Website.
 * It fetches the user's favorite recipes from the server, displays them dynamically on the page,
 * and provides functionality to remove a recipe from the favorites list.
 * The script uses the Fetch API to communicate with the backend and dynamically updates the DOM.
 * 
 * Written by: [Jamie O'Neill - C22320301]
 */

async function fetchDashboard() {
    // Log the start of the dashboard data fetching process
    console.log('Fetching dashboard data...');

    try {
        // Fetch the user's favorite recipes from the server
        const response = await fetch('/recipes/favorites');

        // Check if the response is successful
        if (!response.ok) throw new Error('Failed to fetch favorites');

        // Parse the JSON response containing the list of favorite recipes
        const favorites = await response.json();
        console.log('Fetched favorites:', favorites);

        // Find the element where favorites will be displayed
        const favoritesListElement = document.getElementById('favorites-list');

        // Dynamically generate HTML for the list of favorite recipes
        favoritesListElement.innerHTML = favorites.map(fav => `
            <li class="list-group-item favorite-item" id="favorite-${fav.id}">
                <h5>${fav.title}</h5>
                <p>${fav.description}</p>
                <button class="btn btn-danger btn-sm" onclick="removeFromFavorites(${fav.id})">Remove</button>
            </li>
        `).join('');

        // Log success message after rendering favorites
        console.log('Rendered favorites successfully');
    } catch (error) {
        // Log and alert the user in case of an error
        console.error('Error loading favorites:', error);
        alert('Failed to load favorites.');
    }
}

async function removeFromFavorites(recipeId) {
    try {
        // Send a DELETE request to the server to remove a favorite recipe
        const response = await fetch(`/recipes/${recipeId}/favorites`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        // Check if the removal was successful
        if (response.ok) {
            // Notify the user and remove the recipe from the DOM
            alert('Recipe removed from favorites!');
            document.getElementById(`favorite-${recipeId}`).remove();
        } else {
            // Handle errors and display the server's error message
            const errorMessage = await response.text();
            alert(`Failed to remove favorite: ${errorMessage}`);
        }
    } catch (error) {
        // Log and alert the user in case of an unexpected error
        console.error('Error removing favorite:', error);
        alert('Error removing favorite. Please try again.');
    }
}

// Run the fetchDashboard function when the page finishes loading
document.addEventListener('DOMContentLoaded', fetchDashboard);
