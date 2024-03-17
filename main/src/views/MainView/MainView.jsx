
import TeamBar from "../../components/TeamBar/TeamBar";
import { Routes, Route, useNavigate } from 'react-router-dom';
import ChannelView from "../ChannelView/ChannelView";
import Chats from "../Chats/Chats";
import './MainView.css'
import VideoRoom from "../../components/VideoRoom/VideoRoom";
import Header from "../../components/Header/Header";
import { getChannelIdByTitle } from "../../services/channel.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";


export default function MainView() {
  const { userData } = useContext(AppContext)
  // const { teamId } = useParams();
  // const [selectedChat, setSelectedChat] = useState({ type: null, id: null });
  const navigate = useNavigate()


  const handleSelectTeam = async (teamId) => {
    // Fetch the ID of the specific channel for the team
    const channelId = await getChannelIdByTitle(teamId, 'General', userData.username);
  
    // Navigate to the specific channel for the team
    navigate(`${teamId}/channels/${channelId}`);
  };

  // const handleSelectChannel = (channelId) => {
  //   setSelectedChat({ type: 'channel', id: channelId });
  // };

  // const handleSelectPrivateChat = (chatId) => {
  //   setSelectedChat({ type: 'private', id: chatId });
  // };

  return (
    <div className="main-container">
              {/* <div className='main-test'> */}
      <div className="main-view-bar">
        <TeamBar onItemClick={handleSelectTeam} />
      </div>
      <div className="main-view-content">
              <Header onItemClick={handleSelectTeam}/>
        <Routes>
          <Route path="/chats" element={<Chats />} />
          <Route path="/chats/:id" element={<Chats />} />
          <Route path='/chats/video' element={<VideoRoom />} />
          <Route path='/chats/video/:chatId' element={<VideoRoom />} />
          <Route path="/:teamId" element={<ChannelView/>}>
            <Route index element={<div />} />
            <Route path="channels/:channelId" element={<ChannelView />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
}