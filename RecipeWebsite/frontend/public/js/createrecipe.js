document.addEventListener('DOMContentLoaded', function() {
    const createRecipeForm = document.getElementById('createRecipeForm');

    createRecipeForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Collect form data
        const formData = {
            title: document.getElementById('title').value,
            description: document.getElementById('description').value,
            ingredients: document.getElementById('ingredients').value,
            instructions: document.getElementById('instructions').value
        };

        try {
            const response = await fetch('/recipes/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (response.ok) {
                // Success notification
                Swal.fire({
                    icon: 'success',
                    title: 'Recipe Created!',
                    text: 'Your recipe has been successfully added.',
                    confirmButtonText: 'Go to Dashboard'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/user/dashboard';
                    }
                });
            } else {
                // Error notification
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: result.error || 'Failed to create recipe'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Unable to create recipe. Please try again.'
            });
        }
    });
});
