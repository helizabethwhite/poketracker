import axios from 'axios';
import { create } from 'zustand';
import { buildRouteName, LOCAL_STORAGE_USER_ID_KEY } from '../constants';
import { PokemonMetadata } from '../types';

export interface UserStoreState {
    activeUserAuth: string;
    logIn: (username: string, password: string) => Promise<void>;
    logOut: () => Promise<void>;
    pokemon: PokemonMetadata[];
}

export const useAppStore = create<UserStoreState>((set) => ({
    activeUserAuth: window.localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY) || '',
    logIn: async (username: string, password: string) => {
        const { data: encryptedCred } = await axios.post(buildRouteName('/login'), { username, password });
        set({ activeUserAuth: encryptedCred });
        window.localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, encryptedCred);
    },
    logOut: async () => {
        await axios.post(buildRouteName('/logout'));
        set({ activeUserAuth: '' });
        window.localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, '');
    },
    pokemon: [],
}));

export const initAppData = async () => {
    const { data } = await axios.get(buildRouteName('/pokemon'));
    useAppStore.setState({ pokemon: data });
};
