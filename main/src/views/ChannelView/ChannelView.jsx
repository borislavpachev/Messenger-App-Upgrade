import  { useState, useEffect} from 'react';
import './ChannelView.css'
import ChannelBar from "../../components/ChannelBar/ChannelBar";
import Header from "../../components/Header/Header";
import ChannelChat from "../../components/ChannelChat/ChannelChat";
import { getGeneralChannelId } from '../../services/channel.service';

export default function ChannelView ({ teamId }) {
    const [selectedChat, setSelectedChat] = useState();

    const handleSelectChannel = (channelId) => {
      setSelectedChat({ type: 'channel', id: channelId });
    };

    useEffect(() => {
      if (teamId) { // Add this check
        const loadGeneralChannel = async () => {
          const generalChannelId = await getGeneralChannelId(teamId);
          if (generalChannelId) {
            setSelectedChat({ type: 'channel', id: generalChannelId });
          }
        };
    
        loadGeneralChannel();
      }
    }, [teamId]);
  
    return (
      <div className="channel-container">          
        <div className="channel-bar">
          <ChannelBar teamId={teamId} onChannelSelect={handleSelectChannel} />
        </div>
        <div className="channel-chat">
          <Header teamId={teamId} />
          {selectedChat ? <ChannelChat channelId={selectedChat.id} teamId={teamId}  /> : null}
        </div>          
      </div>
    );
}