//tässä kaikki backend käyttäjäpuolella varauksien tekemiselle ja omien varauksien hallinnoimiselle ja muokkaamiselle

const express = require("express");
const router = express.Router();
const connection = require("./database"); // tekee tietokantayhdistyksen

router.post("/available-timeslots", (req, res) => {
  const { date, groupSize } = req.body;

  const query = `
        SELECT kellonaika, SUM(paikkamaara) AS totalBookedSeats
        FROM Poytavaraus
        WHERE paivamaara = ?
        GROUP BY kellonaika;
    `;

  connection.query(query, [date], (error, results) => {
    if (error) {
      return res.status(500).send("Error querying the database");
    }

    // Predefined timeslots
    const timeslots = [
      "12:00:00",
      "14:00:00",
      "16:00:00",
      "18:00:00",
      "20:00:00",
    ];

    // Determine available timeslots based on current bookings and group size
    const availableTimeslots = timeslots.filter((timeslot) => {
      const booking = results.find((result) => result.kellonaika === timeslot);
      const totalBookedSeats = booking ? booking.totalBookedSeats : 0;


      return parseInt(totalBookedSeats, 10) + parseInt(groupSize, 10) <= 20;
    });

    res.json(availableTimeslots);
  });
});


// funktio varauksen tekemiselle
router.post("/makeReservation", (req, res) => {
  const { pvm, varattuAika, ryhmakoko, paikkamaara, erikoisPyynto, valitutPalvelut, userId } = req.body;

  // Convert varattuAika (HH:MM:SS) to a Date object
  let varattuAikaDate = new Date();
  const [hours, minutes, seconds] = varattuAika.split(':').map(Number);
  varattuAikaDate.setHours(hours, minutes, seconds, 0); // Set hours, minutes, and seconds

  // Add 2 hours to varattuAikaDate
  varattuAikaDate.setHours(varattuAikaDate.getHours() + 2);

  // Format the varauksen_paattymisaika back to a string "HH:MM:SS"
  let varauksenPaattymisaika = [
    varattuAikaDate.getHours().toString().padStart(2, '0'),
    varattuAikaDate.getMinutes().toString().padStart(2, '0'),
    varattuAikaDate.getSeconds().toString().padStart(2, '0')
  ].join(':');

  // SQL query
  const query = "INSERT INTO Poytavaraus (paivamaara, kellonaika, varauksen_paattymisaika, henkilomaara, paikkamaara, erityisruokavalio, varauksen_lisatiedot, asiakasID) VALUES (?,?,?,?,?,?,?,?)";

  // Execute query with parameters
  connection.query(query, [pvm, varattuAika, varauksenPaattymisaika, ryhmakoko, paikkamaara, erikoisPyynto, valitutPalvelut, userId], (error, results, fields) => {
    if (error) {
      // Handle error
      return res.status(500).json({ error });
    }
    // Successful reservation
    res.status(200).json({ success: true, message: "Reservation successful", data: results });
  });
});


// Function for fetching user reservations
router.post("/getReservations", (req, res) => {
  // Assuming the user ID is sent in the request body with the key 'userId'
  const userId = req.body.userId;

  const query = `
  SELECT varausID, paivamaara, kellonaika, erityisruokavalio, varauksen_lisatiedot, vahvistus 
  FROM Poytavaraus 
  WHERE asiakasID = ? 
  ORDER BY paivamaara DESC, kellonaika DESC
`;

  // Executing the SQL query
  connection.query(query, [userId], (error, results) => {
    if (error) {
      console.log("tässä ongelma");
      // If there's a SQL error, send a server error response
      return res.status(500).send("Server error");
    }
    if (results.length > 0) {
      // If reservations are found, send them back to the client
      res.json(results);
    } else {
      // ei anneta erroria jos varauksia ei löydy
      res.json({ message: "Varauksia ei löytynyt", reservations: [] });
    }
  });
});

//funktio varauksen poistamiselle
router.delete("/deleteMyReservation", (req, res) => {
  //client lähettää palvelimelle varaus ID:n
  const varausId = req.body.reservationId;

  const query = "DELETE FROM Poytavaraus WHERE varausID = ?;";

  connection.query(query, [varausId], (error, result) => {
    if (error) {
      return res.status(500).send("Server error");
    } if (result.affectedRows > 0) {
      res.send({ success: true, message: "Varaus peruttu onnistuneesti" });
    } else {
      res.status(404).send("No reservations found for the given reservation ID.");
    }
  });
});

router.put("/updateMyReservation", (req,res) => {
  const varausId = req.body.reservationId;
  const newInfo = req.body.additionalInfo;

  const query = "UPDATE Poytavaraus SET erityisruokavalio = ? WHERE varausID = ?;"
  connection.query(query, [newInfo, varausId], (error, result) => {
    if (error) {
      return res.status(500).send("Server error");
    } if (result.affectedRows > 0) {
      res.send({ success: true, message: "Varausta muokattu onnistuneesti" });
    } else {
      res.status(404).send("No reservations found for the given reservation ID.");
    }
  })
})


module.exports = router;

