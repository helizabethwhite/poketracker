import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { TYPE_FILTER_OPTIONS } from './constants';
import PokeBallIcon from './PokeBallIcon';
import { PokemonCard } from './PokemonCard';
import { initAppData, useAppStore } from './slices/appStore';
import { PokemonType } from './types';

export const PokemonListContainer = () => {
    const debounceTimerRef = useRef<number>();

    const apiPokemonData = useAppStore((state) => state.pokemon);

    const [unfilteredPokemonData, setUnfilteredPokemonData] = useState(apiPokemonData);
    const [searchQuery, setSearchQuery] = useState('');
    const [type1Filter, setType1Filter] = useState<PokemonType | string>('any');
    const [type2Filter, setType2Filter] = useState<PokemonType | string>('any');
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        async function fetchPokemonData() {
            if (!apiPokemonData.length) {
                await initAppData();
            }
        }
        fetchPokemonData();
    }, [apiPokemonData, initAppData]);

    useEffect(() => {
        if (apiPokemonData.length && !unfilteredPokemonData.length) {
            setUnfilteredPokemonData(apiPokemonData);
            setIsLoadingData(false);
        }
    }, [apiPokemonData]);

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

    const markPokemonCaughtStatus = useCallback(
        (pokemonName: string) => {
            const tempUnfilteredPokemonDataCopy = [...unfilteredPokemonData];
            for (let i = 0; i < unfilteredPokemonData.length; i++) {
                if (tempUnfilteredPokemonDataCopy[i].name === pokemonName) {
                    tempUnfilteredPokemonDataCopy[i].caught = !tempUnfilteredPokemonDataCopy[i].caught;
                }
            }
            setUnfilteredPokemonData(tempUnfilteredPokemonDataCopy);
        },
        [unfilteredPokemonData]
    );

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

            {isLoadingData ? (
                <div className='loading-ball mt-4 flex justify-center'>
                    <PokeBallIcon onClick={() => {}} shouldShowAsCaught={true} />
                </div>
            ) : (
                <>
                    <p>
                        You have caught <strong>{caughtPokemonCount}</strong> out of{' '}
                        <strong>{filteredPokeData.length}</strong>, or{' '}
                        <strong>~{Math.round((caughtPokemonCount / (filteredPokeData.length || 1)) * 100)}%</strong>
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
            )}
        </>
    );
};
