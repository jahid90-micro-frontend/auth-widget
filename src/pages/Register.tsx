import { FormEvent, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Form, Icon, Label, Message, Segment } from 'semantic-ui-react';

import { useDispatchContext } from '../context/AppContextProvider';
import { ApiError } from '../clients/auth';
import { Actions, Events } from '../modules/events';
import { EventBus } from '../modules/event-bus';

const tag = (message: string) => {
    return `:register:component: ${message}`;
}

const Register = () => {
    const dispatch = useDispatchContext();
    const history = useHistory();

    const [error, setError] = useState({} as ApiError);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLElement>) => {
        try {
            e.preventDefault();
            setError({} as ApiError);

            dispatch({ type: Actions.Reducer.REGISTER_USER, data: { username, email, password, confirmPassword } });
            // show spinner while we wait; can be reset on success/failure

        } catch (e: any) {
            console.error(e);
            setError(e.response?.data?.error);
        }
    };

    const onRegistrationSuccess = () => {

        console.debug(tag('successfully registered'));

        setUsername('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');

        // Registration is successful; let's log the user in
        (async() => {
            dispatch({ type: Actions.Reducer.LOG_USER_IN, data: { username, password } });
        })();
    }

    const onRegistrationFailure = (data: ApiError) => {
        console.debug(tag('registration failed'));
        setError(data);
    }

    useEffect(() => {

        EventBus.on(Events.Bus.REGISTRATION_SUCCEEDED, onRegistrationSuccess);
        EventBus.on(Events.Bus.REGISTRATION_FAILED, onRegistrationFailure);

        return () => {
            EventBus.off(Events.Bus.REGISTRATION_SUCCEEDED, onRegistrationSuccess);
            EventBus.off(Events.Bus.REGISTRATION_FAILED, onRegistrationFailure);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Segment secondary className='form-container page-container w600'>
            <Form className='login-form form centered columnar' onSubmit={handleSubmit}>
                <h1>Register</h1>
                <Icon name='user' className='profile-image' size='massive' />
                <Form.Field className='form-field-container'>
                    <Form.Input
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        autoFocus
                        className='form-field'
                        autoComplete='username'
                    />
                </Form.Field>
                <Form.Field className='form-field-container'>
                    <Form.Input
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='form-field'
                    />
                </Form.Field>
                <Form.Field className='form-field-container'>
                    <Form.Input
                        placeholder='Password'
                        value={password}
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        className='form-field'
                        autoComplete='new-password'
                    />
                </Form.Field>
                <Form.Field className='form-field-container'>
                    <Form.Input
                        placeholder='Confirm Password'
                        value={confirmPassword}
                        type='password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className='form-field'
                        autoComplete='new-password'
                    />
                </Form.Field>
                <Button type='submit' className='form-field' color='blue' >
                    Submit
                </Button>
                <Message>
                    <div>
                        Already registered?{' '}
                        <Label basic color='blue' as='a' onClick={() => history.push('/login')}>
                            Login
                        </Label>
                    </div>
                </Message>
                {error?.message && (
                    <Message negative>
                        <Message.Header>{error.message}</Message.Header>
                        <Message.List>
                            {error.data?.map(message => <Message.Item>{message}</Message.Item>)}
                        </Message.List>
                    </Message>
                )}
            </Form>
        </Segment>
    );
};

export default Register;
