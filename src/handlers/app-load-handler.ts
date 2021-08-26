import { hasExpired } from "../clients/token";
import { IAction } from "../context/app-reducer";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:app:load:handler: ${message}`;
}

export const handleAppLoad = (dispatch: React.Dispatch<IAction>) => {

    console.debug(tag('handling app load'));

    const token = localStorage.getItem('token');

    if (!token) {
        console.debug(tag('no saved session found'));
    } else if (!hasExpired(token)) {
        console.debug(tag('found a saved session'));
        dispatch({ type: Events.Reducer.APP_LOADED, data: { token } });
    } else {
        console.debug(tag('saved session is expired'));
        localStorage.removeItem('token');
        console.info(tag('token has expired'));
    }
}
