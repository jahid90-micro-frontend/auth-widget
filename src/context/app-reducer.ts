import { Dispatch } from 'react';

import { handleAppLoad } from '../handlers/app-load-handler';
import { handleUserDetailsFetch } from '../handlers/user-details-fetch-handler';
import { handleUserLogin } from '../handlers/user-login-handler';
import { handleUserLogout } from '../handlers/user-logout-handler';
import { handleUserRegistration } from '../handlers/user-registration-handler';
import { handleUserRoleAdd } from '../handlers/user-role-add-handler';
import { handleUserRoleRemove } from '../handlers/user-role-remove-handler';
import { handleUserRolesFetch } from '../handlers/user-roles-fetch-handler';
import { handleUsersFetchAll } from '../handlers/users-fetch-all-handler';
import { Actions, Events } from '../modules/events';

const tag = (message: string) => {
    return `:app:reducer: ${message}`;
}

export interface IAction {
    type: string,
    data?: Record<string, any>,
}

export interface IUser {
    username: string,
    email: string,
}

export interface IState {
    token: string,
    username: string,
    email: string,
    roles: string[],
    users: IUser[],
}

export const initialState: IState = {
    token: '',
    username: '',
    email: '',
    roles: [],
    users: [],
}

export const reducer = (state: IState, action: IAction): IState => {

    console.debug(tag(`current state: ${JSON.stringify(state)}`));
    console.debug(tag(`action: ${JSON.stringify(action)}`));

    switch (action.type) {
        case Events.Reducer.APP_LOADED:
            return {
                ...state,
                token: action.data?.token || '',
            }

        case Events.Reducer.USER_LOGGED_IN:
            return {
                ...state,
                token: action.data?.token || '',
                username: action.data?.username || '',
                email: action.data?.email || '',
            }

        case Events.Reducer.USER_LOGGED_OUT:
            return {
                ...state,
                token: '',
            };

        case Events.Reducer.USER_REGISTERED:
            return {
                ...state,
                username: action.data?.username,
                email: action.data?.email,
            }

        case Events.Reducer.USER_DETAILS_FETCHED:
            return {
                ...state,
                username: action.data?.username || '',
                email: action.data?.email || '',
            }

        case Events.Reducer.USER_ROLES_FETCHED:
            return {
                ...state,
                roles: action.data?.roles || [],
            }

        case Events.Reducer.USER_ROLE_ADDED:
            return {
                ...state,
                roles: action.data?.role && state.roles.indexOf(action.data.role) === -1
                ? [...state.roles, action.data.role]
                : [...state.roles]
            }

        case Events.Reducer.USER_ROLE_REMOVED:
            return {
                ...state,
                roles: (action.data?.role && state.roles.filter(r => r !== action.data?.role)) || [...state.roles]
            }

        case Events.Reducer.USERS_FETCH_ALL:
            return {
                ...state,
                users: action.data?.users || [],
            }

        default:
            console.debug(tag(`received unidentified event: ${action.type}`));
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

            case Actions.Reducer.FETCH_USER_ROLES:
                handleUserRolesFetch(dispatch, action.data);
                break;

            case Actions.Reducer.ADD_USER_ROLE:
                handleUserRoleAdd(dispatch, action.data);
                break;

            case Actions.Reducer.REMOVE_USER_ROLE:
                handleUserRoleRemove(dispatch, action.data);
                break;

            case Actions.Reducer.FETCH_ALL_USERS:
                handleUsersFetchAll(dispatch, action.data);
                break;

            default:
                console.debug(tag('no actions matched - ' + action.type));
                dispatch(action);
                break;
        }
    };
};
