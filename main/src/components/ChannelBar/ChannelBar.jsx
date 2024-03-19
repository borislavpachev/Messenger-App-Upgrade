import 'bootstrap/dist/css/bootstrap.min.css';
import './ChannelBar.css';
import CreateChannel from '../../views/CreateChannel/CreateChannel';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import {  
  setChannelIsSeen,
} from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { get, ref, onValue, query, orderByChild, equalTo} from 'firebase/database';
import { db } from '../../config/firebase-config';

export default function ChannelBar() {
  const { userData } = useContext(AppContext);
  const { teamId, channelId } = useParams();
  const [channels, setChannels] = useState([]);
  const [show, setShow] = useState(false);
  const username = userData.username;
  const [currentChannelId, setCurrentChannelId] = useState(null);
  const [isSeen, setIsSeen] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const fetchChannels = () => {
    const channelsRef = ref(db, 'channels');
    const q = query(channelsRef, orderByChild('teamId'), equalTo(teamId));
  
    onValue(q, (snapshot) => {
      const fetchedChannels = [];
      snapshot.forEach((childSnapshot) => {
        fetchedChannels.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setChannels(fetchedChannels);
    }, (error) => {
      console.error(error);
    });
  };

  useEffect(() => {
    fetchChannels();
    setCurrentChannelId(channelId);
  }, [teamId, username, channelId]);

  useEffect(() => {
    const fetchIsSeen = async () => {
      const newIsSeen = {};
      for (const channel of channels) {
        const snapshot = await get(
          ref(db, `users/${username}/channels/${channel.id}/isSeen`)
        );
        newIsSeen[channel.id] = snapshot.exists() ? snapshot.val() : true;
      }
      setIsSeen(newIsSeen);
      setIsLoading(false);
    };
  
    fetchIsSeen();
  
    const listeners = channels.map(channel => {
      if (channel.id !== currentChannelId) {
        const isSeenRef = ref(db, `users/${username}/channels/${channel.id}/isSeen`);
        return onValue(isSeenRef, fetchIsSeen);
      }
    });
  
    return () => {
      listeners.forEach(unsubscribe => unsubscribe && unsubscribe());
    };
  }, [channels, username, currentChannelId]);

  const navigate = useNavigate();

  const handleClick = (channelId) => {
    setCurrentChannelId(channelId);
    setChannelIsSeen(channelId, username, true);
    navigate(`/main/${teamId}/channels/${channelId}`);
    
    setIsSeen(prevIsSeen => ({ ...prevIsSeen, [channelId]: true }));
  };

  useEffect(() => {
    if (currentChannelId) {
      setIsSeen(prevIsSeen => ({ ...prevIsSeen, [currentChannelId]: true }));
    }
  }, [currentChannelId]);
  const isActive = (channelId) => {
    return channelId === currentChannelId;
  };

  return (
    <div className="channel-bar">
      <div className="d-stack gap-3">
        {!isLoading && channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => handleClick(channel.id)}
            className={`channels-single-preview ${isActive(channel.id) ? 'active' : ''}`}
          >
            <div className="single-preview-content">
              <span className="user-channels">{channel.title}</span>
              {!isSeen[channel.id] && <span className="new-message-dot"></span>}
            </div>
          </div>
        ))}
        <Button className='create-chan-btn' variant="primary" onClick={handleShow}>
          Create Channel
        </Button>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create a new channel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CreateChannel
            teamId={teamId}
            handleClose={handleClose}
            onChannelCreated={fetchChannels}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
