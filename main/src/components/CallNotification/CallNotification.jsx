import { useContext, useEffect, useState } from 'react';
import './CallNotification.css'
import { AppContext } from '../../context/AppContext';
import { joinRoom, videoRoomsLiveUpdate } from '../../services/video.service';
import { useNavigate } from 'react-router-dom';

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

    // const roomIncluded = rooms.filter((room) => room.participants.includes(userData?.username));
    // console.log(roomIncluded);
    // const roomId = roomIncluded[0]?.videoId;

    // useEffect(() => {
    //     if (roomIncluded[0]) {
    //         setShow(true);
    //     }
    // }, [roomIncluded]);

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
                    <button className='btn btn-primary m-2' onClick={handleJoin}>Join</button>
                    <button className='btn btn-primary m-2' onClick={handleCancel}>Cancel</button>
                </div>
            </div>
    )
}