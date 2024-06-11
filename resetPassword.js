const express = require("express"); //ÄLÄ KOSKE
const router = express.Router(); //ÄLÄ KOSKE
const connection = require("./database"); //ÄLÄ KOSKE

router.get("/resetpassword", (req, res) => {
  const email = req.query.email;

  // Hae asiakkaan tiedot tietokannasta
  const query = "SELECT * FROM Asiakas WHERE sahkoposti = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Server error");
    }

    if (results.length > 0) {
      res.json(email); // Lähetä tämä muotoiltu objekti asiakkaalle
    } else {
      res.status(404).send("Käyttäjää ei löydy.");
    }
  });
});

module.exports = router;