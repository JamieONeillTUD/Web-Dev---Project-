/**
 * Summary:
 * This script handles the display of error messages on the login page. 
 * If there is an error message passed through the URL parameters (e.g., due to invalid login credentials), 
 * it displays the error message on the page for the user to see.
 *
    Author: [Jamie O'Neill - C22320301]
    Date: [28/10/24] - [27/11/24]
 */

document.addEventListener('DOMContentLoaded', () => {
    // Get the query parameters from the current URL
    const params = new URLSearchParams(window.location.search);
    
    // Check if there is an 'error' parameter in the URL
    if (params.has('error')) {
        // Get the element where the error message will be displayed
        const errorMessage = document.getElementById('error-message');
        
        // Set the text content of the error message to the error parameter value
        errorMessage.textContent = params.get('error');
        
        // Display the error message element by changing its style
        errorMessage.style.display = 'block';
    }
});
