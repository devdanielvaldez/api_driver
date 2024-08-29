const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: '57.154.209.80',
  user: 'admin',
  password: 'Prueba01*',
  database: 'u675638840_myride_prod'
});

// Promisify para facilitar el uso con async/await
const promisePool = pool.promise();

app.get('/', (req, res) => {
    fs.readFile(__dirname + '/public/index.html', 'utf8', (err, text) => {
        res.send(text);
    });
});

app.get('/driver-locations', async (req, res) => {
  try {
    // Consulta para obtener ubicaciones de conductores junto con los detalles del usuario
    const [rows] = await promisePool.query(
      `SELECT u.full_name, u.phone, u.identification_number, l.latitude, l.longitude, l.user_id
       FROM user_last_locations l
       JOIN users u ON l.user_id = u.id
       WHERE l.type = 'driver'`
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
