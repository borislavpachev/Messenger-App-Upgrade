import { useState, useEffect } from 'react';
import './ChannelView.css'
import ChannelBar from "../../components/ChannelBar/ChannelBar";
import Header from "../../components/Header/Header";
import ChannelChat from "../../components/ChannelChat/ChannelChat";
import { getGeneralChannelId } from '../../services/channel.service';
import { useParams } from 'react-router-dom';
import MembersSidebar from '../../components/MembersSidebar/MembersSidebar'

export default function ChannelView () {
  const { teamId } = useParams();
  const [selectedChat, setSelectedChat] = useState();
  const [selectedTeam, setSelectedTeam] = useState();
  const handleSelectChannel = (channelId) => {
    setSelectedChat({ type: 'channel', id: channelId });
  };

  useEffect(() => {    
    if (teamId !== selectedTeam) { 
      const loadGeneralChannel = async () => {
        const generalChannelId = await getGeneralChannelId(teamId);         
        if (generalChannelId) {
          setSelectedChat({ type: 'channel', id: generalChannelId });
          setSelectedTeam(teamId); 
        }
      };

      loadGeneralChannel();
    }
  }, [teamId]);

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
        {selectedChat ? <Header channelId={selectedChat.id} teamId={teamId} toggle={toggleSidebar} /> : null}
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
