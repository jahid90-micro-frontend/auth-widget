import { Link } from 'react-router-dom';

import './PageNotFound.css';

function PageNotFound() {
    return (
        // <Segment secondary className='not-found page-container'>
        <div>
            <div>The requested page could not be found.</div>
            <div>
                Go back to{' '}
                <Link to='/' className='inline-link'>
                    home
                </Link>
                .
            </div>
        </div>
        // </Segment>
    );
}

export default PageNotFound;
