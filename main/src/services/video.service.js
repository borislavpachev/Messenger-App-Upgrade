import { get, off, onValue, push, ref, remove, set, update } from 'firebase/database';
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

export const getVideoRoomParticipants = (roomId, setChatParticipants) => {
    const joinedRef = ref(db, `videoRooms/${roomId}/joined`);

    const listener = onValue(joinedRef, (snapshot) => {
        const result = snapshot.val();
        if (result) {
            console.log(snapshot.val());
            setChatParticipants(Object.keys(snapshot.val()));
        } else {
            console.log('no users joined');
        }
    }, (error) => {
        console.error(error.code);
    });

    return () => off(joinedRef, listener);
}

export const joinRoom = async (roomId, participant) => {
    const joinedRef = await push(ref(db, `videoRooms/${roomId}/joined`), participant);

    return joinedRef;
}

export const leaveRoom = async (roomId) => {
    const snapshot = await get(ref(db, `videoRooms/${roomId}/joined`));
    if (!snapshot.exists()) {
        return;
    }
    await remove(ref(db, `videoRooms/${roomId}/joined`));
}