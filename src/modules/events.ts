export const Events = {
    Reducer: {
        APP_LOADED: 'event:app:load',
        USER_LOGGED_IN: 'event:user:login',
        USER_LOGGED_OUT: 'event:user:logout',
        USER_REGISTERED: 'event:user:register',
        USER_DETAILS_FETCHED: 'event:user:details:fetch'
    },
    Bus: {
        LOGIN_FAILED: 'event:login:failed',
        LOGIN_SUCCEEDED: 'event:login:succeeded',
        LOGOUT_FAILED: 'event:logout:failed',
        LOGOUT_SUCCEEDED: 'event:logout:succeeded',
        REGISTRATION_FAILED: 'event:registration:failed',
        REGISTRATION_SUCCEEDED: 'event:registration:succeeded',
        USER_DETAILS_FETCH_SUCCEEDED: 'event:user:details:fetch:succeeded',
        USER_DETAILS_FETCH_FAILED: 'event:user:details:fetch:failed',
    }
};

export const Actions = {
    Reducer: {
        LOAD_APP: 'action:app:load',
        LOG_USER_IN: 'action:user:login',
        LOG_USER_OUT: 'action:user:logout',
        REGISTER_USER: 'action:user:register',
        FETCH_USER_DETAILS: 'action:user:details:fetch',
    }
};
