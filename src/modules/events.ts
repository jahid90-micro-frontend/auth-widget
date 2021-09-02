export const Events = {
    Reducer: {
        APP_LOADED: 'event:app:load',
        USER_LOGGED_IN: 'event:user:login',
        USER_LOGGED_OUT: 'event:user:logout',
        USER_REGISTERED: 'event:user:register',
        USER_DETAILS_FETCHED: 'event:user:details:fetch',
        USER_ROLES_FETCHED: 'event:user:roles:fetch',
        USER_ROLE_ADDED: 'event:user:role:add',
        USER_ROLE_REMOVED: 'event:user:role:remove',
        USERS_FETCH_ALL: 'event:users:fetch:all',
    },
    Bus: {
        LOGIN_SUCCEEDED: 'event:login:succeeded',
        LOGIN_FAILED: 'event:login:failed',
        LOGOUT_SUCCEEDED: 'event:logout:succeeded',
        LOGOUT_FAILED: 'event:logout:failed',
        REGISTRATION_SUCCEEDED: 'event:registration:succeeded',
        REGISTRATION_FAILED: 'event:registration:failed',
        USER_DETAILS_FETCH_SUCCEEDED: 'event:user:details:fetch:succeeded',
        USER_DETAILS_FETCH_FAILED: 'event:user:details:fetch:failed',
        USER_ROLES_FETCH_SUCCEEDED: 'event:user:roles:fetch:succeeded',
        USER_ROLES_FETCH_FAILED: 'event:user:roles:fetch:failed',
        USER_ROLE_ADD_SUCCEEDED: 'event:user:role:add:succeeded',
        USER_ROLE_ADD_FAILED: 'event:user:role:add:failed',
        USER_ROLE_REMOVE_SUCCEEDED: 'event:user:role:remove:succeeded',
        USER_ROLE_REMOVE_FAILED: 'event:user:role:remove:failed',
        USERS_FETCH_ALL_SUCCEEDED: 'event:users:fetch:all:succeeded',
        USERS_FETCH_ALL_FAILED: 'event:users:fetch:all:failed',
    }
};

export const Actions = {
    Reducer: {
        LOAD_APP: 'action:app:load',
        LOG_USER_IN: 'action:user:login',
        LOG_USER_OUT: 'action:user:logout',
        REGISTER_USER: 'action:user:register',
        FETCH_USER_DETAILS: 'action:user:details:fetch',
        FETCH_USER_ROLES: 'action:user:roles:fetch',
        ADD_USER_ROLE: 'action:user:role:add',
        REMOVE_USER_ROLE: 'action:user:role:remove',
        FETCH_ALL_USERS: 'action:users:fetch:all',
    }
};
