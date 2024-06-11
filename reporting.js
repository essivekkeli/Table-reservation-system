const express = require('express');
const router = express.Router();
const connection = require("./database");

//hakee tiedot varauksista
router.post("/getReservationReport", (req, res) => {
    // Query to get all reservation details from the database
    const query = 'SELECT varausID, paivamaara, kellonaika, henkilomaara FROM Poytavaraus ORDER BY paivamaara DESC';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send("Server error");
        }

        if (results.length > 0) {
            // Map each result to create an array of reservation objects
            const reservationObjects = results.map(result => ({
                varauskoodi: result.varausID,
                paivamaara: result.paivamaara,
                aika: result.kellonaika,
                henkilomaara: result.henkilomaara
            }));

            res.json(reservationObjects); // Send the array of objects as JSON

        } else {
            res.status(404).send("Reservations not found");
        }
    });
});


//hakee suosituimmat varauspäivät ja järjestää ne 
router.post("/getPopularDays", (req, res) => {
    
    const query = 'SELECT paivamaara, SUM(henkilomaara) AS yhteensa_henkilomaara FROM Poytavaraus GROUP BY paivamaara ORDER BY yhteensa_henkilomaara DESC ';
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send("Server error");
        }
        
        if (results.length > 0) {
            const popularDateObjects = results.map(result => ({
                paivamaara: result.paivamaara,
                henkilomaara: result.yhteensa_henkilomaara
            }));
            res.json(popularDateObjects);
            
        } else {
            res.status(404).send("Reservations not found");
        }
    });
});



// hakee timeslot henkilömäärät ja tekee niistä varauksien perusteella keskiarvot ja järjestää ne suosituimman varausajan mukaisesti
router.post("/getPopularTimes", (req, res) => {

    // ottaa kokonaismääräs sijaan keskiarvon per timeslot
    const query = 'SELECT kellonaika, AVG(henkilomaara) AS keskiarvo_henkilomaara FROM Poytavaraus GROUP BY kellonaika ORDER BY keskiarvo_henkilomaara DESC';
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send("Server error");
        }
        if (results.length > 0) {
            
            //luodaan objekti joka lähetetään palvelimelle
            const popularTimeObjects = results.map(result => ({
                aika: result.kellonaika,
                henkilomaara: Math.round(result.keskiarvo_henkilomaara) //rounding jotta helpompi lukea
            }));

            res.json(popularTimeObjects);
            

        } else {
            res.status(404).send("Reservations not found");
        }
    });
});

/*
router.post("/getreportingadmin", (req, res) => {
    let query;

    console.log("Report Type:", req.body.reportType); // This logs the reportType

    // Determine the query based on the reportType
    if (req.body.reportType === "reservationDetails") {
        query = 'SELECT varausID, paivamaara, kellonaika, henkilomaara FROM Poytavaraus';
        // You'd follow this with the query execution and response logic
    } else if (req.body.reportType === "popularDates") {
        query = 'SELECT paivamaara, SUM(henkilomaara) AS yhteensa_henkilomaara FROM Poytavaraus GROUP BY paivamaara ORDER BY yhteensa_henkilomaara DESC';
        // Query execution and response logic
    } else if (req.body.reportType === "popularTimes") {
        query = 'SELECT kellonaika, COUNT(kellonaika) AS varauksien_maara, SUM(henkilomaara) AS yhteensa_henkilomaara FROM Poytavaraus GROUP BY kellonaika ORDER BY varauksien_maara DESC';
        // Query execution and response logic
    }

    // Execute the query based on reportType
    if (query) {
        connection.query(query, (err, results) => {
            if (err) {
                return res.status(500).send("Server error");
            }
            if (results.length > 0) {
                res.json(results); // Adjust according to each query's needs
            } else {
                res.status(404).send("No data found");
            }
        });
    } else {
        res.status(400).send("Invalid report type");
    }
});*/


module.exports = router;
