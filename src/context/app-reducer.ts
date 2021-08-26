import { Dispatch } from 'react';

import { handleAppLoad } from '../handlers/app-load-handler';
import { handleUserLogin } from '../handlers/user-login-handler';
import { handleUserLogout } from '../handlers/user-logout-handler';
import { handleUserRegistration } from '../handlers/user-registration-handler';
import { Actions, Events } from '../modules/events';

const tag = (message: string) => {
    return `:app:reducer: ${message}`;
}

export interface IState {
    token: string;
}

export interface IAction {
    type: string;
    data?: Record<string, string>;
}

export const reducer = (state: IState, action: IAction): IState => {
    switch (action.type) {
        case Events.Reducer.APP_LOADED:
            return {
                ...state,
                token: action.data?.token as string,
            };

        case Events.Reducer.USER_LOGGED_IN:
            return {
                ...state,
                token: action.data?.token as string,
            };

        case Events.Reducer.USER_LOGGED_OUT:
            return {
                ...state,
                token: '',
            };

        case Events.Reducer.USER_REGISTERED:
            return {
                ...state,
            };

        default:
            return {
                ...state,
            };
    }
};

export const wrapDispatch = (dispatch: Dispatch<IAction>) => {
    return (action: IAction) => {
        console.info(tag(`received ${action.type}`));

        // TODO - consider removing all locals to not need the curly braces hack; just use well-named functions?
        switch (action.type) {
            case Actions.Reducer.LOAD_APP:
                handleAppLoad(dispatch);
                break;

            case Actions.Reducer.LOG_USER_IN:
                handleUserLogin(dispatch, action.data);
                break;

            case Actions.Reducer.LOG_USER_OUT:
                handleUserLogout(dispatch, action.data);
                break;

            case Actions.Reducer.REGISTER_USER:
                handleUserRegistration(dispatch, action.data);
                break;

            default:
                console.debug(tag('no action matched - ' + action.type));
                dispatch(action);
                break;
        }
    };
};
