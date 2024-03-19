import { useContext, useEffect, useState } from 'react';
import './CallNotification.css'
import { AppContext } from '../../context/AppContext';
import { joinRoom, videoRoomsLiveUpdate } from '../../services/video.service';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faVideo } from '@fortawesome/free-solid-svg-icons';
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
            setRooms(rooms)
        });

        return () => listener;
    }, []);

    useEffect(() => {
        const roomIncluded = rooms.filter(room => room.participants.includes(userData?.username));
        const roomId = roomIncluded[0]?.videoId;
        const caller = roomIncluded[0]?.participants[0];

        if (roomIncluded.length && roomId && caller) {
            setShow(true);
            setRoomId(roomId);
            setCaller(caller)
        } else {
            setShow(false);
            setRoomId(null);
            setCaller('');
        }
    }, [rooms, userData]);

    const handleJoin = async () => {
        navigate(`/main/chats/video/${roomId}`);
        await joinRoom(roomId, userData.username);
    }

    const handleCancel = () => {
        setShow(false);
    };

    return (
        (!roomId || !show) ? null :
            show && <div className="incoming-call">
                <div>
                    <p>Incoming call from {caller}</p>
                    <Button className="chat-header-button video-call-start" onClick={handleJoin}>
                        <div className="video-btn-wrapper">
                            <span>Join</span>
                            <FontAwesomeIcon icon={faVideo} />
                        </div>
                    </Button>
                    <button className='chat-header-button cancel-video' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
    )
}