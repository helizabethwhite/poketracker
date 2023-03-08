import axios from 'axios';
import { create } from 'zustand';
import { buildRouteName, LOCAL_STORAGE_USER_ID_KEY } from '../constants';
import { PokemonMetadata } from '../types';

export interface UserStoreState {
    activeUserId: string;
    logIn: (id: string) => Promise<void>;
    logOut: () => Promise<void>;
    createUser: (username: string) => Promise<void>;
    pokemon: PokemonMetadata[];
    fetchAndSetPokemon: () => Promise<void>;
}

export const useAppStore = create<UserStoreState>((set) => ({
    activeUserId: window.localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY) || '',
    logIn: async (id: string) => {
        await axios.post(buildRouteName('/login'), { id });
        set({ activeUserId: id });
        window.localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, id);
    },
    createUser: async (username) => {
        await axios.post(buildRouteName('/users'), { username });
    },
    logOut: async () => {
        await axios.post(buildRouteName('/logout'));
        set({ activeUserId: '' });
        window.localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, '');
    },
    pokemon: [],
    fetchAndSetPokemon: async () => {
        try {
            const { data } = await axios.get(buildRouteName('/pokemon'));
            set({ pokemon: data });
        } catch (e) {
            console.error(e);
        }
    },
}));

export const initData = async () => {
    const { data } = await axios.get(buildRouteName('/pokemon'));
    useAppStore.setState({ pokemon: data });
};
