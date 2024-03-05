import { get, set, ref, query, push, orderByChild, onValue, update, remove } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createChatRoom = async (participants) => {

    const chatRef = push(ref(db, `chats`));

    await set(chatRef, { chatTitle: '', participants, createdOn: Date.now(), messages: {} });
}

export const checkChatRoomExistence = async (participants) => {
    const snapshot = await get(query(ref(db, '/chats'), orderByChild(`participants`)));

    if (!snapshot.exists()) {
        return false;
    }

    const existingRooms = Object.values(snapshot.val())
        .map((chat) => chat.participants);

    if (existingRooms) {
        return existingRooms.some((users) => {

            const sortedUsers = users.sort();
            const sortedParticipants = participants.sort();

            if (sortedUsers.length !== sortedParticipants.length) {
                return false;
            }

            return sortedUsers.every((user, index) => user === sortedParticipants[index]);
        });
    } else {
        return false;
    }
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

export const getChatMessagesById = async (id) => {
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

export const getChatById = async (id) => {
    const snapshot = await get(ref(db, `chats/${id}`));

    if (!snapshot.exists()) {
        return null;
    }

    return snapshot.val();
}


export const updateChatTitle = async (id, title) => {

    const chatRef = set(ref(db, `chats/${id}/chatTitle`), title);

    return chatRef;
}

export const leaveChat = async (id, participant) => {

    const snapshot = await get(ref(db, `chats/${id}/participants`));
    if (!snapshot.exists()) {
        return [];
    }
    const participants = snapshot.val();
    const usersKeys = Object.keys(participants);
    const participantToRemove = usersKeys.find((key) => participants[key] === participant);

    if (participantToRemove) {
        await remove(ref(db, `chats/${id}/participants/${participantToRemove}`));
        return true;
    } else {
        return false;
    }
}
