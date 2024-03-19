import 'bootstrap/dist/css/bootstrap.min.css';
import { get, ref } from 'firebase/database';
import { useContext, useState } from 'react';
import GeneralSearch from '../GeneralSearch/GeneralSearch';
import './Header.css';
import { AppContext } from '../../context/AppContext';
import { useParams, useNavigate } from 'react-router-dom';
import { RxPerson } from 'react-icons/rx';
import Status from '../Status/Status';
import Button from '../Button/Button';
import ProfilePreview from '../ProfilePreview/ProfilePreview';

export default function Header() {
  
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
      <div className="general-search-bar">
        <GeneralSearch onItemClick={handleTeamClick} />
      </div>
      <div className='header-navigation'>
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
      </div>
    </header>
  );
}
