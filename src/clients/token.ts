import decodeToken from 'jwt-decode';

const tag = (message: string) => {
    return `:token:service: ${message}`;
}

export interface IToken {
    username: string;
    email: string;
    iat: number;
    exp: number;
}

export const hasExpired = (token: string) => {
    const decoded = decodeToken(token) as IToken;

    // exp is saved as secs since epoch; Date.now gives millis since epoch
    return Date.now() > decoded.exp * 1000;
}

export const decode = (token: string): IToken => {
    return decodeToken(token);
}

export const set = (token: string) => {

    if (!token) {
        console.warn(tag('token is undefined'));
        return;
    }

    localStorage.setItem('token', token);
}

export const get = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        console.warn(tag('no token was found'));
    }

    return token;
}

export const clear = () => {
    localStorage.removeItem('token');
}