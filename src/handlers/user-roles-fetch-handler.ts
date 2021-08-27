import { getRoles } from "../clients/auth";
import { IAction } from "../context/app-reducer";
import { EventBus } from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:roles:fetch:handler: ${message}`;
}

export const handleUserRolesFetch = (dispatch: React.Dispatch<IAction>, payload: (Record<string, string> | undefined)) => {

    console.debug(tag('handling user roles fetch'));

    (async () => {
        try {

            if (!payload || !payload.token) {
                console.warn(tag('token is missing'));
                EventBus.emit(Events.Bus.USER_ROLES_FETCH_FAILED, {
                    message: 'Roles fetch failed',
                    data: ['no active session was found'],
                });
                return;
            }

            const { roles } = await getRoles(payload.token);

            dispatch({ type: Events.Reducer.USER_ROLES_FETCHED, data: { roles } });
            EventBus.emit(Events.Bus.USER_ROLES_FETCH_SUCCEEDED);

        } catch (err) {
            console.debug(err);
            EventBus.emit(Events.Bus.USER_ROLES_FETCH_FAILED, { message: err.message, data: err.data || [] });
        }
    })();
}
