document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const recipeId = params.get('id'); // Get the recipe ID from the URL

    if (!recipeId) {
        document.getElementById('recipeDetails').innerHTML = '<p>No recipe ID provided.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/recipe/${recipeId}`); // Call your backend API
        if (!response.ok) throw new Error('Failed to fetch recipe details');

        const recipe = await response.json();

        // Populate the details
        const detailsContainer = document.getElementById('recipeDetails');
        detailsContainer.innerHTML = `
            <h2>${recipe.strMeal}</h2>
            <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}" style="max-width: 100%; height: auto;">
            <p><strong>Category:</strong> ${recipe.strCategory || 'N/A'}</p>
            <p><strong>Area:</strong> ${recipe.strArea || 'N/A'}</p>
            <p><strong>Instructions:</strong></p>
            <p>${recipe.strInstructions || 'No instructions available.'}</p>
            <p><strong>Ingredients:</strong></p>
            <ul>
                ${Object.keys(recipe)
                    .filter(key => key.startsWith('strIngredient') && recipe[key])
                    .map(key => `<li>${recipe[key]} - ${recipe[`strMeasure${key.match(/\d+/)[0]}`] || ''}</li>`)
                    .join('')}
            </ul>
        `;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        document.getElementById('recipeDetails').innerHTML = '<p>Failed to load recipe details. Please try again later.</p>';
    }
});
