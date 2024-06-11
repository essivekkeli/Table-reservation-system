import { createTransport } from 'nodemailer';
import { createConnection } from 'mysql';
import { scheduleJob } from 'node-schedule';

const dbConfig = {
  host: 'localhost',
  user: 'käyttäjänimi',
  password: 'salasana',
  database: 'ohtu'
};

const transporter = createTransport({
  service: 'gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_password'
  }
});

const sendReminderEmail = (email, reservationTime) => {
  const mailOptions = {
    from: 'your_email@gmail.com',
    to: email,
    subject: 'Varausmuistutus',
    text: `Hei! Muistutamme sinua varauksestasi, joka on ${reservationTime}.`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

const connection = createConnection(dbConfig);

// Yhdistetään tietokantaan
connection.connect((err) => {
  if (err) {
    console.error('Virhe yhdistäessä tietokantaan: ' + err.stack);
    return;
  }

  console.log('Yhdistetty tietokantaan ID ' + connection.threadId);

  // Asetetaan säännöllinen aikataulu tarkistamaan ja lähettämään muistutuksia
  const job = scheduleJob('0 0 * * *', () => {
    const currentTime = new Date();

    // Tietokantakysely hakee varaukset, joiden alkamisaika on esimerkiksi tunnin päästä
    const sql = 'SELECT * FROM Poytavaraus WHERE kellonaika <= ? AND kellonaika > ?';
    const values = [new Date(currentTime.getTime() + 60 * 60 * 1000), currentTime];

    connection.query(sql, values, (err, results) => {
      if (err) {
        console.error('Virhe tietokantakyselyssä: ' + err.stack);
        return;
      }

      // Käy läpi tulokset ja lähetä muistutukset
      results.forEach((row) => {
        sendReminderEmail(row.sahkoposti, row.alkamisaika);
      });
    });
  });
});

// Suljetaan tietokantayhteys, kun sovellus lopetetaan
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});
