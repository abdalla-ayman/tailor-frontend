import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUser();
    const location = useLocation();

    // If still loading, show a loading indicator or nothing
    if (loading) {
        return <div>Loading...</div>; // You can replace this with a spinner
    }

    // If user is not authenticated, redirect to login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If user is authenticated, render the children
    return children;
};

export default ProtectedRoute;