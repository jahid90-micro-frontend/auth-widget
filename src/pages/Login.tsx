import { FormEvent, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Icon, Label, Message } from 'semantic-ui-react';

import { useDispatchContext } from '../context/AppContextProvider';
import { ApiError } from '../clients/auth';
import { EventBus } from '../modules/event-bus';
import { Actions, Events } from '../modules/events';

const tag = (message: string) => {
    return `:login:component: ${message}`;
};

interface ILoginProps {
    location?: {
        state?: {
            from?: string;
        };
    };
}

const Login = (props: ILoginProps) => {
    const dispatch = useDispatchContext();
    const navigate = useNavigate();

    const [error, setError] = useState({} as ApiError);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLElement>) => {
        e.preventDefault();
        setError({} as ApiError);

        dispatch({ type: Actions.Reducer.LOG_USER_IN, data: { username, password } });
        // show spinner while we wait; can be reset on success/failure
    };

    const onLoginFailure = (data: ApiError) => {
        console.debug(tag('login failed'));
        setError(data);
    };

    const onLoginSuccess = () => {
        console.debug(tag('login succeeded'));

        setUsername('');
        setPassword('');

        navigate(props?.location?.state?.from || '/');
    };

    useEffect(() => {
        EventBus.on(Events.Bus.LOGIN_SUCCEEDED, onLoginSuccess);
        EventBus.on(Events.Bus.LOGIN_FAILED, onLoginFailure);

        return () => {
            EventBus.off(Events.Bus.LOGIN_SUCCEEDED, onLoginSuccess);
            EventBus.off(Events.Bus.LOGIN_FAILED, onLoginFailure);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        // <Segment secondary className='form-container page-container w600'>
        <div>
            {/* <Form className='login-form form centered columnar' onSubmit={handleSubmit}> */}
            <form className='login-form form centered columnar' onSubmit={handleSubmit}>
                <h1>Login</h1>
                <Icon name='user' className='profile-image' size='massive' />
                <Form.Field className='form-field-container'>
                    <Form.Input
                        placeholder='Username'
                        value={username}
                        onChange={(e: any) => setUsername(e.target.value)}
                        autoFocus
                        className='form-field'
                        autoComplete='username'
                    />
                </Form.Field>
                <Form.Field className='form-field-container'>
                    <Form.Input
                        placeholder='Password'
                        value={password}
                        type='password'
                        onChange={(e: any) => setPassword(e.target.value)}
                        className='form-field'
                        autoComplete='current-password'
                    />
                </Form.Field>
                <Button type='submit' className='form-field' color='blue'>
                    Submit
                </Button>
                <Message>
                    <div>
                        Not registered?{' '}
                        <Label basic color='blue' as='a' onClick={() => navigate('/register')}>
                            Register
                        </Label>
                    </div>
                </Message>
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
            </form>
            {/* </Form> */}
        </div>
        // </Segment>
    );
};

export default Login;
