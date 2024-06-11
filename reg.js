// serveri puolen kommunikaatio rekisteröinnille
const express = require("express");
const router = express.Router();
const connection = require("./database"); // tekee tietokantayhdistyksen


router.post("/reg", (req, res) => {
  const { ename, sname, email, phone, password } = req.body;

  // Check if email already exists
  const checkEmailQuery = "SELECT sahkoposti FROM asiakas WHERE sahkoposti = ?";
  connection.query(checkEmailQuery, [email], (error, results) => {
    if (error) throw error;

    if (results.length > 0) {
      // Email already exists
      res.send({ success: false, message: "Sähköposti on jo rekisteröity järjestelmään. Jos olet unohtanut salasanan, resetoi salasanasi tai tee tunnus eri sähköpostiosoitteelle." });
    } else {
      // Proceed with registration
      const query =
        "INSERT INTO asiakas (enimi, snimi, sahkoposti, puhelinnumero, salasana_hash) VALUES (?, ?, ?, ?, ?)";
      connection.query(query, [ename, sname, email, phone, password], (error, results) => {
        if (error) throw error;
        if (results.affectedRows > 0) {
          res.send({ success: true, message: "Rekisteröinti onnistui!" });
        } else {
          res.send({ success: false, message: "Rekisteröinti epäonnistui, kokeile myöhemmin uudelleen." });
        }
      });
    }
  });
});


module.exports = router;
