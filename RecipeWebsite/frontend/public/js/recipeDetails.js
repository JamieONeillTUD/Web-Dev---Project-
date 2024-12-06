async function fetchRecipeDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id'); // Get recipe ID from the query parameter

    if (!recipeId) {
        alert('Recipe not found!');
        return;
    }

    try {
        const response = await fetch(`/api/recipe/${recipeId}`);
        if (!response.ok) throw new Error('Failed to fetch recipe details');

        const recipe = await response.json();
        if (!recipe) {
            alert('Recipe not found!');
            return;
        }

        // Update the page content with the recipe details
        document.getElementById('recipeTitle').textContent = recipe.strMeal;
        document.getElementById('recipeImage').src = recipe.strMealThumb;
        document.getElementById('recipeInstructions').textContent = recipe.strInstructions;
    } catch (error) {
        console.error('Error fetching recipe details:', error);
        alert('Failed to load recipe details.');
    }
}

// Fetch recipe details when the page loads
document.addEventListener('DOMContentLoaded', fetchRecipeDetails);
