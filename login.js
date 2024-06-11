// toiminnallisuus server puolen kommunikaatiolle "kirjaudu"-nappulla index.html - tiedostolle (etusivu)

const express = require("express");
const router = express.Router();
const connection = require("./database"); // tekee tietokantayhdistyksen



//tämä täsmää app.js tiedoston routeriin sekä loginClient.js tiedoston fetch:iin
router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query =
    "SELECT * FROM asiakas WHERE sahkoposti = ? AND salasana_hash = ?";
  connection.query(query, [username, password], (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.send({ success: true, message: "Kirjautuminen onnistui!" });
    } else {
      res.send({ success: false, message: "Tunnus tai salasana on väärin!" });
    }
  });
});

module.exports = router;
