document.getElementById('edit-profile-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/user/edit-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Profile updated successfully!');
            window.location.href = '/user/dashboard'; // Redirect to dashboard
        } else {
            const error = await response.json();
            alert(`Failed to update profile: ${error.message}`);
        }
    } catch (err) {
        console.error('Error updating profile:', err);
        alert('An error occurred while updating your profile.');
    }
});
