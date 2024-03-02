import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import TeamList from "../TeamList/TeamList";

export default function TeamBar({ onItemClick }) {
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
        <NavLink to="/chats">Private chats</NavLink>
        <br /><br />
        <NavLink to="/create-team">Create Team</NavLink>
        <TeamList onItemClick={onItemClick} />
        <NavLink to="/user-profile">Profile</NavLink>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}