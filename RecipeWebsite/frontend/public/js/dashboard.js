async function fetchDashboardData() {
    try {
        const [userRes, recipesRes, favoritesRes] = await Promise.all([
            fetch('/user/details'),
            fetch('/recipes'),
            fetch('/recipes/favorites')
        ]);

        if (!userRes.ok || !recipesRes.ok || !favoritesRes.ok) {
            throw new Error('Failed to fetch dashboard data.');
        }

        const user = await userRes.json();
        const recipes = await recipesRes.json();
        const favorites = await favoritesRes.json();

        populateUserDetails(user);
        populateRecipes(recipes);
        populateFavorites(favorites);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Failed to load dashboard data.');
    }
}

function populateUserDetails(user) {
    document.getElementById('user-name').textContent = `Welcome, ${user.first_name}!`;
    document.getElementById('first_name').value = user.first_name;
    document.getElementById('last_name').value = user.last_name;
    document.getElementById('email').value = user.email;
}

function populateRecipes(recipes) {
    const recipesList = document.getElementById('recipes-list');
    recipesList.innerHTML = recipes.map(recipe => `
        <li class="list-group-item">
            <h5>${recipe.title}</h5>
            <p>${recipe.description}</p>
        </li>
    `).join('');
}

function populateFavorites(favorites) {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = favorites.map(fav => `
        <li class="list-group-item" id="favorite-${fav.id}">
            <h5>${fav.title}</h5>
            <p>${fav.description}</p>
            <button class="btn btn-danger" onclick="removeFromFavorites(${fav.id})">Remove</button>
        </li>
    `).join('');
}

async function removeFromFavorites(recipeId) {
    try {
        const response = await fetch(`/recipes/${recipeId}/favorites`, { method: 'DELETE' });
        if (response.ok) {
            document.getElementById(`favorite-${recipeId}`).remove();
            alert('Recipe removed from favorites.');
        } else {
            alert('Failed to remove favorite.');
        }
    } catch (error) {
        console.error('Error removing favorite:', error);
    }
}

document.getElementById('updateProfileForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/user/update-profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            alert('Profile updated successfully!');
        } else {
            alert('Failed to update profile.');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
    }
});

document.addEventListener('DOMContentLoaded', fetchDashboardData);
