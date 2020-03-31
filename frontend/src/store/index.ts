import React from 'react';
import { isAuthenticated } from '../services/auth';
import { ITool } from '../services/tools.service';

type State = {
    isLogged: boolean;
    tools: ITool[]
    error?: string;
}

export type AppActions =
    | { type: 'logged', value: boolean }
    | { type: 'error', error: string }
    | { type: 'tools', values: ITool[] };

export const initialState:State = {
    isLogged: isAuthenticated(),
    tools: []
}

export function AppReducer(state: State, action: AppActions): State {
    switch (action.type) {
        case 'logged':
            return { ...state, isLogged: action.value };
        case 'error':
                return { ...state, error: action.error };
        case 'tools':
            return { ...state, tools: action.values };     
    }
}

export const AppContext = React.createContext<{
    state: typeof initialState;
    dispatch: (action: AppActions) => void;
  }>({
    state: initialState,
    dispatch: () => {}
  });