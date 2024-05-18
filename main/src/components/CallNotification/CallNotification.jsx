import { useContext, useEffect, useState } from 'react';
import './CallNotification.css';
import { AppContext } from '../../context/AppContext';
import { joinRoom, videoRoomsLiveUpdate } from '../../services/video.service';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button/Button';

export default function CallNotification() {
  const { userData } = useContext(AppContext);
  const [show, setShow] = useState();
  const [rooms, setRooms] = useState([]);
  const [roomId, setRoomId] = useState(null);
  const [caller, setCaller] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const listener = videoRoomsLiveUpdate((rooms) => {
      setRooms(rooms);
    });

    return () => listener;
  }, []);

  useEffect(() => {
    const roomIncluded = rooms.filter((room) =>
      room.participants.includes(userData?.username)
    );
    const roomId = roomIncluded[0]?.videoId;
    const callerObject = roomIncluded[0]?.joined;
    const caller = callerObject ? Object.values(callerObject) : null;
    
    if (roomIncluded.length && roomId && caller) {
      setShow(true);
      setRoomId(roomId);
      setCaller(caller);
    } else {
      setShow(false);
      setRoomId(null);
      setCaller('');
    }
  }, [rooms, userData]);

  const handleJoin = async () => {
    navigate(`/main/chats/video/${roomId}`);
    await joinRoom(roomId, userData.username);
  };

  const handleCancel = () => {
    setShow(false);
  };

  return !roomId || !show
    ? null
    : show && (
        <div
          className="incoming-call bg-white m-2 justify-self-center
         rounded fs-5"
        >
          <div
            className="align-items-center justify-content-center
          text-center"
          >
            <p className="mb-3 fs-4 text-black">Incoming call from {caller}</p>
            <Button
              className="custom-button btn btn-primary m-2 p-3"
              onClick={handleJoin}
            >
              <div className="d-flex">
                <span className="me-2">Join</span>
                <FontAwesomeIcon icon={faVideo} />
              </div>
            </Button>
            <button className="btn btn-danger m-2 p-3" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      );
}
