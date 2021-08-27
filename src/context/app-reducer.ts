import { Dispatch } from 'react';

import { handleAppLoad } from '../handlers/app-load-handler';
import { handleUserDetailsFetch } from '../handlers/user-details-fetch-handler';
import { handleUserLogin } from '../handlers/user-login-handler';
import { handleUserLogout } from '../handlers/user-logout-handler';
import { handleUserRegistration } from '../handlers/user-registration-handler';
import { Actions, Events } from '../modules/events';

const tag = (message: string) => {
    return `:app:reducer: ${message}`;
}

export interface IAction {
    type: string,
    data?: Record<string, string>,
}

export interface IState {
    token: string,
    username: string,
    email: string,
}

export const initialState: IState = {
    token: '',
    username: '',
    email: '',
}

export const reducer = (state: IState, action: IAction): IState => {

    console.debug(tag(`current state: ${JSON.stringify(state)}`));
    console.debug(tag(`action: ${JSON.stringify(action)}`));

    switch (action.type) {
        case Events.Reducer.APP_LOADED:
            if (action.data) {
                return {
                    ...state,
                    token: action.data.token,
                }
            } else {
                return {
                    ...state,
                }
            }

        case Events.Reducer.USER_LOGGED_IN:
            if (action.data) {
                return {
                    ...state,
                    token: action.data.token,
                    username: action.data.username,
                    email: action.data.email,
                }
            } else {
                return {
                    ...state,
                }
            }

        case Events.Reducer.USER_LOGGED_OUT:
            return {
                ...state,
                token: '',
            };

        case Events.Reducer.USER_REGISTERED:
            if (action.data) {
                return {
                    ...state,
                    username: action.data.username,
                    email: action.data.email,
                }
            } else {
                return {
                    ...state,
                }
            }

        case Events.Reducer.USER_DETAILS_FETCHED:
            if (action.data) {
                return {
                    ...state,
                    username: action.data.username,
                    email: action.data.email,
                }
            } else {
                return {
                    ...state,
                }
            }

        default:
            return {
                ...state,
            };
    }
};

export const wrapDispatch = (dispatch: Dispatch<IAction>) => {
    return (action: IAction) => {
        console.info(tag(`received ${action.type}`));

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

            case Actions.Reducer.FETCH_USER_DETAILS:
                handleUserDetailsFetch(dispatch, action.data);
                break;

            default:
                console.debug(tag('no action matched - ' + action.type));
                dispatch(action);
                break;
        }
    };
};
