const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();
const port = 8080;

const characters = ['Frodo Baggins', 'Gandalf', 'Aragorn', 'Legolas', 'Gimli'];
const hmacSecret = 'lotr-server-example';

app.use(bodyParser.json());

// GET /character endpoint
app.get('/character', (req, res) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const character = characters[randomIndex];
    res.json(character);
});

// POST /character endpoint with HMAC authentication
app.post('/character', (req, res) => {
    const token = req.headers['x-token'];

    if (!verifyToken(token, hmacSecret)) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { name, birthYear } = req.body;
    res.status(201).json({ message: `New character named ${name} has been born in ${birthYear} successfully` });
});

function verifyToken(token, secretKey) {
    const expectedToken = crypto
        .createHmac('sha256', secretKey)
        .digest('hex');

    return expectedToken === token;
}

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
