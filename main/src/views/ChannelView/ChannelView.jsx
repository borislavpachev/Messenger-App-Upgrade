import { useState, useEffect } from 'react';
import './ChannelView.css'
import ChannelBar from "../../components/ChannelBar/ChannelBar";
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader';
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
      <div className="main-channel-bar">
        <ChannelBar onChannelSelect={handleSelectChannel} />
      </div>
      <div className="channel-chat">
        {selectedChat ? <ChannelHeader /> : null}
        <div className="content-sidebar-container">
          <div className="main-content">
            {selectedChat ? <ChannelChat channelId={selectedChat.id} teamId={teamId} /> : null}
          </div>
          <MembersSidebar className='sidebar' teamId={teamId} />
        </div>
      </div>          
    </div>
  );
}
