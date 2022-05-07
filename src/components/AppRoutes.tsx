import { lazy, Suspense } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import AuthenticatedRoute from './AuthenticatedRoute';
import Home from '../pages/Home';
import Nav from './Nav';
import UnauthenticatedRoute from './UnauthenticatedRoute';

const Login = lazy(() => import('../pages/Login'));
const PageNotFound = lazy(() => import('../pages/PageNotFound'));
const Profile = lazy(() => import('../pages/Profile'));
const Register = lazy(() => import('../pages/Register'));

const AppRoutes = () => {
    return (
        <Router basename='/'>
            <Nav />
            <Suspense fallback='Loading...'>
                <Routes>
                    <Route path='/' element={Home} />
                    <Route
                        path='/login'
                        element={
                            <UnauthenticatedRoute>
                                <Login />
                            </UnauthenticatedRoute>
                        }
                    />
                    <Route
                        path='/register'
                        element={
                            <UnauthenticatedRoute>
                                <Register />
                            </UnauthenticatedRoute>
                        }
                    />
                    <Route
                        path='/profile'
                        element={
                            <AuthenticatedRoute>
                                <Profile />
                            </AuthenticatedRoute>
                        }
                    />
                    <Route element={PageNotFound} />
                </Routes>
            </Suspense>
        </Router>
    );
};

export default AppRoutes;
