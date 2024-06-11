// client side backend for registeration
document
  .querySelector(".register-container form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from submitting normally

    var ename = document.getElementById("firstname").value;
    var sname = document.getElementById("lastname").value;
    var email = document.getElementById("email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("password").value;


    // req tiedot viedään serverille (req.js.tiedostolle)
    fetch("http://localhost:3000/reg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ename, sname, email, phone, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Rekisteröinti onnistui!");
          window.location.href = "index.html";
        } else {
          alert("Rekisteröinti epäonnistui: " + data.message); // This will show the email already registered message if applicable
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
