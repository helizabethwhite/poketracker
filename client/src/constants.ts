import { PokemonType } from './types';

export const buildRouteName = (endpointSuffix: string) => `http://localhost:3001${endpointSuffix}`;

export const LOCAL_STORAGE_USER_ID_KEY = 'USER_ID';

export const TYPE_FILTER_OPTIONS: { value: PokemonType | 'any'; text: string }[] = [
    {
        value: 'any',
        text: 'Any',
    },
    {
        value: 'grass',
        text: 'Grass',
    },
    {
        value: 'flying',
        text: 'Flying',
    },
    {
        value: 'fire',
        text: 'Fire',
    },
    {
        value: 'bug',
        text: 'Bug',
    },
    {
        value: 'fighting',
        text: 'Fighting',
    },
    {
        value: 'dark',
        text: 'Dark',
    },
    {
        value: 'normal',
        text: 'Normal',
    },
    {
        value: 'rock',
        text: 'Rock',
    },
    {
        value: 'fairy',
        text: 'Fairy',
    },
    {
        value: 'psychic',
        text: 'Psychic',
    },
    {
        value: 'ghost',
        text: 'Ghost',
    },
    {
        value: 'electric',
        text: 'Electric',
    },
    {
        value: 'poison',
        text: 'Poison',
    },
    {
        value: 'ground',
        text: 'Ground',
    },
    {
        value: 'steel',
        text: 'Steel',
    },
    {
        value: 'dragon',
        text: 'Dragon',
    },
    {
        value: 'ice',
        text: 'Ice',
    },
    {
        value: 'water',
        text: 'Water',
    },
];
