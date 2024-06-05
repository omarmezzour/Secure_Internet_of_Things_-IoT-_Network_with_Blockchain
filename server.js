const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const dotenv = require('dotenv');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5500;

// Configuration des chemins pour les ressources statiques
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'js')));  // Ajout de ce chemin pour les scripts JS

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}));

const iotDevicesRoutes = require('./IoTDevices');
app.use('/api', iotDevicesRoutes);

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'apy',
    password: process.env.DB_PASSWORD || '0000',
    database: process.env.DB_NAME || 'IoT',
    ssl: { rejectUnauthorized: false }
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        process.exit(1);
    }
    console.log('Connected to MySQL database!');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.get('/home', (req, res) => {
    if (req.session.userId) {
        res.sendFile(path.join(__dirname, 'views', 'home.html'));
    } else {
        res.redirect('/');
    }
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) {
            console.error('Error searching for user:', err.message);
            res.status(500).send('Error during login');
            return;
        }
        if (results.length > 0) {
            if (password === results[0].password) {
                req.session.userId = results[0].id;
                res.redirect('/home');
            } else {
                res.send('Incorrect credentials');
            }
        } else {
            res.send('User not found');
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
