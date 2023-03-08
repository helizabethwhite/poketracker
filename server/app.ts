import cors from 'cors';
import express from 'express';
import { getPokemon, getUserByEmail } from './prisma/db';

const app = express();
const port = 3001;

app.use(
    cors({
        credentials: true,
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    })
);

app.use('/pokemon/:dexNumber', async (req, res, next) => {
    if (req.headers.authorization) {
        console.log('auth received:', req.headers.authorization);
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');
        console.log(username, password);
        const user = await getUserByEmail(username);
        if (user && user.password === password) {
            next();
            return;
        }
    }

    res.status(401);
    res.send('Unauthorized');
});

app.get('/pokemon', async (req, res) => {
    const pokemonData = await getPokemon();
    return res.json(pokemonData);
});

app.post('/pokemon/:dexNumber', async (req, res) => {
    console.log('Reached POST /pokemon/:dexNumber');
});

app.put('/pokemon/:dexNumber', async (req, res) => {
    console.log('Reached PUT /pokemon/:dexNumber');
});

app.delete('/pokemon/:dexNumber', async (req, res) => {
    console.log('Reached DELETE /pokemon/:dexNumber');
});

app.listen(port, () => {
    console.log(`PokeTracker server listening on port ${port}`);
});
