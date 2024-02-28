import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";

export default function TeamBar() {
  const { user, userData, setAppState } = useContext(AppContext);

  const navigate = useNavigate();

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
    navigate('/');
  }

  return (
    <div className="col-1 h-100 bg-dark text-white">
      <div className="d-stack gap-3">
        <div>Private</div>
        <NavLink to="/create-team">Create Team</NavLink>
        <div>Team 1</div>
        <NavLink to="/user-profile">Profile</NavLink>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}