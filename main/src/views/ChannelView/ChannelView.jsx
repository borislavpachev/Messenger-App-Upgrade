import { useState, useEffect } from 'react';
import './ChannelView.css';
import ChannelBar from '../../components/ChannelBar/ChannelBar';
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader';
import ChannelChat from '../../components/ChannelChat/ChannelChat';
import { getGeneralChannelId } from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import MembersSidebar from '../../components/MembersSidebar/MembersSidebar';

export default function ChannelView() {
  const [selectedChat, setSelectedChat] = useState();
  const [selectedTeam, setSelectedTeam] = useState();
  const { teamId, channelId } = useParams();
  const navigate = useNavigate();

  const handleSelectChannel = (teamId, channelId) => {
    navigate(`${teamId}/channels/${channelId}`);
  };

  useEffect(() => {
    const loadChannel = async () => {
      let selectedChannelId = channelId;

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

  return (
    <div className="d-flex custom-margin">
      <ChannelBar onChannelSelect={handleSelectChannel} />
      {selectedChat ? (
        <div className="d-flex flex-column w-100">
          <ChannelHeader />
          <div className="d-flex">
            <div className="w-75">
              <ChannelChat channelId={selectedChat.id} teamId={teamId} />
            </div>
            <div className="w-25">
              <MembersSidebar teamId={teamId} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
