// favorites.js
async function removeFromFavorites(recipeId) {
    const confirmDelete = confirm("Are you sure you want to remove this recipe from your favorites?");
    if (!confirmDelete) return;

    try {
        const response = await fetch(`/recipes/favorites/${recipeId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert("Recipe removed from favorites!");
            const favoriteCard = document.getElementById(`favorite-${recipeId}`);
            if (favoriteCard) {
                favoriteCard.remove(); // Remove from DOM
                console.log(`Favorite with ID ${recipeId} removed from DOM.`);
            } else {
                console.error(`Element favorite-${recipeId} not found.`);
            }
        } else {
            const error = await response.json();
            alert(`Failed to remove favorite: ${error.message}`);
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
        alert('An unexpected error occurred. Please try again.');
    }
}
