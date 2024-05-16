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
  const [isRenaming, setIsRenaming] = useState(false);
  const { userData } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [channelMembers, setChannelMembers] = useState([]);

  const navigate = useNavigate();

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

  const handleAddMemberToChannel = async () => {
    try {
      await addMemberToChannel(channelId, members);
      setChannelMembers((prevMembers) => [...prevMembers, ...members]); // Update the channel members
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

  useEffect(() => {
    const channelRef = ref(db, 'channels/' + channelId);
    const unsubscribe = onValue(channelRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setChannel({ id: snapshot.key, ...data });
        setChannelMembers(data.members || []); // Update the channel members
      }
    });

    return () => unsubscribe();
  }, [channelId]);

  const options = teamMembers
    .filter((memberName) => !channelMembers.includes(memberName))
    .map((memberName) => ({
      value: memberName,
      label: memberName,
    }));

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
    <div
      className="d-flex bg-primary bg-opacity-25 text-white
     border border-warning p-2 rounded m-1
     align-items-center justify-content-between"
    >
      <div className="d-flex">
        <h4
          onClick={handleRenameChannel}
          className="justify-self-center m-auto"
        >
          {isRenaming ? (
            <div className="d-flex align-items-center justify-content-center">
              <input
                className="form-control"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="New title"
              />
              <button
                className="btn btn-primary ms-1"
                onClick={handleRenameChannel}
              >
                Submit
              </button>
            </div>
          ) : (
            channel?.title
          )}
        </h4>
        <div className="align-items-center justify-content-center d-flex">
          <FontAwesomeIcon
            className="btn btn-primary ms-2 px-3 py-2"
            onClick={() => setIsRenaming(!isRenaming)}
            icon={faPencil}
          />
          {channelId && (
            <FontAwesomeIcon
              className="btn btn-danger ms-2 px-3 py-2"
              onClick={handleLeaveChannel}
              icon={faPersonWalkingArrowRight}
            />
          )}
        </div>
      </div>

      {!isModalOpen && (
        <div className="d-flex">
          <button
            className="btn btn-primary m-1 px-4 py-2"
            onClick={() => setIsModalOpen(true)}
          >
            Add Members
          </button>
          <button
            className="btn btn-danger m-1 px-4 py-2"
            onClick={handleDeleteChannel}
          >
            Delete Channel
          </button>
        </div>
      )}
      {isModalOpen && (
        <div
          className="d-flex align-items-center justify-content-center
        px-1 py-2 m-1 text-black"
        >
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
          <button
            className="btn btn-primary ms-2 px-2 py-2"
            onClick={handleAddMemberToChannel}
          >
            Add Members
          </button>
          <button
            className="btn btn-danger ms-2 px-4 py-2"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
