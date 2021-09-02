import { useEffect, useState } from 'react';
import { Button, Icon, Message, Segment } from 'semantic-ui-react';

import { ApiError } from "../clients/auth";
import { IUser } from '../context/app-reducer';
import { useAppContext, useDispatchContext } from '../context/AppContextProvider';
import { EventBus } from '../modules/event-bus';
import { Actions, Events } from '../modules/events';

const tag = (message: string) => {
    return `:users:component: ${message}`;
}

interface IUsersProps {
    setError: (err: ApiError) => void,
    resetError: () => void,
}

const Users = ({ setError, resetError }: IUsersProps) => {
    const dispatch = useDispatchContext();
    const { token, users } = useAppContext();

    const [displayUsers, setDisplayUsers] = useState([] as IUser[]);

    const handleListRefresh = () => {
        dispatch({ type: Actions.Reducer.FETCH_ALL_USERS, data: { token } });
    }

    const onUsersFetchAllSuccess = () => {
        console.debug(tag('fetch all users succeeded'));
        resetError();
    }

    const onUsersFetchAllFailure = (err: ApiError) => {
        console.debug(tag('fetch all users failed'));
        setError(err);
    }

    useEffect(() => {
        setDisplayUsers(users);
    }, [users]);

    useEffect(() => {

        EventBus.on(Events.Bus.USERS_FETCH_ALL_SUCCEEDED, onUsersFetchAllSuccess);
        EventBus.on(Events.Bus.USERS_FETCH_ALL_FAILED, onUsersFetchAllFailure);

        dispatch({ type: Actions.Reducer.FETCH_ALL_USERS, data: { token } });

        return () => {
            EventBus.off(Events.Bus.USERS_FETCH_ALL_SUCCEEDED, onUsersFetchAllSuccess);
            EventBus.off(Events.Bus.USERS_FETCH_ALL_FAILED, onUsersFetchAllFailure);
        }
        // eslint-disable-next-line
    }, []);

    return (
        <Segment tertiary>
            <h2>Manage Users</h2>

            <Button labeled icon labelPosition='right' color='green' onClick={handleListRefresh}>
                <Icon name='sync' />
                Refresh
            </Button>

            {displayUsers.map(({ username, email }, idx) => (
                <Message key={idx}>
                    <Message.Header><Icon name='user' />{username}</Message.Header>
                    <div>The user can be reached at: <Icon name='envelope outline' /> <a href={`mailto:${email}`}>{email}</a></div>
                </Message>
            ))}

        </Segment>
    )
}

export default Users;
