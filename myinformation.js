const express = require('express'); //ÄLÄ KOSKE
const router = express.Router(); //ÄLÄ KOSKE
const connection = require("./database"); //ÄLÄ KOSKE
const cors = require('cors');

//HAETAAN ASIAKKAAN TIEDOT TIETOKANNASTA
router.get("/getmyinformation", (req, res) => {
  const email = req.query.username;

  // Hae asiakkaan tiedot tietokannasta
  const query =
    "SELECT asiakasID, enimi, snimi, puhelinnumero, sahkoposti, salasana_hash FROM Asiakas WHERE sahkoposti = ?";
  connection.query(query, [email], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Server error");
    }

    if (results.length > 0) {
      // Varmistetaan, että luodaan yksinkertainen objekti ilman sisäkkäisiä objekteja
      const userObject = {
        asiakasID: results[0].asiakasID, //tätä käytetään vain ohjelman sisäisesti asiakkaan muistamiseksi
        etunimi: results[0].enimi, // Vain arvo, ei sisäkkäistä objektia
        sukunimi: results[0].snimi,
        puhelinnumero: results[0].puhelinnumero,
        sahkoposti: results[0].sahkoposti,
        salasana: results[0].salasana_hash
      };
      res.json(userObject); // Lähetä tämä muotoiltu objekti asiakkaalle
    } else {
      res.status(404).send("User not found");
    }
  });
});
// TÄSSÄ PÄIVITETÄÄN ASIAKKAAN MUUTETUT TIEDOT TIETOKANTAAN
router.put("/updatedUserInfo", (req, res) => {
  const { asiakasID, etunimi, sukunimi, puhelinnumero, sahkoposti, salasana } = req.body;

  // Tarkista että sahkoposti (käyttäjätunnus) on annettu
  if (!sahkoposti) {
    return res.status(400).send("Sähköposti on pakollinen.");
  }

  // TODO: Salasanan hash-funktio tässä ennen tietokantaan tallentamista
  //huom, vielä ei ole funktiota joka un-hashaa salasanan, tämä kannattaa siis jättää myöhemmäksi t.meeri
  //const salasana_hash = hashFunction(salasana);

  const updateQuery = `
    UPDATE Asiakas 
    SET enimi = ?, snimi = ?, puhelinnumero = ?, salasana_hash = ?, sahkoposti = ?
    WHERE asiakasID = ?;
  `;  //hyödynnetään kyselyssä aiemmin kyseltyä asiakasID:tä, jotta asiakas voidaan tunnistaa
      //tilanteessa jossa hän haluaa vaihtaa esim. sähköpostiosoitteen

  connection.query(
    updateQuery,
    [etunimi, sukunimi, puhelinnumero, salasana, sahkoposti, asiakasID],
    (err, results) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).send("Server error");
      }
      if (results.affectedRows > 0) {
        res.send("User information updated successfully.");
      } else {
        res.status(404).send("User not found.");
      }
    }
  );
});

module.exports = router; //ÄLÄ KOSKE

