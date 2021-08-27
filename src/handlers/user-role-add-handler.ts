import { addRole } from "../clients/auth";
import { IAction } from "../context/app-reducer";
import { EventBus } from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:role:add:handler: ${message}`;
}

export const handleUserRoleAdd = (dispatch: React.Dispatch<IAction>, payload: (Record<string, string> | undefined)) => {

    console.debug(tag('handling user role add'));

    (async () => {
        try {

            if (!payload || !payload.token) {
                console.warn(tag('token is missing'));
                EventBus.emit(Events.Bus.USER_ROLE_ADD_FAILED, {
                    message: 'Role add failed',
                    data: ['no active session was found'],
                });
                return;
            }

            await addRole(payload.token, payload.role);

            dispatch({ type: Events.Reducer.USER_ROLE_ADDED, data: { role: payload.role } });
            EventBus.emit(Events.Bus.USER_ROLE_ADD_SUCCEEDED);

        } catch (err) {
            EventBus.emit(Events.Bus.USER_ROLE_ADD_FAILED, { message: err.message, data: err.data || [] });
        }
    })();
}
