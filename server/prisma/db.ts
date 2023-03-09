import { Pokemon, PrismaClient, User } from '@prisma/client';

export const db = new PrismaClient({
    log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
    ],
});

export const getAllPokemon = async (): Promise<Pokemon[]> => {
    let data: Pokemon[] = [];
    try {
        data = await db.pokemon.findMany();
    } catch (e) {
        console.error('Error while reading Pokemon from db', e);
        throw new Error(e.message);
    }
    return data;
};

export const addPokemon = async (pokemonData: Omit<Pokemon, 'id'>): Promise<void> => {
    const { dex_number } = pokemonData;
    try {
        await db.pokemon.upsert({
            where: {
                dex_number,
            },
            create: {
                ...pokemonData,
            },
            update: { ...pokemonData },
        });
    } catch (e) {
        console.error('Error while adding new Pokemon to db:', e.message);
        throw new Error(e.message);
    }
};

export const updatePokemonData = async (pokemonData: Pick<Pokemon, 'dex_number'>): Promise<void> => {
    const { dex_number } = pokemonData;
    try {
        await db.pokemon.update({
            where: {
                dex_number,
            },
            data: { ...pokemonData },
        });
    } catch (e) {
        console.error('Error while updating Pokemon in db', e);
        throw new Error(e.message);
    }
};

export const deletePokemon = async (dex_number: number): Promise<void> => {
    try {
        await db.pokemon.delete({
            where: {
                dex_number,
            },
        });
    } catch (e) {
        console.error('Error while removing Pokemon from db', e.message);
        throw new Error(e.message);
    }
};

export const getUserByEmail = async (username: string): Promise<User | null> => {
    try {
        const user: User =
            (await db.user.findUnique({
                where: { email: username },
            })) || null;
        return user;
    } catch (e) {
        console.error('Error while reading User from db', e);
        return null;
    }
};

db.$on('warn', (prismaWarn) => {
    console.warn(prismaWarn);
});
