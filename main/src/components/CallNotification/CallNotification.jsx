import { useContext, useEffect, useState } from 'react';
import './CallNotification.css'
import { AppContext } from '../../context/AppContext';
import { getVideoRoomParticipants } from '../../services/video.service';

export default function CallNotification() {
    const { userData } = useContext(AppContext);
    const [videoJoined, setVideoJoined] = useState([]);

    // useEffect(() => {
    //     const roomId = chatId;

    //     const unsubscribe = getVideoRoomParticipants(roomId, (newJoined) => {
    //         setVideoJoined(newJoined)
    //     });

    //     return unsubscribe;
    // }, [chatId]);

    return (
        // <div className="incoming-call">
            <div>
                <p> Incoming call from TEST?</p>
                <button className='btn btn-primary m-2'>Join</button>
                <button className='btn btn-primary m-2'>Cancel</button>
            </div>
        // </div>
    )
}