import { get, set, ref, query, update, push, orderByChild, onValue, off } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createChatRoom = async (participants) => {

    const chatRef = push(ref(db, `chats`));

    await set(chatRef, { participants, createdOn: Date.now(), messages: {} });
}

export const checkChatRoomExistence = async (participants) => {
    const snapshot = await get(query(ref(db, '/chats'), orderByChild(`participants`)));

    if (!snapshot.exists()) {
        return false;
    }

    const existingRooms = Object.values(snapshot.val())
        .map((chat) => chat.participants);

    return existingRooms.some((users) => {

        const sortedUsers = users.sort();
        const sortedParticipants = participants.sort();

        if (sortedUsers.length !== sortedParticipants.length) {
            return false;
        }

        return sortedUsers.every((user, index) => user === sortedParticipants[index]);
    });
};


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

export const getChatWithLiveUpdates = (id, setMessages) => {
    const messagesRef = ref(db, `chats/${id}/messages`);

    const listener = onValue(messagesRef, (snapshot) => {
        const result = snapshot.val();
        if (result) {
            setMessages(Object.values(snapshot.val()));
        }
    });

    return listener;
}