import 'bootstrap/dist/css/bootstrap.min.css';
import './ChannelBar.css';
import CreateChannel from '../../views/CreateChannel/CreateChannel';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import {
  getChannelsByTeamId,
  setChannelIsSeen,
} from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { get, ref, onValue, off } from 'firebase/database';
import { db } from '../../config/firebase-config';

export default function ChannelBar({ onChannelSelect }) {
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
    getChannelsByTeamId(teamId, username)
      .then((fetchedChannels) => {
        setChannels(fetchedChannels);
      })
      .catch((error) => {
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
  
    const isSeenRefs = channels.map(channel =>
      ref(db, `users/${username}/channels/${channel.id}/isSeen`)
    );
  
    const listeners = isSeenRefs.map(isSeenRef =>
      onValue(isSeenRef, fetchIsSeen)
    );
  
    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [channels, username]);

  const navigate = useNavigate();

  const handleClick = (channelId) => {
    setCurrentChannelId(channelId);
    setChannelIsSeen(channelId, username, true);
    navigate(`/main/${teamId}/channels/${channelId}`);
  
    
    setIsSeen(prevIsSeen => ({ ...prevIsSeen, [channelId]: true }));
  };

  return (
    <div className="channel-bar">
      <div className="d-stack gap-3">
        {!isLoading && channels.map((channel) => (
          <div
            key={channel.id}
            onClick={() => handleClick(channel.id)}
            className="channels-single-preview"
          >
            <div className="single-preview-content">
              <span className="user-channels">{channel.title}</span>
              {!isSeen[channel.id] && <span className="new-message-dot"></span>}
            </div>
          </div>
        ))}
        <Button variant="primary" onClick={handleShow}>
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
