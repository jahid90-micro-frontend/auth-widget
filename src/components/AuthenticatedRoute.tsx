import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContextProvider';

interface AuthProps {
    children: JSX.Element;
}

const AuthenticatedRoute = (props: AuthProps) => {
    const { token } = useAppContext();

    if (!token) {
        // TODO - send current location so that login can redirect to intended page
        return <Navigate to='/login' replace state={{ from: '/' }} />;
    }

    return props.children;
};

export default AuthenticatedRoute;
