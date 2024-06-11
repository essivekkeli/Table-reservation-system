//Client side backend for login page
document.querySelector('.login-container form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;

    
        // Lähetetään kirjautumistiedot serverille, login.js lyhennetty login
        fetch('http://localhost:3000/login', { //tähän herokun domain, jossa meidän projekti sijaitsee
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                sessionStorage.setItem("currentloggedin", username); // kirjautunut käyttäjä tallentuu session storageen
                window.location.href = 'homepagecustomer.html'; // login page onnistunut kirjautuminen ohjaa tälle sivulle
            } else {
                alert('Kirjautuminen epäonnistui: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
