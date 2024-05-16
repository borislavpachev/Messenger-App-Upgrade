import { Routes, Route, useNavigate } from 'react-router-dom';
import ChannelView from '../ChannelView/ChannelView';
import Chats from '../Chats/Chats';
import VideoRoom from '../../components/VideoRoom/VideoRoom';
import Header from '../../components/Header/Header';
import { getChannelIdByTitle } from '../../services/channel.service';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import TeamBarComponent from '../../components/TeamBar/TeamBarComponent/TeamBarComponent';
import WelcomeView from '../WelcomeView/WelcomeView';
import PropTypes from 'prop-types';
import './MainView.css';

export default function MainView({ toggleTheme }) {
  const { userData, theme } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSelectTeam = async (teamId) => {
    const channelId = await getChannelIdByTitle(
      teamId,
      'General',
      userData.username
    );

    navigate(`${teamId}/channels/${channelId}`);
  };

  return (
    <div className={`main-view-custom-height bg-${theme}`}>
      <Header onItemClick={handleSelectTeam} toggleTheme={toggleTheme} />
      <div className="row main-view-without-header">
        <div className="col-1">
          <TeamBarComponent onItemClick={handleSelectTeam} />
        </div>
        <div className="col-11">
          <Routes>
            <Route index element={<WelcomeView />} />
            <Route path="/chats" element={<Chats />} />
            <Route path="/chats/:id" element={<Chats />} />
            <Route path="/chats/video" element={<VideoRoom />} />
            <Route path="/chats/video/:chatId" element={<VideoRoom />} />
            <Route path="/:teamId" element={<ChannelView />}>
              <Route index element={<div />} />
              <Route path="channels/:channelId" element={<ChannelView />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
}

MainView.propTypes = {
  toggleTheme: PropTypes.func,
};
