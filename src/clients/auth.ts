import axios from 'axios';

const tag = (message: string) => {
    return `:auth:service: ${message}`;
}

const auth = axios.create({
    // extract to env; setup react/nginx to read env
    baseURL: '/api',
    withCredentials: true,
});

interface ILoginResponse {
    data: {
        accessToken: string
    }
}

export class ApiError extends Error {

    message: string;
    data: string[];

    constructor(message = '', data = []) {
        super();

        this.message = message;
        this.data = data;
    }
}

const wrapError = (error: any) => {

    if (error.response) {

        console.debug(error.response);

        const { message, data } = error.response.data.error;
        const err = new ApiError(message, data);

        return err;

    } else if (error.request) {
        console.debug(error.request);
    } else {
        console.debug(tag(error.message));
    }

    return error;
}

export const register = async (username: string, email: string, password: string): Promise<void> => {

    console.debug(tag('received request to login user: ' + username));

    try {

        await auth.post('/register', { username, email, password });

    } catch (error) {
        throw wrapError(error);
    }
};

export const login = async (username: string, password: string): Promise<string> => {

    console.debug(tag('received request to login user: ' + username));

    try {

        const response: ILoginResponse = await auth.post('/login', {
            username,
            password,
        });

        return response.data.accessToken;

    } catch (error) {
        throw wrapError(error);
    }
};

export const logout = async (token: string): Promise<void> => {

    console.debug(tag('received request to logout user'));

    try {

        await auth.delete('/logout', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error) {
        throw wrapError(error);
    }
};

export const refresh = async (): Promise<string> => {

    console.debug(tag('received request to refresh token'));

    try {

        const response: ILoginResponse = await auth.post('/renew');
        return response.data.accessToken;

    } catch (error) {
        throw wrapError(error);
    }
};
