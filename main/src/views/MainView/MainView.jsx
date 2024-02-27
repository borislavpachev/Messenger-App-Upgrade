import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import { logoutUser } from "../../services/auth.service";
import { NavLink, useNavigate } from 'react-router-dom';

export default function MainView() {
    const { user, userData, setAppState } = useContext(AppContext);

    const navigate = useNavigate();

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/');
    }

    return (
        <div>
            <h2>main view</h2>
            <div>
                <NavLink to="/user-profile">Profile</NavLink>
            </div>
            <button onClick={logout}>Logout</button>
        </div>
    )
}