import React from 'react';
import PokeBallIcon from './PokeBallIcon';
import { PokemonMetadata } from './types';

interface PokemonCardProps extends PokemonMetadata {
    markPokemonCaughtStatus: (name: string) => void;
}

export const PokemonCard = React.memo((props: PokemonCardProps) => {
    const { name, dex_number, type_1, type_2, image_url, caught, markPokemonCaughtStatus } = props;
    const onToggleCaught = () => {
        markPokemonCaughtStatus(name);
    };

    return (
        <div className={`${caught ? 'bg-green-400 ' : ''}p-2 flex justify-evenly border rounded-lg bg-white text-sm`}>
            <div className='flex flex-col self-center'>
                <PokeBallIcon onClick={onToggleCaught} shouldShowAsCaught={!!caught} />
            </div>
            <div className='flex flex-col items-center w-3/4'>
                <p className='font-bold capitalize'>{name}</p>
                <p className='font-bold mt-1'>{`#${dex_number}`}</p>
                <img className='w-12 h-12 my-1' src={image_url} />
                <div className='flex mt-2'>
                    <div className={`type-icon ${type_1}`} />
                    {type_2 && <div className={`type-icon ${type_2}`} />}
                </div>
            </div>
        </div>
    );
});
