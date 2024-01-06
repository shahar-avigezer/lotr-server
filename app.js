const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

const characters = ['Frodo Baggins', 'Gandalf', 'Aragorn', 'Legolas', 'Gimli'];
const hmacSecret = 'lotr-server-example';

app.use(bodyParser.json());

// GET /characters endpoint
app.get('/characters', (req, res) => {
    res.json(characters);
});

// POST /movie endpoint with HMAC authentication
app.post('/movie', (req, res) => {
    const token = req.headers['x-token'];

    if (!verifyToken(token, hmacSecret)) {
        res.status(401).send('Unauthorized');
        return;
    }

    const { title, releaseYear } = req.body;
    res.status(201).json({ message: `Movie was saved successfully with title: ${title} and releaseYear: ${releaseYear}` });
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
