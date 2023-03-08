import { useCallback, useMemo, useRef, useState } from 'react';
import { pokemonData as originalPokemonData } from './data/pokemon';
import { PokemonCard } from './PokemonCard';
import { PokemonType } from './types';

const TYPE_FILTER_OPTIONS: { value: PokemonType | 'any'; text: string }[] = [
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

export const PokemonListContainer = () => {
    const debounceTimerRef = useRef<number>();

    const [unfilteredPokemonData, setUnfilteredPokemonData] = useState(originalPokemonData);
    const [searchQuery, setSearchQuery] = useState('');
    const [type1Filter, setType1Filter] = useState<PokemonType | string>('any');
    const [type2Filter, setType2Filter] = useState<PokemonType | string>('any');

    const filteredPokeData = useMemo(() => {
        return unfilteredPokemonData.filter((dexData) => {
            return (
                (dexData.name.includes(searchQuery) || dexData.dex_number.toString().includes(searchQuery)) &&
                (type1Filter === 'any' || (type1Filter !== 'any' && dexData.type_1 === type1Filter)) &&
                (type2Filter === 'any' || (type2Filter !== 'any' && dexData.type_2 === type2Filter))
            );
        });
    }, [searchQuery, unfilteredPokemonData, type1Filter, type2Filter]);

    const debouncedInputChangeHandler = (value: string) => {
        clearTimeout(debounceTimerRef.current);
        debounceTimerRef.current = setTimeout(() => setSearchQuery(value), 300);
    };

    const markPokemonCaughtStatus = useCallback((pokemonName: string) => {
        const tempunfilteredPokemonDataCopy = [...unfilteredPokemonData];
        for (let i = 0; i < unfilteredPokemonData.length; i++) {
            if (tempunfilteredPokemonDataCopy[i].name === pokemonName) {
                tempunfilteredPokemonDataCopy[i].caught = !tempunfilteredPokemonDataCopy[i].caught;
            }
        }
        setUnfilteredPokemonData(tempunfilteredPokemonDataCopy);
    }, []);

    const caughtPokemonCount = useMemo(() => {
        return filteredPokeData.filter((p) => p.caught).length;
    }, [filteredPokeData]);

    return (
        <>
            <div className='mb-4 flex'>
                <div className='flex flex-col grow mr-2'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='pokemon-list-filter'>
                        Filter By Name or PokeDex Number
                    </label>
                    <input
                        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-12'
                        id='pokemon-list-filter'
                        type='text'
                        placeholder='Enter name or PokeDex Number...'
                        onChange={(e) => debouncedInputChangeHandler(e.target.value)}
                    />
                </div>

                <div className='flex flex-col mr-2'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='type-1-select'>
                        Type 1
                    </label>
                    <select
                        className='shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-12 w-full'
                        id='type-1-select'
                        onChange={(e) => setType1Filter(e.target.value)}
                        value={type1Filter}
                    >
                        {TYPE_FILTER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='flex flex-col'>
                    <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='type-2-select'>
                        Type 2
                    </label>
                    <select
                        className='shadow border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-12 w-full'
                        id='type-2-select'
                        onChange={(e) => setType2Filter(e.target.value)}
                        value={type2Filter}
                    >
                        {TYPE_FILTER_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <p>
                You have caught <strong>{caughtPokemonCount}</strong> out of <strong>{filteredPokeData.length}</strong>,
                or <strong>~{Math.round((caughtPokemonCount / (filteredPokeData.length || 1)) * 100)}%</strong>
            </p>

            <div className='grid gap-6 grid-cols-3 mt-4'>
                {filteredPokeData.map((pokemonEntry) => (
                    <PokemonCard
                        {...pokemonEntry}
                        markPokemonCaughtStatus={markPokemonCaughtStatus}
                        key={pokemonEntry.name}
                    />
                ))}
            </div>
        </>
    );
};
