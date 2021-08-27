import { getDetails } from "../clients/auth";
import { IAction } from "../context/app-reducer";
import { EventBus } from "../modules/event-bus";
import { Events } from "../modules/events";

const tag = (message: string) => {
    return `:user:details:fetch:handler: ${message}`;
}

export const handleUserDetailsFetch = (dispatch: React.Dispatch<IAction>, payload: (Record<string, string> | undefined)) => {

    console.debug(tag('handling user details fetch'));

    (async () => {
        try {

            if (!payload || !payload.token) {
                console.warn(tag('token is missing'));
                EventBus.emit(Events.Bus.USER_DETAILS_FETCH_FAILED, { message: 'Token is missing' });
                return;
            }

            const data = await getDetails(payload.token);

            dispatch({ type: Events.Reducer.USER_DETAILS_FETCHED, data });
            EventBus.emit(Events.Bus.USER_DETAILS_FETCH_SUCCEEDED);

        } catch (err) {
            EventBus.emit(Events.Bus.USER_DETAILS_FETCH_FAILED, err);
        }
    })();
}
