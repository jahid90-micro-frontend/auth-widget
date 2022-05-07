import { getAllUsers } from '../clients/auth';
import { IAction } from '../context/app-reducer';
import { EventBus } from '../modules/event-bus';
import { Events } from '../modules/events';

const tag = (message: string) => {
    return `:user:fetch:all:handler: ${message}`;
};

export const handleUsersFetchAll = (dispatch: React.Dispatch<IAction>, payload: Record<string, string> | undefined) => {
    console.debug(tag('handling user fetch all'));

    (async () => {
        try {
            if (!payload || !payload.token) {
                console.warn(tag('token is missing'));
                EventBus.emit(Events.Bus.USERS_FETCH_ALL_FAILED, { message: 'no active session was found', data: [] });
                return;
            }

            const data = await getAllUsers(payload.token);

            dispatch({ type: Events.Reducer.USERS_FETCH_ALL, data });
            EventBus.emit(Events.Bus.USERS_FETCH_ALL_SUCCEEDED);
        } catch (err: any) {
            // We might have already fetched all users when user had the permission
            // It failed now, let's remove the users
            dispatch({ type: Events.Reducer.USERS_FETCH_ALL, data: { users: [] } });
            EventBus.emit(Events.Bus.USERS_FETCH_ALL_FAILED, { message: err.message, data: err.data || [] });
        }
    })();
};
