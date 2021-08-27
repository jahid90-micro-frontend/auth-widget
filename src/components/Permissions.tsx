import { useState, useEffect } from 'react';
import { Checkbox, Segment } from 'semantic-ui-react';

import { useAppContext, useDispatchContext } from '../context/AppContextProvider';
import { Actions, Events } from '../modules/events';
import { EventBus } from '../modules/event-bus';
import { ApiError } from '../clients/auth';

const tag = (message: string) => {
    return `:permissions:component: ${message}`;
}

interface IPermissionsProps {
    setError: (err: ApiError) => void,
    resetError: () => void,
}

interface IPermission {
    role: string,
    isChecked: boolean,
}

const Permissions = ({ setError, resetError }: IPermissionsProps) => {
    const dispatch = useDispatchContext();
    const { token, roles } = useAppContext();

    const [error, updateError] = useState({} as ApiError);
    const [permissions, setPermissions] = useState([] as IPermission[]);
    const availablePermissions = [
        'users:list',
        'users:get',
        'users:delete'
    ];

    const handlePermissionToggle = async (permission: IPermission) => {
        // permission.isChecked has the previous state of the checkbox; so if it is false, role has been turned pn; so add
        !permission.isChecked && dispatch({ type: Actions.Reducer.ADD_USER_ROLE, data: { token, role: permission.role } });
        permission.isChecked && dispatch({ type: Actions.Reducer.REMOVE_USER_ROLE, data: { token, role: permission.role } });

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
    }

    const onUserRoleAddFailure = (err: ApiError) => {
        console.debug(tag('user role add failed'));
        setError(err);
    }

    const onUserRoleRemoveSuccess = () => {
        console.debug(tag('user role remove succeeded'));
        resetError();
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

        EventBus.on(Events.Bus.USER_ROLES_FETCH_SUCCEEDED, onUserRolesFetchSuccess);
        EventBus.on(Events.Bus.USER_ROLES_FETCH_FAILED, onUserRolesFetchFailure);
        EventBus.on(Events.Bus.USER_ROLE_ADD_SUCCEEDED, onUserRoleAddSuccess);
        EventBus.on(Events.Bus.USER_ROLE_ADD_FAILED, onUserRoleAddFailure);
        EventBus.on(Events.Bus.USER_ROLE_REMOVE_SUCCEEDED, onUserRoleRemoveSuccess);
        EventBus.on(Events.Bus.USER_ROLE_REMOVE_FAILED, onUserRoleRemoveFailure);

        dispatch({ type: Actions.Reducer.FETCH_USER_DETAILS, data: { token } });
        dispatch({ type: Actions.Reducer.FETCH_USER_ROLES, data: { token } });

        return () => {
            EventBus.off(Events.Bus.USER_ROLES_FETCH_SUCCEEDED, onUserRolesFetchSuccess);
            EventBus.off(Events.Bus.USER_ROLES_FETCH_FAILED, onUserRolesFetchFailure);
            EventBus.off(Events.Bus.USER_ROLE_ADD_SUCCEEDED, onUserRoleAddSuccess);
            EventBus.off(Events.Bus.USER_ROLE_ADD_FAILED, onUserRoleAddFailure);
            EventBus.off(Events.Bus.USER_ROLE_REMOVE_SUCCEEDED, onUserRoleRemoveSuccess);
            EventBus.off(Events.Bus.USER_ROLE_REMOVE_FAILED, onUserRoleRemoveFailure);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Segment tertiary >
            <p>Manage permissons: </p>

            {
                permissions.map((permission, idx) => (
                    <Checkbox
                        toggle
                        key = { idx }
                        label = { permission.role }
                        checked = { permission.isChecked }
                        onChange = {() => handlePermissionToggle(permission)}
                        className = 'permission--list--item'
                    />
            ))}
            </Segment>
    );
};

export default Permissions;
