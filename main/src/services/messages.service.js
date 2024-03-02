import { get, set, ref, query, update, push, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createChatRoom = async (participants) => {

    const chatRef = push(ref(db, `chats`));

    await set(chatRef, { participants, createdOn: Date.now(), messages: {} });
}


export const getChatsByParticipant = async (participant) => {
    const snapshot = await get(query(ref(db, '/chats'), orderByChild(`participants`)));
    if (!snapshot.exists()) {
        return [];
    }

    return Object.keys(snapshot.val())
        .map((key) => ({
            id: key,
            ...snapshot.val()[key],
            createdOn: new Date(snapshot.val()[key].createdOn).toString(),
            participants: snapshot.val()[key].participants ?
                Object.values(snapshot.val()[key].participants) :
                [],
        }))
        .filter((chat) => Object.values(chat.participants).includes(participant));
}

export const sendMessage = async (id, author, message) => {

    const userMessage = {
        message: message,
        author: author,
        sentOn: Date.now(),
    }

    const messagesRef = push(ref(db, `chats/${id}/messages`), userMessage);

    return messagesRef;
}

export const getChatById = async (id) => {
    const snapshot = await get(ref(db, `chats/${id}/messages`));
    if (!snapshot.exists()) {
        return null;
    }

    return Object.values(snapshot.val());
}