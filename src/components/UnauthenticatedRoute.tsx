import { Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContextProvider';

interface UnauthProps {
    children: JSX.Element;
}

const UnauthenticatedRoute = (props: UnauthProps) => {
    const { token } = useAppContext();

    if (token) {
        // TODO - send current location so that logout can redirect to intended page
        return <Navigate to='/' replace state={{ from: '/' }} />;
    }

    return props.children;
};

export default UnauthenticatedRoute;
