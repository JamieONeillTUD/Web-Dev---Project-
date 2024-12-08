/**
 * Summary:
 * This script handles the removal of recipes from the user's favorites list on the Recipe Website. 
 * It allows users to confirm the removal and sends a DELETE request to the server to update the favorites list.
 * On success, the recipe is removed from the DOM dynamically, ensuring a seamless user experience.
 *
   Author: [Andrea Luca - C22390831]
    Date: [28/10/24] - [02/12/24]
 */

async function removeFromFavorites(recipeId) {
    // Prompt the user for confirmation before deleting the favorite
    const confirmDelete = confirm("Are you sure you want to remove this recipe from your favorites?");
    if (!confirmDelete) return; // Exit the function if the user cancels

    try {
        // Send a DELETE request to the server to remove the recipe from the favorites list
        const response = await fetch(`/recipes/favorites/${recipeId}`, {
            method: 'DELETE', // HTTP method for deletion
        });

        if (response.ok) {
            // If the request succeeds, show a success message
            alert("Recipe removed from favorites!");

            // Find the DOM element representing the favorite recipe and remove it
            const favoriteCard = document.getElementById(`favorite-${recipeId}`);
            if (favoriteCard) {
                favoriteCard.remove(); // Remove the favorite card from the DOM
                console.log(`Favorite with ID ${recipeId} removed from DOM.`);
            } else {
                console.error(`Element favorite-${recipeId} not found.`); // Log if the element is not found
            }
        } else {
            // If the request fails, parse and display the error message
            const error = await response.json();
            alert(`Failed to remove favorite: ${error.message}`);
        }
    } catch (error) {
        // Log unexpected errors and display a generic error message
        console.error('Error removing favorite:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
