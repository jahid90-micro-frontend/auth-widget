import { register } from "../clients/auth";
import { IAction } from "../context/app-reducer";
import { EventBus } from "../modules/event-bus";
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
                EventBus.emit(Events.Bus.REGISTRATION_FAILED, {
                    message: 'Registration failed',
                    data: ['please fill in all the fields']
                });
                return;
            }

            const { username, email, password, confirmPassword } = data;

            if (password !== confirmPassword) {
                EventBus.emit(Events.Bus.REGISTRATION_FAILED, {
                    message: 'Registration failed',
                    data: ['passwords do not match']
                });
                return;
            }

            await register(username, email, password);

            dispatch({ type: Events.Reducer.USER_REGISTERED, data: { username, email } });
            EventBus.emit(Events.Bus.REGISTRATION_SUCCEEDED);

        } catch (err: any) {
            EventBus.emit(Events.Bus.REGISTRATION_FAILED, { message: err.message, data: err.data || [] });
        }
    })();
}
