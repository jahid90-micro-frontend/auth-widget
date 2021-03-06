import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Icon, Message, Table } from 'semantic-ui-react';

import { useAppContext, useDispatchContext } from '../context/AppContextProvider';
import { Actions, Events } from '../modules/events';
import { EventBus } from '../modules/event-bus';
import { ApiError } from '../clients/auth';
import Permissions from '../components/Permissions';
import Users from '../components/Users';

const tag = (message: string) => {
    return `:profile:component: ${message}`;
};

const Profile = () => {
    const dispatch = useDispatchContext();
    const { token, username, email } = useAppContext();
    const navigate = useNavigate();

    const [error, updateError] = useState({} as ApiError);

    const setError = (err: ApiError) => {
        updateError({
            ...error,
            message: err.message,
            data: error.data ? [...error.data, ...err.data] : [...err.data],
        });
    };

    const resetError = () => {
        updateError({} as ApiError);
    };

    const handleLogout = async () => {
        dispatch({ type: Actions.Reducer.LOG_USER_OUT, data: { token } });
    };

    const onLogoutSuccess = () => {
        console.debug(tag('logout succeeded'));
        resetError();

        navigate('/login');
    };

    const onLogoutFailure = (err: ApiError) => {
        console.debug(tag('logout failed'));
        setError(err);
    };

    const onUserDetailsFetchSuccess = () => {
        console.debug(tag('user details fetch succeeded'));
        resetError();
        // remove loading spinner
    };

    const onUserDetailsFetchFailure = (err: ApiError) => {
        console.debug(tag('user details fetch failed'));
        setError(err);
        // remove spinner
    };

    useEffect(() => {
        EventBus.on(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
        EventBus.on(Events.Bus.LOGOUT_FAILED, onLogoutFailure);
        EventBus.on(Events.Bus.USER_DETAILS_FETCH_SUCCEEDED, onUserDetailsFetchSuccess);
        EventBus.on(Events.Bus.USER_DETAILS_FETCH_FAILED, onUserDetailsFetchFailure);

        dispatch({ type: Actions.Reducer.FETCH_USER_DETAILS, data: { token } });
        dispatch({ type: Actions.Reducer.FETCH_USER_ROLES, data: { token } });

        return () => {
            EventBus.off(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
            EventBus.off(Events.Bus.LOGOUT_FAILED, onLogoutFailure);
            EventBus.off(Events.Bus.USER_DETAILS_FETCH_SUCCEEDED, onUserDetailsFetchSuccess);
            EventBus.off(Events.Bus.USER_DETAILS_FETCH_FAILED, onUserDetailsFetchFailure);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!username || !email) {
        // TODO: fetching (loading)
        return (
            // <Segment secondary className='profile-container page-container'>
            <div>
                <p>Fetching your profile.</p>
            </div>
            // </Segment>
        );
    }

    return (
        // <Segment secondary className='profile-container page-container'>
        <div>
            {error?.message && (
                <Message negative>
                    <Message.Header>{error.message}</Message.Header>
                    <Message.List>
                        {error.data?.map((message, idx) => (
                            <Message.Item key={idx}>{message}</Message.Item>
                        ))}
                    </Message.List>
                </Message>
            )}

            <h1>Welcome {username}!</h1>

            {/* <Segment tertiary> */}
            <div>
                <h2>Here's your account details</h2>

                {/* <Table columns={2} celled> */}
                <table>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={5}>Name</Table.HeaderCell>
                            <Table.Cell>{username}</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={5}>Email</Table.HeaderCell>
                            <Table.Cell>{email}</Table.Cell>
                        </Table.Row>
                    </Table.Header>
                </table>
                {/* </Table> */}
            </div>
            {/* </Segment> */}

            <Permissions setError={setError} resetError={resetError} />

            <Users setError={setError} resetError={resetError} />

            <div>
                <Button labeled icon labelPosition='right' color='red' onClick={handleLogout}>
                    <Icon name='log out' />
                    Logout
                </Button>
            </div>
        </div>
        // </Segment>
    );
};

export default Profile;
