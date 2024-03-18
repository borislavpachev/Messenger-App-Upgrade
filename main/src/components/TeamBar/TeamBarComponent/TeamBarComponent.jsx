import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../../services/auth.service";
import { useContext, useState } from "react";
import TeamList from "../TeamList/TeamList"
import CreateTeam from "../../CreateTeam/CreateTeam"
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faComments, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import TeamBarItem from "../TeamBarItem/TeamBarItem";
import { AppContext } from "../../../context/AppContext";
import './TeamBarComponent.css';

export default function TeamBarComponent({ onItemClick }) {
  const { user, userData, setAppState } = useContext(AppContext);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

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

  const toggleShowCreateTeam = () => {
    setShowCreateTeam(!showCreateTeam);
  }

  return (
    <>
      <div className="team-bar">
        <NavLink to="/main/chats">
          <TeamBarItem>
            <FontAwesomeIcon icon={faComments} title="Chats"/>
          </TeamBarItem>
        </NavLink>
        <div className="line-break-div"></div>
        <TeamBarItem onClick={toggleShowCreateTeam}>
          <FontAwesomeIcon icon={faPlus} title="Create Team"/>
        </TeamBarItem>
        <div className="line-break-div"></div>
        <TeamList onItemClick={handleTeamClick} />
        <div className="line-break-div"></div>
        <TeamBarItem onClick={logout}>
          <FontAwesomeIcon icon={faPowerOff} title="Log out"/>
        </TeamBarItem>
      </div >
      <Modal className="create-team-modal" show={showCreateTeam} onHide={toggleShowCreateTeam}>
        <Modal.Header className="create-team-header" closeButton>
          <Modal.Title className='create-team-modal-title'>Create a new team</Modal.Title>
        </Modal.Header>
        <Modal.Body className='create-team-modal-body'>
          <CreateTeam />
        </Modal.Body>
      </Modal>
    </>
  );
}