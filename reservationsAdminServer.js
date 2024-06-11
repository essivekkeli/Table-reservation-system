const express = require("express");
const router = express.Router();
const connection = require("./database"); // tekee tietokantayhdistyksen

router.post("/getReservationsAdmin", (req, res) => {
    const query = `
        SELECT 
            Poytavaraus.varausID, 
            Poytavaraus.paivamaara, 
            Poytavaraus.kellonaika, 
            Poytavaraus.paikkamaara,
            Poytavaraus.asiakasID,
            Asiakas.enimi AS firstName, 
            Asiakas.snimi AS lastName
        FROM 
            Poytavaraus
        JOIN 
            Asiakas ON Poytavaraus.asiakasID = Asiakas.asiakasID
        WHERE 
            Poytavaraus.vahvistus = 0;
    `;

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send("Server error");
        }
        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).send("Reservations not found");
        }
    })
});

router.put("/confirmReservation", (req, res) => {
    // Extract varausID directly from req.body
    const varausID = req.body.varausID;

    const query = "UPDATE Poytavaraus SET vahvistus = 1 WHERE varausID = ?;";

    connection.query(query, [varausID], (err, results) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("Server error");
        }
        if (results.affectedRows > 0) {
            res.send({ success: true, message: "Varaus vahvistettiin onnistuneesti" });
        } else {
            res.status(404).send("Varausta ei löytynyt");
        }
    });
});

router.put("/deleteReservation", (req,res) => {
    // Extract varausID directly from req.body
    const varausID = req.body.varausID;
    console.log(varausID);

    const query = "UPDATE Poytavaraus SET vahvistus = 2 WHERE varausID = ?;";

    connection.query(query, [varausID], (err, results) => {
        if (err) {
            console.log("Database error:", err);
            return res.status(500).send("Server error");
        }
        if (results.affectedRows > 0) {
            res.send({ success: true, message: "Varaus peruttu onnistuneesti" });
        } else {
            res.status(404).send("Varausta ei löytynyt");
        }
    });
})

module.exports = router;
