import axios from 'axios';

const tag = (message: string) => {
    return `:auth:service: ${message}`;
}

const auth = axios.create({
    // extract to env; setup react/nginx to read env
    baseURL: '/api',
    withCredentials: true,
});

export class ApiError extends Error {

    message: string;
    data: string[];

    constructor(message = '', data: string[] = []) {
        super();

        this.message = message;
        this.data = data;
    }
}

type Error = {
    request: any,
    response: {
        status: number,
        data: {
            error: {
                message: string,
                data: string[]
            }
        }
    },
    message: string,
}

const wrapError = (error: Error) => {

    if (error.response) {

        console.debug(error.response);

        if (error.response.status === 401) {
            // token was invalid; sessio is probably expired
            // renew token and retry request
            // for current impl, should we ask user to logout and login again or just trigger a logout?
            return new ApiError('Session expired', ['please logout and login again']);
        } else if (error.response.data.error) {
            const { message, data } = error.response.data.error;
            return new ApiError(message, data);
        } else {
            // if no error object is set in the response; could happed for 404, for e.g.
            const { status } = error.response;
            return new ApiError(String(status), []);
        }

    } else if (error.request) {
        console.debug(error.request);
    } else {
        console.debug(tag(error.message));
    }

    return error;
}

export const register = async (username: string, email: string, password: string): Promise<void> => {

    console.debug(tag(`request: register user - ${username}`));

    try {

        const response = await auth.post('/register', { username, email, password });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

    } catch (error) {
        throw wrapError(error as Error);
    }
};

export const login = async (username: string, password: string): Promise<string> => {

    console.debug(tag(`request: login user: ${username}`));

    try {

        const response = await auth.post('/login', {
            username,
            password,
        });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

        return response.data.accessToken;

    } catch (error) {
        throw wrapError(error as Error);
    }
};

export const logout = async (token: string): Promise<void> => {

    console.debug(tag('request: logout user'));

    try {

        const response = await auth.delete('/logout', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

    } catch (error) {

        if ((error as Error).response.status === 401) {
            console.debug(tag('token is expired, going ahead with logout'));
            return;
        }

        throw wrapError(error as Error);
    }
};

export const refresh = async (): Promise<string> => {

    console.debug(tag('request: refresh token'));

    try {

        const response = await auth.post('/renew');

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

        return response.data.accessToken;

    } catch (error) {
        throw wrapError(error as Error);
    }
};

export const getDetails = async (token: string): Promise<Record<string, string>> => {

    console.debug(tag('request: fetch user details'));

    try {

        const response = await auth.get('/users/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

        const { username, email } = response.data;
        return {
            username,
            email,
        }

    } catch (error) {
        throw wrapError(error as Error);
    }

}

export const getRoles = async (token: string): Promise<Record<string, string>> => {

    console.debug(tag('request: fetch user roles'));

    try {

        const response = await auth.get('/users/me/roles', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

        const { roles } = response.data;
        return {
            roles
        }

    } catch (error) {
        throw wrapError(error as Error);
    }

}

export const addRole = async (token: string, role: string): Promise<void> => {

    console.debug(tag('request: add user role'));

    try {

        const response = await auth.post('/users/me/roles/add', {
            role
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

    } catch (error) {
        throw wrapError(error as Error);
    }

}

export const removeRole = async (token: string, role: string): Promise<void> => {

    console.debug(tag('request: remove user role'));

    try {

        const response = await auth.post('/users/me/roles/remove', {
            role
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

    } catch (error) {
        throw wrapError(error as Error);
    }

}

export const getAllUsers = async (token: string): Promise<Record<string, any>> => {

    console.debug(tag('request: fetch all users'));

    try {

        const response = await auth.get('/users/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.debug(tag(`response: ${JSON.stringify(response.data) || {}}`));

        return {
            users: response.data,
        }

    } catch (error) {
        throw wrapError(error as Error);
    }

}
