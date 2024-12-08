/**
 * Summary:
 * This JavaScript code manages the submission of the "Create Recipe" form on the Recipe Website.
 * It collects user-inputted recipe data (title, description, ingredients, instructions) and sends it to the server
 * via a POST request using the Fetch API. If the submission is successful, the user is redirected to their dashboard.
 * Errors are handled gracefully, with feedback provided via alert messages.
 * 
    Author: [Jamie O'Neill - C22320301]
    Date: [28/10/24] - [06/12/24]
 */

document.getElementById('createRecipeForm').addEventListener('submit', async (e) => {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Collect recipe data from form inputs
    const data = {
        title: document.getElementById('title').value, // Recipe title
        description: document.getElementById('description').value, // Recipe description
        ingredients: document.getElementById('ingredients').value, // Recipe ingredients
        instructions: document.getElementById('instructions').value, // Recipe instructions
    };

    try {
        // Send the recipe data to the server using a POST request
        const response = await fetch('/recipes/add', {
            method: 'POST', // HTTP method
            headers: { 'Content-Type': 'application/json' }, // Specify JSON content type
            body: JSON.stringify(data), // Convert data object to JSON string
        });

        // Handle the server's response
        if (response.ok) {
            // If the server indicates success, notify the user and redirect to dashboard
            alert('Recipe created successfully!');
            window.location.href = "/user/dashboard"; // Redirect to dashboard
        } else {
            // If the server returns an error, display an error message
            const error = await response.json(); // Parse the error response
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        // Handle any network or unexpected errors
        console.error('Error creating recipe:', err);
    }
});
