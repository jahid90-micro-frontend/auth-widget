import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Checkbox, Message, Segment, Table } from 'semantic-ui-react';

import { useAppContext, useDispatchContext } from '../context/AppContextProvider';
import { Actions, Events } from '../modules/events';
import { EventBus } from '../modules/event-bus';
import { ApiError } from '../clients/auth';

const tag = (message: string) => {
    return `:profile:component: ${message}`;
}

interface IPermission {
    role: string,
    isChecked: boolean,
}

const Profile = () => {
    const dispatch = useDispatchContext();
    const { token, username, email, roles } = useAppContext();
    const history = useHistory();

    const [error, updateError] = useState({} as ApiError);
    const [permissions, setPermissions] = useState([] as IPermission[]);
    const availablePermissions = [
        'users:list',
        'users:get',
        'users:delete'
    ];

    const handleLogout = async () => {
        dispatch({ type: Actions.Reducer.LOG_USER_OUT, data: { token } });
    };

    const handlePermissionToggle = async (permission: IPermission) => {
        // permission.isChecked has the previous state of the checkbox; so if it is false, role has been turned pn; so add
        !permission.isChecked && dispatch({ type: Actions.Reducer.ADD_USER_ROLE, data: { token, role: permission.role } });
        permission.isChecked && dispatch({ type: Actions.Reducer.REMOVE_USER_ROLE, data: { token, role: permission.role } });

    }

    const setError = (err: ApiError) => {
        updateError({
            ...error,
            message: err.message,
            data: error.data ? [...error.data, ...err.data] : [...err.data],
        });
    }

    const resetError = () => {
        updateError({} as ApiError);
    }

    const onLogoutSuccess = () => {
        console.debug(tag('logout succeeded'));
        resetError();

        history.push('/login');
    }

    const onLogoutFailure = (err: ApiError) => {
        console.debug(tag('logout failed'));
        setError(err);

    }

    const onUserDetailsFetchSuccess = () => {
        console.debug(tag('user details fetch succeeded'));
        resetError();
        // remove loading spinner
    }

    const onUserDetailsFetchFailure = (err: ApiError) => {
        console.debug(tag('user details fetch failed'));
        setError(err);
        // remove spinner
    }

    const onUserRolesFetchSuccess = () => {
        console.debug(tag('user roles fetch succeeded'));
        resetError();
    }

    const onUserRolesFetchFailure = (err: ApiError) => {
        console.debug(tag('user roles fetch failed'));
        setError(err);
    }

    const onUserRoleAddSuccess = () => {
        console.debug(tag('user role add succeeded'));
        resetError();

        // the role was successfully added; lets update the list of current permissions
        // we could simulate it on the client side to save an api call
        // dispatch({ type: Actions.Reducer.FETCH_USER_ROLES, data: { token } });
    }

    const onUserRoleAddFailure = (err: ApiError) => {
        console.debug(tag('user role add failed'));
        setError(err);
    }

    const onUserRoleRemoveSuccess = () => {
        console.debug(tag('user role remove succeeded'));
        resetError();

        // the role was successfully removed; lets update the list of current permissions
        // we could simulate it on the client side to save an api call
        dispatch({ type: Actions.Reducer.FETCH_USER_ROLES, data: { token } });
    }

    const onUserRoleRemoveFailure = (err: ApiError) => {
        console.debug(tag('user role remove failed'));
        console.debug(tag(JSON.stringify(err)));
        setError(err);
    }

    useEffect(() => {
        console.debug(tag(`permissions before: ${JSON.stringify(permissions)}`));
        const updatedPermissions: IPermission[] = availablePermissions.map((role => {
            return {
                role,
                isChecked: roles.indexOf(role) !== -1,
            }
        }));

        console.debug(tag(`permissions after: ${JSON.stringify(updatedPermissions)}`));

        setPermissions(updatedPermissions);
        console.debug(tag('permissions updated'));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roles]);

    useEffect(() => {

        EventBus.on(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
        EventBus.on(Events.Bus.LOGOUT_FAILED, onLogoutFailure);
        EventBus.on(Events.Bus.USER_DETAILS_FETCH_SUCCEEDED, onUserDetailsFetchSuccess);
        EventBus.on(Events.Bus.USER_DETAILS_FETCH_FAILED, onUserDetailsFetchFailure);
        EventBus.on(Events.Bus.USER_ROLES_FETCH_SUCCEEDED, onUserRolesFetchSuccess);
        EventBus.on(Events.Bus.USER_ROLES_FETCH_FAILED, onUserRolesFetchFailure);
        EventBus.on(Events.Bus.USER_ROLE_ADD_SUCCEEDED, onUserRoleAddSuccess);
        EventBus.on(Events.Bus.USER_ROLE_ADD_FAILED, onUserRoleAddFailure);
        EventBus.on(Events.Bus.USER_ROLE_REMOVE_SUCCEEDED, onUserRoleRemoveSuccess);
        EventBus.on(Events.Bus.USER_ROLE_REMOVE_FAILED, onUserRoleRemoveFailure);

        dispatch({ type: Actions.Reducer.FETCH_USER_DETAILS, data: { token } });
        dispatch({ type: Actions.Reducer.FETCH_USER_ROLES, data: { token } });

        return () => {
            EventBus.off(Events.Bus.LOGOUT_SUCCEEDED, onLogoutSuccess);
            EventBus.off(Events.Bus.LOGOUT_FAILED, onLogoutFailure);
            EventBus.off(Events.Bus.USER_DETAILS_FETCH_SUCCEEDED, onUserDetailsFetchSuccess);
            EventBus.off(Events.Bus.USER_DETAILS_FETCH_FAILED, onUserDetailsFetchFailure);
            EventBus.off(Events.Bus.USER_ROLES_FETCH_SUCCEEDED, onUserRolesFetchSuccess);
            EventBus.off(Events.Bus.USER_ROLES_FETCH_FAILED, onUserRolesFetchFailure);
            EventBus.off(Events.Bus.USER_ROLE_ADD_SUCCEEDED, onUserRoleAddSuccess);
            EventBus.off(Events.Bus.USER_ROLE_ADD_FAILED, onUserRoleAddFailure);
            EventBus.off(Events.Bus.USER_ROLE_REMOVE_SUCCEEDED, onUserRoleRemoveSuccess);
            EventBus.off(Events.Bus.USER_ROLE_REMOVE_FAILED, onUserRoleRemoveFailure);
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

                <Table inverted columns={2}>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={5}>Name</Table.HeaderCell>
                            {/* <Table.Body> */}
                            <Table.Cell>{username}</Table.Cell>
                            {/* </Table.Body> */}
                        </Table.Row>
                    </Table.Header>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={5}>Email</Table.HeaderCell>
                            {/* <Table.Body> */}
                            <Table.Cell>{email}</Table.Cell>
                            {/* </Table.Body> */}
                        </Table.Row>
                    </Table.Header>
                </Table>
            </Segment>

            <Segment tertiary>
                <p>Manage permissons:</p>

                {permissions.map((permission, idx) => (
                    <Checkbox
                        toggle
                        key={idx}
                        label={permission.role}
                        checked={permission.isChecked}
                        onChange={() => handlePermissionToggle(permission)}
                        className='permission--list--item'
                    />
                ))}
            </Segment>

            <div>
                <Button basic color='red' onClick={handleLogout}>
                    Logout
                </Button>
            </div>
        </Segment>
    );
};

export default Profile;
