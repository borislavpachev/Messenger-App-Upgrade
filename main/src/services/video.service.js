import { get, off, onValue, push, ref, remove, set } from 'firebase/database';
import { apiKey } from '../constants/daily.js'
import { db } from '../config/firebase-config.js';

export const createDailyRoom = async (chatId) => {
    const url = `https://api.daily.co/v1/rooms`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                privacy: 'public',
                name: `${chatId}`,
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create Daily.co room');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error creating Daily.co room:', error);
        throw error;
    }
};

export const createVideoRoom = async (roomId, participants) => {
    await set(ref(db, `videoRooms/${roomId}`), {
        videoId: roomId,
        participants,
        joined: {}
    });
}

export const getVideoRoomParticipants = (roomId, setChatParticipants) => {

    const joinedRef = ref(db, `videoRooms/${roomId}/joined`);

    const listener = onValue(joinedRef, (snapshot) => {
        const result = snapshot.val();
        if (result) {
            setChatParticipants(Object.values(result));
        } else {
            setChatParticipants([]);
        }
    }, (error) => {
        console.error(error.code);
    });


    return listener;
}

export const joinRoom = async (roomId, participant) => {
    const joinedRef = await push(ref(db, `videoRooms/${roomId}/joined`), participant);

    return joinedRef;
}

export const leaveRoom = async (roomId) => {
    const snapshot = await get(ref(db, `videoRooms/${roomId}`));
    if (!snapshot.exists()) {
        return;
    }
    await remove(ref(db, `videoRooms/${roomId}`));
}

export const videoRoomsLiveUpdate = (setRooms) => {

    const roomsRef = ref(db, `videoRooms`);

    const listener = onValue(roomsRef, (snapshot) => {
        const result = snapshot.val()
        if (result) {
            setRooms(Object.values(result));
        } else {
            setRooms([]);
        }
    }, (error) => {
        console.error(error.code);
    });


    return listener;
}