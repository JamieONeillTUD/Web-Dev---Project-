async function fetchDashboard() {
    console.log('Fetching dashboard data...');
    try {
        const response = await fetch('/recipes/favorites');
        if (!response.ok) throw new Error('Failed to fetch favorites');

        const favorites = await response.json();
        console.log('Fetched favorites:', favorites);

        const favoritesListElement = document.getElementById('favorites-list');
        favoritesListElement.innerHTML = favorites.map(fav => `
            <li class="list-group-item favorite-item" id="favorite-${fav.id}">
                <h5>${fav.title}</h5>
                <p>${fav.description}</p>
                <button class="btn btn-danger btn-sm" onclick="removeFromFavorites(${fav.id})">Remove</button>
            </li>
        `).join('');
        console.log('Rendered favorites successfully');
    } catch (error) {
        console.error('Error loading favorites:', error);
        alert('Failed to load favorites.');
    }
}

async function removeFromFavorites(recipeId) {
    try {
        const response = await fetch(`/recipes/${recipeId}/favorites`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            alert('Recipe removed from favorites!');
            document.getElementById(`favorite-${recipeId}`).remove();
        } else {
            const errorMessage = await response.text();
            alert(`Failed to remove favorite: ${errorMessage}`);
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
        alert('Error removing favorite. Please try again.');
    }
}

document.addEventListener('DOMContentLoaded', fetchDashboard);