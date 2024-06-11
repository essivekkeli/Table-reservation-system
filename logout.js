document.addEventListener('DOMContentLoaded', function() {
    const logoutLink = document.getElementById('logoutLink');

    if(logoutLink) {
        logoutLink.addEventListener('click', function(event) {
            // Prevent the default link behavior
            event.preventDefault();
            
            
            sessionStorage.clear();

            // Redirect to the login page or home page
            window.location.href = 'login.html'; // Update this to your login page URL
        });
    }
});