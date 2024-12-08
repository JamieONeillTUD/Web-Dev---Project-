document.getElementById('createRecipeForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        ingredients: document.getElementById('ingredients').value,
        instructions: document.getElementById('instructions').value,
    };

    try {
        const response = await fetch('/recipes/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Recipe created successfully!');
            // You can redirect to dashboard or show success message here
            window.location.href = "/user/dashboard";  // Redirect to dashboard after success
        } else {
            const error = await response.json();
            alert(`Error: ${error.message}`);
        }
    } catch (err) {
        console.error('Error creating recipe:', err);
    }
});