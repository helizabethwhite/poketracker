import { Pokemon } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import { addPokemon, deletePokemon, getAllPokemon, getUserByEmail, updatePokemonData } from './prisma/db';

const app = express();
const port = 3001;

app.use(
    cors({
        credentials: true,
        allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
        origin: ['http://127.0.0.1:5173', 'http://localhost:5173'],
    })
);

app.use(express.json());

/**
 * Middleware to add auth gate in front of admin-only endpoints.
 */
app.use('/pokemon/:dexNumber', async (req, res, next) => {
    if (req.headers.authorization) {
        const base64Credentials = req.headers.authorization.split(' ')[1];
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
        const [username, password] = credentials.split(':');
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
    try {
        const pokemonData = await getAllPokemon();
        res.json(pokemonData);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.patch('/pokemon/:dexNumber', async (req, res) => {
    const pokemonData: Pokemon = req.body;
    try {
        const dex_number = parseInt(req.params.dexNumber);
        await updatePokemonData({ ...pokemonData, dex_number });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.put('/pokemon/:dexNumber', async (req, res) => {
    const pokemonData: Pokemon = req.body;
    try {
        const dex_number = parseInt(req.params.dexNumber);
        await addPokemon({ ...pokemonData, dex_number });
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.delete('/pokemon/:dexNumber', async (req, res) => {
    try {
        const dex_number = parseInt(req.params.dexNumber);
        await deletePokemon(dex_number);
        res.sendStatus(200);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(port, () => {
    console.log(`PokeTracker server listening on port ${port}`);
});
