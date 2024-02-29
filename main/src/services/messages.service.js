import { get, set, ref, query, update, push, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createChatRoom = async (users) => {

    const chatRef = push(ref(db, `chats`));

    const participants = users.reduce((obj, user) => {
        obj[user] = true;
        return obj;
    }, {})

    await set(chatRef, { participants, createdOn: Date.now(), messages: {} });
}

export const getChatsByParticipant = async (participant) => {
    const snapshot = await get(query(ref(db, '/chats'), orderByChild(`participants`)));
    if (!snapshot.exists()) {
        return [];
    }

    return Object.values(snapshot.val()).filter((chat) => chat.participants[participant]);
}

export const getChatById = async (id) => {
    const snapshot = await get(ref(db, `chats/${id}`));
    if (!snapshot.exists()) {
        return null;
    }
}


export const sendMessage = async (author, message) => {

}