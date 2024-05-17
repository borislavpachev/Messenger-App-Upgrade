import { NavLink, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../../services/auth.service';
import { useContext, useEffect, useState } from 'react';
import TeamList from '../TeamList/TeamList';
import CreateTeam from '../../CreateTeam/CreateTeam';
import { Modal } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus,
  faComments,
  faPowerOff,
} from '@fortawesome/free-solid-svg-icons';
import TeamBarItem from '../TeamBarItem/TeamBarItem';
import { AppContext } from '../../../context/AppContext';
import { listenForNewChatMessages } from '../../../services/chats.service';
import './TeamBarComponent.css';
import PropTypes from 'prop-types';

export default function TeamBarComponent({ onItemClick }) {
  const { user, userData, setAppState } = useContext(AppContext);
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [hasIsSeen, setHasIsSeen] = useState([]);

  useEffect(() => {
    const listener = listenForNewChatMessages(setHasIsSeen, userData?.username);

    return () => listener;
  }, [userData]);

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
      console.error('Logout error:', userUsername);
    }
  };

  const toggleShowCreateTeam = () => {
    setShowCreateTeam(!showCreateTeam);
  };

  const isSeenClass = hasIsSeen.length ? 'has-seen-class' : '';

  return (
    <>
      <div
        className="teambar-custom-border d-flex flex-column 
        align-items-center justify-content-start w-100"
      >
        <NavLink to="/main/chats">
          <TeamBarItem className="m-2">
            <div className={isSeenClass}></div>
            <FontAwesomeIcon icon={faComments} title="Chats" />
          </TeamBarItem>
        </NavLink>
        <div className="border border-light w-100"></div>
        <TeamBarItem onClick={toggleShowCreateTeam}>
          <FontAwesomeIcon icon={faPlus} title="Create Team" />
        </TeamBarItem>
        <div className="border border-light w-100 "></div>
        <div className="custom-scroll align-items-center
        justify-content-center align-self-center">
          <TeamList onItemClick={handleTeamClick} />
        </div>
        <div className="border border-light w-100"></div>
        <TeamBarItem onClick={logout}>
          <FontAwesomeIcon icon={faPowerOff} title="Log out" />
        </TeamBarItem>
      </div>
      <Modal show={showCreateTeam} onHide={toggleShowCreateTeam}>
        <Modal.Header closeButton closeVariant="black">
          <Modal.Title>Create a new team</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateTeam toggleShowCreateTeam={toggleShowCreateTeam} />
        </Modal.Body>
      </Modal>
    </>
  );
}

TeamBarComponent.propTypes = {
  onItemClick: PropTypes.func,
};
