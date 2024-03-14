import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import TeamList from "../TeamList/TeamList";
import CreateTeam from "../CreateTeam/CreateTeam"
import './TeamBar.css';

export default function TeamBar({ onItemClick }) {
  const { user, userData, setAppState } = useContext(AppContext);

  const navigate = useNavigate();

  const handleTeamClick = (team) => {    
    onItemClick(team.teamId);
  };

  const userUsername = userData ? userData.username : null;

  const logout = async () => {
    if(user && userUsername){
    await logoutUser(userUsername);
    setAppState({ user: null, userData: null });
    navigate('/');
    } else {
      console.error('Logout error:', userUsername)
    }
  }

    const [showCreateTeam, setShowCreateTeam] = useState(false);

    const toggleShowCreateTeam = () => {
      setShowCreateTeam(!showCreateTeam);
    }

  return (
    <div className="col-1 h-100 bg-dark text-white">
      <div className="d-stack gap-3">
        <NavLink to="/chats">Private chats</NavLink>
        <br /><br />
        <button className="btn-modal-create" type="button" onClick={toggleShowCreateTeam} >Create Team</button>
        {showCreateTeam && <div className='create-team-modal'>
          <div
            onClick={toggleShowCreateTeam}
            className='overlay-create-team'></div>
          <div className='modal-create-team-content'>
            <CreateTeam />
            <button className='close-modal-create-btn' onClick={toggleShowCreateTeam}>Close</button>
          </div>
        </div>}
        <TeamList onItemClick={handleTeamClick} />
        <NavLink to="/user-profile">Profile</NavLink>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}
