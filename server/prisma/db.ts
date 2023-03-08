import { Pokemon, PrismaClient, User } from '@prisma/client';

export const db = new PrismaClient({
    log: [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
    ],
});

export const getPokemon = async (): Promise<Pokemon[]> => {
    let data: Pokemon[] = [];
    try {
        data = await db.pokemon.findMany();
    } catch (e) {
        console.error('Error while reading Pokemon from db', e);
    }
    return data;
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

db.$on('error', (prismaError) => {
    console.error(prismaError);
});

db.$on('warn', (prismaWarn) => {
    console.warn(prismaWarn);
});
