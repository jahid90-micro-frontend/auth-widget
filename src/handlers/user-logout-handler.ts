import { logout } from "../clients/auth";
import { clear } from "../clients/token";
import { IAction } from "../context/app-reducer"
import EventBus from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:logout:handler: ${message}`;
}

export const handleUserLogout = (dispatch: React.Dispatch<IAction>, data: (Record<string, string> | undefined)) => {

    console.debug(tag('hanlding user logout'));

    (async () => {
        try {

            if (!data || !data.token) {
                console.warn(tag('data or token is undefined'));
                return;
            }

            const token = data.token;
            await logout(token);
            await clear();

            localStorage.removeItem('token');

            dispatch({ type: Events.Reducer.USER_LOGGED_OUT });

        } catch (err) {
            EventBus.emit(Events.Bus.LOGOUT_FAILED, err);
        }
    })();
}
