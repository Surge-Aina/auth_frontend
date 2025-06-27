import axios from "axios";
import { useNavigate } from "react-router-dom";



export const checkAuth = async () => {

    try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true });
        console.log(`authenticated status = ${res.data.authenticated}`);
        return res.data
    } catch (err) {
        console.error('Auth check error:', err);
        return null
    }
}

export const useLogout = () => {
    const navigate = useNavigate();
    return async () => {
        try {
            await axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/logout`, { withCredentials: true });
            navigate('/');
        } catch (err) {
            console.error('Logout error:', err);
        }
    };
};

export const LogIn = () => {
    return
}

export const LogInWithGoogle = () => {
    return;
}
