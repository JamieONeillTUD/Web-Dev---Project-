/**
 * Summary:
 * This JavaScript code provides the functionality for users to edit their profile on the Recipe Website. 
 * It handles the form submission for the "Edit Profile" feature by sending the updated user data to the backend.
 * The script utilizes the Fetch API to send a POST request with the new data and dynamically handles success or error responses.
 * 
   Author: [Andrea Luca - C22390831]
    Date: [28/10/24] - [02/12/24]
 */

document.getElementById('edit-profile-form').addEventListener('submit', async (event) => {
    // Prevent the default form submission behavior to handle it via JavaScript
    event.preventDefault();

    // Collect the form data and convert it into a JSON object
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    try {
        // Send the updated profile data to the server using a POST request
        const response = await fetch('/user/edit-profile', {
            method: 'POST', // Use POST to send updated profile data
            headers: {
                'Content-Type': 'application/json', // Indicate JSON content
            },
            body: JSON.stringify(data), // Convert the data object to a JSON string
        });

        // Handle the response from the server
        if (response.ok) {
            // If the update is successful, show a success alert and redirect to the dashboard
            alert('Profile updated successfully!');
            window.location.href = '/user/dashboard'; // Redirect the user to their dashboard
        } else {
            // If the update fails, parse and display the error message
            const error = await response.json();
            alert(`Failed to update profile: ${error.message}`);
        }
    } catch (err) {
        // Log any errors to the console and display a generic error message
        console.error('Error updating profile:', err);
        alert('An error occurred while updating your profile.');
    }
});
