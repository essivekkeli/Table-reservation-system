// tässä tiedostossa tehdään tietokantayhteys jota voi kutsua muissa tiedostoissa

//tähän pitää korjata omat tiedot, yleensä sql portti 3306 (meeri käyttää XAMPP tietokannan hostaamiseen niin tässä 3307)
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ohtu',
  port: 3306,
});

connection.connect(error => {
  if (error) throw error;
  console.log('Onnistuneesti yhdistetty tietokantaan.');
});

module.exports = connection;