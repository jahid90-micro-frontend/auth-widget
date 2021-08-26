import { register } from "../clients/auth";
import { IAction } from "../context/app-reducer";
import EventBus from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:registration:handler: ${message}`;
}

export const handleUserRegistration = (dispatch: React.Dispatch<IAction>, data: Record<string, string> | undefined) => {

    console.debug(tag('handling user registration'));

    (async () => {
        try {

            if (!data || !data.username || !data.email || !data.password || !data.confirmPassword) {
                console.warn(tag('incomplete data received'));
                return;
            }

            const { username, email, password, confirmPassword } = data;
            await register(username, email, password, confirmPassword);

            dispatch({ type: Events.Reducer.USER_REGISTERED });

        } catch (err) {
            EventBus.emit(Events.Bus.REGISTRATION_FAILED, err);
        }
    })();
}
