
import { useState } from "react";

import TeamBar from "../../components/TeamBar/TeamBar";
import { Routes, Route, useParams, useNavigate } from 'react-router-dom';
import ChannelView from "../ChannelView/ChannelView";
import Chats from "../Chats/Chats"

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
    <div className="container-fluid h-100 m-2 p-0">
      <div className="row h-100">         
        <TeamBar onItemClick={handleSelectTeam} />
        <div className="col-11 d-flex flex-column">
        <Routes>
          <Route path="/chats" element={<Chats/>} />
          <Route path="/:teamId" element={<ChannelView />} />
        </Routes>
        </div>          
      </div>
    </div>
  );
}