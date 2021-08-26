import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Message, Segment } from 'semantic-ui-react';

import { useAppContext, useDispatchContext } from '../context/AppContextProvider';
import { decode } from '../clients/token';
import { Actions, Events } from '../modules/events';
import { EventBus } from '../modules/event-bus';
import { ApiError } from '../clients/auth';

const Profile = () => {
    const { token } = useAppContext();
    const decoded = decode(token);
    const dispatch = useDispatchContext();
    const history = useHistory();
    const [error, setError] = useState({} as ApiError)

    const handleClick = async () => {
        dispatch({ type: Actions.Reducer.LOG_USER_OUT, data: { token } });
    };

    const onLogoutSuccess = () => {
        history.push('/login');
    }

    const onLogoutFailure = (data: ApiError) => {
        setError(data);
    }

    useEffect(() => {

        EventBus.on(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
        EventBus.on(Events.Bus.LOGOUT_FAILED, onLogoutFailure);

        return () => {
            EventBus.off(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
            EventBus.off(Events.Bus.LOGOUT_FAILED, onLogoutFailure);
        }
    });

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

            <p>Hi {decoded.username || 'stranger'}! This is the profile page.</p>

            <Segment tertiary>
                <p>Here's your account details</p>
                <p>Username: {decoded.username || '<missing>'}</p>
                <p>Email: {decoded.email || '<missing>'}</p>
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
