import { useState, useEffect } from 'react';
// import { client } from '../../config/agora-config';
import { CHANNEL, TOKEN, agoraID } from '../../constants/agora';
import AgoraRTC from "agora-rtc-sdk-ng";
import Video from '../Video/Video';

const client = AgoraRTC.createClient({
    mode: "rtc",
    codec: "vp8"
});

export default function VideoRoom() {
    const [users, setUsers] = useState([]);


    const handleUserJoined = async (user, mediaType) => {
        await (client.subscribe(user, mediaType));

        if (mediaType === 'video') {
            setUsers((previousUsers) => [...previousUsers, user]);
        }

        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    }

    const handleUserLeft = (user) => {
        setUsers((previousUsers) => previousUsers.filter((prevUser) => prevUser.uid !== user.uid))
    }

    useEffect(() => {
        client.on('user-published', handleUserJoined);
        client.on('user-left', handleUserLeft);

        client.join(agoraID, CHANNEL, TOKEN, null)
            .then((uid) =>
                Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
            ).then(([tracks, uid]) => {
                const [audioTrack, videoTrack] = tracks;
                setUsers((previousUsers) => [...previousUsers, {
                    uid, videoTrack,
                }]);
                client.publish(tracks);
            });
    }, []);


    console.log(users);
    return (
        <div className='container .bg-light'>
            <span>VIDEO ?????</span>
            {
                users.map((user) => <Video key={user.uid} user={user} />)
            }
        </div >
    )
}