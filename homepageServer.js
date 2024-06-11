const express = require("express");
const router = express.Router();
const connection = require("./database"); // Adjust the path as necessary

// Assuming the username is the email (sähköposti)
router.get("/getFullName", (req, res) => {
  const email = req.query.username; // or adjust to match how you're passing the username

  // Include asiakasID in the SELECT statement to fetch it along with the names
  const query = `SELECT asiakasID, enimi, snimi, admin FROM Asiakas WHERE sahkoposti = ?`;

  connection.query(query, [email], (error, results) => {
    if (error) {
      return res.status(500).send("Server error");
    }

    if (results.length > 0) {
      const user = results[0];
      // Create a string with the full name
      const admin = `${user.admin}`;
      const fullName = `${user.enimi} ${user.snimi}`;
      // Include the asiakasID in the response along with the full name
      res.json({ asiakasID: user.asiakasID, fullName, admin });
    } else {
      res.status(404).send("User not found");
    }
  });
});

//Tällä haetaan kellonajat etusivulle
router.get("/getOpeningHoursFrontPage", (req, res) => {
  const query = "SELECT * FROM Aukioloajat";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
    console.log(results);
  });
});

router.get("/getSpecialOpeningHoursFrontPage", (req, res) => {
  const query = "SELECT * FROM Poikkeusaukioloajat";
  connection.query(query, (err, results) => {
    if (err) throw err;
    res.json(results);
    console.log(results);
  });
});

module.exports = router;
