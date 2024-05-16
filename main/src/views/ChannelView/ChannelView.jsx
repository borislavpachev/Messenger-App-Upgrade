import { useState, useEffect } from 'react';
import './ChannelView.css';
import ChannelBar from '../../components/ChannelBar/ChannelBar';
import ChannelHeader from '../../components/ChannelHeader/ChannelHeader';
import ChannelChat from '../../components/ChannelChat/ChannelChat';
import { getGeneralChannelId } from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import TeamMembersList from '../../components/TeamMembersList/TeamMembersList';

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
        <div
          className="custom-height-channel row align-items-center
        justify-content-center"
        >
          <div className="container px-3 py-2">
            <ChannelHeader />
          </div>
          <div className="w-75">
            <ChannelChat channelId={selectedChat.id} teamId={teamId} />
          </div>
          <div className="w-25">
            <TeamMembersList teamId={teamId} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
