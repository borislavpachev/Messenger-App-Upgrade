
import { useState } from "react";
import TeamBar from "../../components/TeamBar/TeamBar";
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import ChannelView from "../ChannelView/ChannelView";
import Chats from "../Chats/Chats";
import './MainView.css'
import VideoRoom from "../../components/VideoRoom/VideoRoom";

export default function MainView() {
  const { teamId } = useParams();
  const [selectedChat, setSelectedChat] = useState({ type: null, id: null });
  const navigate = useNavigate()


  const handleSelectTeam = (teamId) => {
    navigate(`/main/${teamId}`);
  }

  const handleSelectChannel = (channelId) => {
    setSelectedChat({ type: 'channel', id: channelId });
  };

  const handleSelectPrivateChat = (chatId) => {
    setSelectedChat({ type: 'private', id: chatId });
  };

  return (
    <div className="main-container">
      <div className="main-view-bar">
        <TeamBar onItemClick={handleSelectTeam} />
      </div>
      <div className="main-view-content">
        <Routes>
          <Route path="/chats" element={<Chats />} />
          <Route path="/chats/:id" element={<Chats />} />
          <Route path='/chats/video' element={<VideoRoom />} />
          <Route path="/:teamId" element={<ChannelView />} />
        </Routes>
      </div>

    </div>
  );
}