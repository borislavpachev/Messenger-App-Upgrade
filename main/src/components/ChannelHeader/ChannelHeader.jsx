import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { db } from '../../config/firebase-config';
import {
  renameChannel,
  deleteChannel,
  addMemberToChannel,
  leaveChannel,
  getGeneralChannelId,
} from '../../services/channel.service';
import './ChannelHeader.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPersonWalkingArrowRight,
  faPencil,
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-hot-toast';
import { AppContext } from '../../context/AppContext';
import { getTeamMembersByTeamId } from '../../services/teams.service';
import ReactSelect, { components } from 'react-select';

export default function ChannelHeader() {
  const { teamId, channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newMember, setNewMember] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    const channelRef = ref(db, 'channels/' + channelId);
    const unsubscribe = onValue(channelRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChannel({ id: snapshot.key, ...data });
      }
    });

    return () => unsubscribe();
  }, [channelId]);

  const handleRenameChannel = async () => {
    try {
      await renameChannel(channelId, newTitle);
      setNewTitle('');
      setIsRenaming(false);
    } catch (error) {
      console.error('Failed to rename channel:', error);
    }
  };

  const handleDeleteChannel = async () => {
    try {
      await deleteChannel(channelId);
    } catch (error) {
      console.error('Failed to delete channel:', error);
    }
  };

  useEffect(() => {
    getTeamMembersByTeamId(teamId)
      .then((members) => {
        const otherMembers = members.filter(
          (memberName) => memberName !== userData.username
        );
        setTeamMembers(otherMembers);
      })
      .catch((error) => {
        console.error('Error fetching team members: ', error);
      });
  }, [teamId, userData.username]);

  const options = teamMembers.map((memberName) => ({
    value: memberName,
    label: memberName,
  }));

  const handleAddMemberToChannel = async () => {
    try {
      await addMemberToChannel(channelId, members);
      setMembers([]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to add member to channel:', error);
    }
  };

  const handleLeaveChannel = async () => {
    try {
      const generalChannelId = await getGeneralChannelId(teamId);
      if (channelId === generalChannelId) {
        toast.error('You cannot leave the general channel');
        return;
      }

      const channelSnapshot = await get(ref(db, `channels/${channelId}`));
      const channelData = channelSnapshot.val();

      if (userData.username === channelData.owner) {
        toast.error('The owner cannot leave the channel');
        return;
      }

      const success = await leaveChannel(channelId, userData.username);

      if (success) {
        toast.success('Successfully left the channel');

        navigate(`/main`);
      } else {
        toast.error('Failed to leave the channel');
      }
    } catch (error) {
      console.error('Error leaving channel:', error);
      toast.error('An error occurred while trying to leave the channel');
    }
  };

  const Option = (props) => {
    return (
      <div>
        <components.Option {...props}>
          {props.isSelected ? '✔' : ''} {props.label}
        </components.Option>
      </div>
    );
  };

  return (
    <div className="channel-headers">
      <h4 className="chan-header-h1" onClick={() => setIsRenaming(true)}>
        {isRenaming ? (
          <>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="New channel title"
            />
            <button onClick={handleRenameChannel}>Submit New Title</button>
          </>
        ) : (
          channel?.title
        )}
      </h4>
      <div className="channel-header-buttons">
        <FontAwesomeIcon
          className="channel-header-button"
          onClick={() => setIsRenaming(true)}
          icon={faPencil}
        />
        {channelId && (
          <FontAwesomeIcon
            className="channel-header-button"
            onClick={handleLeaveChannel}
            icon={faPersonWalkingArrowRight}
          />
        )}
      </div>
      <button className='add-members-btn' onClick={() => setIsModalOpen(true)}>Add</button>
      <button className="delete-channel-button" onClick={handleDeleteChannel}>
        Delete
      </button>
      {isModalOpen && (
        <div className="add-member-modal">
          <button
            className="close-modal-add-btn"
            onClick={() => setIsModalOpen(false)}
          >
            X
          </button>
          <ReactSelect
            isMulti
            options={options}
            value={members.map((memberName) => ({
              value: memberName,
              label: memberName,
            }))}
            onChange={(selectedOptions) =>
              setMembers(
                selectedOptions
                  ? selectedOptions.map((option) => option.value)
                  : []
              )
            }
            components={{ Option }}
          />
        </div>
      )}
    </div>
  );
}
