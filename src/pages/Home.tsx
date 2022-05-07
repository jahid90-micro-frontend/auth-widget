import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContextProvider';

const Home = () => {
    const { token } = useAppContext();
    if (token) {
        // return (<Segment secondary className='home-container page-container'>
        return (
            <div>
                <div className='centered columnar h500'>
                    <p>This app manages user auth.</p>
                </div>
            </div>
        );
        // </Segment>);
    }

    return (
        // <Segment secondary className='home-container page-container'>
        <div>
            <div className='centered columnar h500'>
                <p>You need to be logged in to view this content.</p>
                <p>
                    <Link to='/login'>Login</Link> or <Link to='/register'>Register</Link>
                </p>
            </div>
        </div>
        // </Segment>
    );
};

export default Home;
