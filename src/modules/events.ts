export const Events = {
    Reducer: {
        APP_LOADED: 'event:app:load',
        USER_LOGGED_IN: 'event:user:login',
        USER_LOGGED_OUT: 'event:user:logout',
        USER_REGISTERED: 'event:user:register',
    },
    Bus: {
        LOGIN_FAILED: 'event:login:failed',
        LOGIN_SUCCEEDED: 'event:login:succeeded',
        LOGOUT_FAILED: 'event:logout:failed',
        LOGOUT_SUCCEEDED: 'event:logout:succeeded',
        REGISTRATION_FAILED: 'event:registration:failed',
        REGISTRATION_SUCCEEDED: 'event:registration:succeeded',
    }
};

export const Actions = {
    Reducer: {
        LOAD_APP: 'action:app:load',
        LOG_USER_IN: 'action:user:login',
        LOG_USER_OUT: 'action:user:logout',
        REGISTER_USER: 'action:user:register',
    }
};
