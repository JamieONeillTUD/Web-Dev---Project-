document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id');

    if (!recipeId) {
        document.getElementById('recipeDetails').innerHTML = '<p>No recipe ID provided.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/recipe/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch recipe details');

        const recipe = await response.json();

        const detailsContainer = document.getElementById('recipeDetails');
        detailsContainer.innerHTML = `
            <h2 class="text-center">${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" class="rounded mb-3">
            
            <h4 class="mb-2">Details</h4>
            <p><strong>Category:</strong> ${recipe.strCategory || 'N/A'}</p>
            <p><strong>Area:</strong> ${recipe.strArea || 'N/A'}</p>

            <h4 class="mb-2">Ingredients</h4>
            <ul class="ingredient-list list-group list-group-flush mb-3">
                ${Object.keys(recipe)
                    .filter(key => key.startsWith('strIngredient') && recipe[key])
                    .map(key => `<li class="list-group-item">${recipe[key]} - ${recipe[`strMeasure${key.match(/\d+/)[0]}`] || ''}</li>`)
                    .join('')}
            </ul>

            <h4 class="mb-2">Instructions</h4>
            <p>${recipe.strInstructions || 'No instructions available.'}</p>
        `;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        document.getElementById('recipeDetails').innerHTML = '<p>Failed to load recipe details. Please try again later.</p>';
    }
});
