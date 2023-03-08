export type PokemonType =
    | 'grass'
    | 'flying'
    | 'fire'
    | 'bug'
    | 'fighting'
    | 'dark'
    | 'normal'
    | 'rock'
    | 'fairy'
    | 'psychic'
    | 'ghost'
    | 'electric'
    | 'poison'
    | 'ground'
    | 'steel'
    | 'dragon'
    | 'ice'
    | 'water';

export interface PokemonMetadata {
    name: string;
    dex_number: number;
    type_1: PokemonType;
    type_2: PokemonType | null;
    image_url: string;
    caught?: boolean;
}
