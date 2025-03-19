import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import { TokenInstance } from '../Interseptores/TokenInterseptor';
import { useEffect, useState } from 'react';

const AuthMiddleware = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const AccessToken = sessionStorage.getItem('AccessToken');
    const RefreshToken = Cookies.get('RefreshToken');
    const navigate = useNavigate();

    useEffect(() => {
        const VerifyUser = async () => {
            try {
                if (AccessToken) {
                    if (RefreshToken) {
                        const res = await TokenInstance.post('/Verify', { RefreshToken });
                        if (res.data.success) {
                            setIsAuthenticated(true);
                        } else {
                            navigate('/login');
                        }
                    }
                    else
                    {
                        navigate('/login');
                    }
                } else {
                    if (RefreshToken) {
                        const res = await TokenInstance.post('/GenerateNewToken', { RefreshToken });
                        if (res.data.success) {
                            sessionStorage.setItem('AccessToken', res.data.AccessToken);
                            setIsAuthenticated(true);
                        } else {
                            navigate('/login');
                        }
                    } else {
                        navigate('/login');
                    }
                }
            } catch (error) {
                console.error('Authentication error:', error);
            }
        };

        VerifyUser();
    }, []);

    if (!isAuthenticated) {
        return null; 
    }

    return children;
};

export default AuthMiddleware;
