import { logout } from "../clients/auth";
import { clear } from "../clients/token";
import { IAction } from "../context/app-reducer"
import { EventBus } from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:logout:handler: ${message}`;
}

export const handleUserLogout = (dispatch: React.Dispatch<IAction>, data: (Record<string, string> | undefined)) => {

    console.debug(tag('handling user logout'));

    (async () => {
        try {

            if (!data || !data.token) {
                console.warn(tag('data or token is undefined'));
                EventBus.emit(Events.Bus.LOGOUT_FAILED, {
                    message: 'Logout failed',
                    data: ['no active session was found']
                });
                return;
            }

            const token = data.token;
            await logout(token);
            clear();

            dispatch({ type: Events.Reducer.USER_LOGGED_OUT });
            EventBus.emit(Events.Bus.LOGOUT_SUCCEEDED);

        } catch (err: any) {
            EventBus.emit(Events.Bus.LOGOUT_FAILED, { message: err.messsage, data: err.data || [] });
        }
    })();
}
