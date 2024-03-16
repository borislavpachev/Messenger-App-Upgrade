import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import TeamList from "../TeamList/TeamList";
import CreateTeam from "../CreateTeam/CreateTeam"
import './TeamBar.css';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

export default function TeamBar({ onItemClick }) {
  const { user, userData, setAppState } = useContext(AppContext);

  const navigate = useNavigate();

  const handleTeamClick = (team) => {
    onItemClick(team.teamId);
  };

  const userUsername = userData ? userData.username : null;

  const logout = async () => {
    if (user && userUsername) {
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
      <div className="team-bar">
        <div className="d-stack gap-3">
          <NavLink to="/main/chats" className="icon-container"><FontAwesomeIcon icon={faComments} className="teambar-icon" /></NavLink>
          <NavLink to="/main/chats">
            <button className="btn btn-primary m-2">Chats</button></NavLink>
          <br /><br />
          <button className="btn-modal-create" type="button" onClick={toggleShowCreateTeam} >Create Team</button>
          <Modal show={showCreateTeam} onHide={toggleShowCreateTeam}>
            <Modal.Header closeButton>
              <Modal.Title>Create a new team</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <CreateTeam />
            </Modal.Body>
          </Modal>
          <TeamList onItemClick={handleTeamClick} />
          <NavLink to="/user-profile">Profile</NavLink>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    );
}
