const express = require("express");
const router = express.Router();
const connection = require("./database"); // tekee tietokantayhdistyksen


//HAETAAN KELLONAJAT TIETOKANNASTA
router.get("/getOpeningHours", (req, res) => {
  const query = "SELECT * FROM Aukioloajat";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
    console.log(results);
  });
});

//VIEDÄÄN PÄIVITETYT KELLONAJAT KANTAAN
router.put("/updatedOpeningHours", (req, res) => {
  // Oletetaan, että req.body sisältää taulukon, jossa on viikon jokaisen päivän aukioloajat
  const aukioloajat = req.body;
  console.log(aukioloajat);

  let updatePromises = aukioloajat.map(ajat => {
    const { viikonpaiva, avaa, sulkee } = ajat;

    // Muodostetaan päivityskysely
    const updateQuery = `
      INSERT INTO Aukioloajat (viikonpaiva, avaa, sulkee)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE avaa = VALUES(avaa), sulkee = VALUES(sulkee);
    `;

    // Palautetaan lupaus kyselyn suorittamisesta
    return new Promise((resolve, reject) => {
      connection.query(updateQuery, [viikonpaiva, avaa, sulkee], (err, results) => {
        if (err) {
          console.error("Database error:", err);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  });

  // Odota, että kaikki lupaukset (päivitykset) on suoritettu
  Promise.all(updatePromises)
    .then(results => {
      // Kaikki päivitykset onnistuivat
      res.send("Aukioloajat päivitetty onnistuneesti.");
    })
    .catch(error => {
      // Jokin päivityksistä epäonnistui
      console.error("Päivityksessä tapahtui virhe:", error);
      res.status(500).send("Server error");
    });
});

router.get("/getSpecialOpeningHours", (req, res) => {
  const query = "SELECT * FROM Poikkeusaukioloajat";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
    console.log(results);
  });
});

router.post("/newExceptionOpeninghour", (req, res) => {
  const { paivamaara, avaa, sulkee } = req.body;
  const selectQuery = "SELECT * FROM Poikkeusaukioloajat WHERE paivamaara = ?";

  // First check if there's already an exception for this date
  connection.query(selectQuery, [paivamaara], (selectError, selectResults) => {
    if (selectError) {
      console.error('Error checking for existing exception:', selectError);
      return res.status(500).json({ error: selectError.message });
    }

    if (selectResults.length > 0) {
      // There is already an exception for this date, so don't allow a new one
      return res.status(409).json({ message: "Poikkeusaukioloaika on jo olemassa tälle päivämäärälle." });
    } else {
      // No existing exception for this date, proceed to insert the new one
      const insertQuery = "INSERT INTO Poikkeusaukioloajat (paivamaara, avaa, sulkee) VALUES (?, ?, ?)";
      connection.query(insertQuery, [paivamaara, avaa, sulkee], (insertError, insertResults) => {
        if (insertError) {
          console.error('Error inserting new exception:', insertError);
          return res.status(500).json({ error: insertError.message });
        }
        res.status(200).json({ success: true, message: "Poikkeusaukioloaika lisätty onnistuneesti", data: insertResults });
      });
    }
  });
});

// POISTAA POIKKEUSAUKIOLOAJAN KANNASTA PÄIVÄMÄÄRÄN PERUSTEELLA
router.delete("/deleteExceptionOpeninghour/:paivamaara", (req, res) => {
  const { paivamaara } = req.params;
  const deleteQuery = "DELETE FROM Poikkeusaukioloajat WHERE paivamaara = ?";

  console.log({paivamaara});

  console.log("täällä heilutaan");

  connection.query(deleteQuery, [paivamaara], (error, results) => {
    if (error) {
      console.error('Error deleting exception:', error);
      res.status(500).json({ error: error.message });
    } else {
      console.log("päästään tänne melkein kantaan");
      res.status(200).json({ success: true, message: "Poikkeusaukioloaika poistettu onnistuneesti" });
    }
  });
});



module.exports = router;
