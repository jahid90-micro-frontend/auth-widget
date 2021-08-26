import { useHistory } from 'react-router-dom';
import { Button, Segment } from 'semantic-ui-react';

import { useAppContext, useDispatchContext } from '../context/AppContextProvider';
import { decode } from '../clients/token';
import { Actions } from '../modules/events';

const Profile = () => {
    const { token } = useAppContext();
    const decoded = decode(token);
    const dispatch = useDispatchContext();
    const history = useHistory();

    const handleClick = async () => {
        await dispatch({ type: Actions.Reducer.LOG_USER_OUT, data: { token } });

        history.push('/');
    };

    return (
        <Segment secondary className='profile-container page-container'>
            <p>Hi {decoded.username || 'stranger'}! This is the profile page.</p>

            <Segment tertiary>
                <p>Here's your account details</p>
                <p>Username: {decoded.username || '<missing>'}</p>
                <p>Email: {decoded.email || '<missing>'}</p>
            </Segment>

            <div>
                <Button basic color='red' onClick={handleClick}>
                    Logout
                </Button>
            </div>
        </Segment>
    );
};

export default Profile;
