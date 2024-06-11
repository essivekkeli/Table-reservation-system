// Käynnistää app:n serverin
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

// Import routes, tähän pitää aina lisätä .js tiedoston nimi joka on server side backkiä
const loginRouter = require("./login"); // Adjust path as necessary
const regRouter = require("./reg");
const homepageRouter = require("./homepageServer");
const myInfoRouter = require("./myinformation");
const reportingRouter= require("./reporting");
const newReservation = require("./newReservationServer");
const openingTimes = require("./openingtimesadmin");
const reservationAdmin = require("./reservationsAdminServer")
const resetPassword = require("./resetPassword");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// käytetään routereita
app.use(loginRouter);
app.use(regRouter);
app.use(homepageRouter);
app.use(myInfoRouter);
app.use(reportingRouter);
app.use(newReservation);
app.use(openingTimes);
app.use(resetPassword);
app.use(reservationAdmin);

app.listen(port, () => {
  console.log(`Serveri on käynnissä portissa ${port}`);
});