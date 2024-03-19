import 'bootstrap/dist/css/bootstrap.min.css';
import { get, ref } from 'firebase/database';
import { useContext, useState } from 'react';
import TeamMemberList from '../TeamMembersList/TeamMembersList';
import GeneralSearch from '../GeneralSearch/GeneralSearch';
import './Header.css';
import { AppContext } from '../../context/AppContext';
import {
  leaveChannel,
  getGeneralChannelId,
} from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { db } from '../../config/firebase-config';
import { RxPerson } from 'react-icons/rx';
import Status from '../Status/Status';
import Button from '../Button/Button';
import ProfilePreview from '../ProfilePreview/ProfilePreview';

export default function Header({ channelId, toggle }) {
  const { teamId } = useParams();
  const { userData } = useContext(AppContext);
  const [show, setShow] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleTeamClick = (teamId) => {
    onItemClick(teamId);
  };

  const toggleShow = () => {
    setShow(!show);
  };



  const handleUserProfileClick = () => {
    setIsModalOpen(true);
  };

  return (
    <header className="channel-header">
      Header
      {/* {channelId && (
          <button className='leave-chan-but' onClick={handleLeaveChannel}>Leave Channel</button>
        )} */}
      <div className="general-search-bar">
        <GeneralSearch onItemClick={handleTeamClick} />
      </div>
      <Status>Status</Status>
      <div style={{ position: 'relative' }}>
        <Button className='user-btn' onClick={handleUserProfileClick}>UserProfile</Button>
        {isModalOpen && (
          <div className="user-modal">
            <button className='close-user-btn' onClick={() => setIsModalOpen(false)}>Close</button>
            <ProfilePreview />
          </div>
        )}
      </div>
      <RxPerson className="sidebar-svg" onClick={toggle} />
    </header>
  );
}
