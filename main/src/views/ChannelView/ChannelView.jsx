import { useState, useEffect } from 'react';
import './ChannelView.css'
import ChannelBar from "../../components/ChannelBar/ChannelBar";
import Header from "../../components/Header/Header";
import ChannelChat from "../../components/ChannelChat/ChannelChat";
import { getGeneralChannelId } from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import MembersSidebar from '../../components/MembersSidebar/MembersSidebar'

export default function ChannelView () {
  const { teamId, channelId } = useParams();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState();
  const [selectedTeam, setSelectedTeam] = useState();

const handleSelectChannel = (teamId, channelId) => {
  navigate(`${teamId}/channels/${channelId}`);
};

useEffect(() => {    
  const loadChannel = async () => {
    let selectedChannelId = channelId;

    // If channelId is not defined, use the general channel ID
    if (!selectedChannelId) {
      selectedChannelId = await getGeneralChannelId(teamId);
    }

    if (selectedChannelId) {
      setSelectedChat({ type: 'channel', id: selectedChannelId });
      setSelectedTeam(teamId); 
    }
  };

  loadChannel();
}, [teamId, channelId]);

  //...

  const [showSidebar, setShowSidebar] = useState(false);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  }

  return (
    <div className="channel-container">          
      <div className="channel-bar">
        <ChannelBar onChannelSelect={handleSelectChannel} />
      </div>
      <div className="channel-chat">
        {/* {selectedChat ? <Header channelId={selectedChat.id} teamId={teamId} toggle={toggleSidebar} /> : null} */}
        <div className={`content-sidebar-container ${showSidebar ? '' : 'sidebar-open'}`}>
          <div className="main-content" style={{flex: showSidebar ? 'none' : '1'}}>
            {selectedChat ? <ChannelChat channelId={selectedChat.id} teamId={teamId} /> : null}
          </div>
          <MembersSidebar teamId={teamId} isOpen={showSidebar} />
        </div>
      </div>          
    </div>
  );
}
