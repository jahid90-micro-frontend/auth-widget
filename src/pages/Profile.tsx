import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Message, Segment } from 'semantic-ui-react';

import { useAppContext, useDispatchContext } from '../context/AppContextProvider';
import { Actions, Events } from '../modules/events';
import { EventBus } from '../modules/event-bus';
import { ApiError } from '../clients/auth';

const tag = (message: string) => {
    return `:profile:component: ${message}`;
}

const Profile = () => {
    const { token, username, email } = useAppContext();
    const dispatch = useDispatchContext();
    const history = useHistory();
    const [error, setError] = useState({} as ApiError);

    const handleClick = async () => {
        dispatch({ type: Actions.Reducer.LOG_USER_OUT, data: { token } });
    };

    const onLogoutSuccess = () => {
        console.debug(tag('logout succeeded'));
        history.push('/login');
    }

    const onLogoutFailure = (data: ApiError) => {
        console.debug(tag('logout failed'));
        setError(data);
    }

    const onUserDetailsFetchSuccess = () => {
        console.debug(tag('user details fetch succeeded'));
        // remove loading spinner
    }

    const onUserDetailsFetchFailure = (err: ApiError) => {
        console.debug(tag('user details fetch failed'));
        // remove spinner
        setError(err);
    }

    useEffect(() => {

        EventBus.on(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
        EventBus.on(Events.Bus.LOGOUT_FAILED, onLogoutFailure);
        EventBus.on(Events.Bus.USER_DETAILS_FETCH_SUCCEEDED, onUserDetailsFetchSuccess);
        EventBus.on(Events.Bus.USER_DETAILS_FETCH_FAILED, onUserDetailsFetchFailure);

        dispatch({ type: Actions.Reducer.FETCH_USER_DETAILS, data: { token } });

        return () => {
            EventBus.off(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
            EventBus.off(Events.Bus.LOGOUT_FAILED, onLogoutFailure);
            EventBus.off(Events.Bus.USER_DETAILS_FETCH_SUCCEEDED, onUserDetailsFetchSuccess);
            EventBus.off(Events.Bus.USER_DETAILS_FETCH_FAILED, onUserDetailsFetchFailure);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!username || !email) {

        // TODO: fetching (loading)
        return (
            <Segment secondary className='profile-container page-container'>
                <p>Fetching your profile.</p>
            </Segment>
        );
    }

    return (
        <Segment secondary className='profile-container page-container'>
            {error?.message && (
                <Message negative>
                    <Message.Header>{error.message}</Message.Header>
                    <Message.List>
                        {error.data?.map((message, idx) => <Message.Item key={idx}>{message}</Message.Item>)}
                    </Message.List>
                </Message>
            )}

            <p>Hi {username}! This is the profile page.</p>

            <Segment tertiary>
                <p>Here's your account details</p>
                <p>Username: {username || '<missing>'}</p>
                <p>Email: {email || '<missing>'}</p>
            </Segment>

            <div>
                <Button basic color='red' onClick={handleClick}>
                    Logout
                </Button>
            </div>
        </Segment>
    );
};

export default Profile;
