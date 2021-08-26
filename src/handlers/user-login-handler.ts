import { login } from "../clients/auth";
import { set } from "../clients/token";
import { IAction } from "../context/app-reducer";
import EventBus from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:login:handler: ${message}`;
}

export const handleUserLogin = (dispatch: React.Dispatch<IAction>, payload: (Record<string, string> | undefined)) => {

    console.debug(tag('handling user login'));

    (async () => {
        try {
            if (!payload || !payload.username || !payload.password) {
                console.warn(tag('received incomplete data'));
                return;
            }

            const { username, password } = payload;
            const token = await login(username, password);

            if (!token) {
                console.warn(tag('token is undefined!'));
                return;
            }

            set(token);
            dispatch({ type: Events.Reducer.USER_LOGGED_IN, data: { token } });
            EventBus.emit(Events.Bus.LOGIN_SUCCEEDED);

        } catch (err) {
            EventBus.emit(Events.Bus.LOGIN_FAILED, err);
        }
    })();
}
