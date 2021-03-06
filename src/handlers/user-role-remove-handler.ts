import { removeRole } from "../clients/auth";
import { IAction } from "../context/app-reducer";
import { EventBus } from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:role:remove:handler: ${message}`;
}

export const handleUserRoleRemove = (dispatch: React.Dispatch<IAction>, payload: (Record<string, string> | undefined)) => {

    console.debug(tag('handling user role remove'));

    (async () => {
        try {

            if (!payload || !payload.token) {
                console.warn(tag('token is missing'));
                EventBus.emit(Events.Bus.USER_ROLE_REMOVE_FAILED, {
                    message: 'Role removal failed',
                    data: ['no active session was found'],
                });
                return;
            }

            if (!payload.role) {
                console.debug(tag('role is missing'));
                EventBus.emit(Events.Bus.USER_ROLE_REMOVE_FAILED, {
                    message: 'Role removal failed',
                    data: ['no role was provided'],
                });
            }

            await removeRole(payload.token, payload.role);

            dispatch({ type: Events.Reducer.USER_ROLE_REMOVED, data: { role: payload.role } });
            EventBus.emit(Events.Bus.USER_ROLE_REMOVE_SUCCEEDED);

        } catch (err: any) {
            EventBus.emit(Events.Bus.USER_ROLE_REMOVE_FAILED, { message: err.message, data: err.data || [] });
        }
    })();
}
