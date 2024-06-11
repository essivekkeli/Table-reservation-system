import express from 'express';
import { urlencoded, json } from 'body-parser';
import { createConnection } from 'mysql';
import { hash } from 'bcrypt';

const app = express();
const port = 3000;

app.use(urlencoded({ extended: true }));
app.use(json());

const dbConfig = {
  host: 'localhost',
  user: 'your_username',
  password: 'your_password',
  database: 'tunnusrekisteri'
};

const connection = createConnection(dbConfig);

app.post('/submit-your-registration-form', async (req, res) => {
  const etunimi = req.body.firstname;
  const sukunimi = req.body.lastname;
  const email = req.body.email;
  const puhelin = req.body.phone;
  const salasana = req.body.password;

  try {
    // Generoi suolattu ja tiivistetty salasana bcrypt:llä
    const hashedPassword = await hash(salasana, 10);

    const sql = 'INSERT INTO Asiakas (etunimi, sukunimi, sahkoposti, puhelinnumero, salasana_hash) VALUES (?, ?, ?, ?, ?)';
    const values = [etunimi, sukunimi, email, puhelin, hashedPassword];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Virhe tietokantakyselyssä: ' + err.stack);
        res.status(500).send('Internal Server Error');
        return;
      }

      res.status(200).send('Rekisteröinti onnistui!');
    });
  } catch (error) {
    console.error('Virhe salasanan hashauksessa: ' + error.message);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Palvelin kuuntelee porttia ${port}`);
});
