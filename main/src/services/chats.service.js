import { get, set, ref, query, push, orderByChild, onValue, update, remove, off, } from 'firebase/database';
import { db, storage } from '../config/firebase-config';
import { getDownloadURL, ref as sRef } from 'firebase/storage';
import { uploadBytes } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export const createChatRoom = async (participants) => {

    const chatRef = push(ref(db, `chats`));
    

    await set(chatRef, {
        chatTitle: '',
        participants,
        createdOn: Date.now(),
        messages: {},
        lastSender: '',
        lastModified: Date.now(),
        lastMessage: '',
    });

    const chatId = chatRef.key;
    return chatId;
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
            return users.every((user, index) => user === sortedParticipants[index]);
        });
    } else {
        return false;
    }
};

export const sendMessage = async (id, author, message, fileURL) => {

    const userMessage = {
        message: message,
        author: author,
        sentOn: Date.now(),
        fileURL: fileURL,
    }

    const messagesRef = push(ref(db, `chats/${id}/messages`), userMessage);

    return messagesRef;
}

export const editMessage = async (id, message, newMessage) => {
    const messagesRef = update(ref(db, `chats/${id}/messages/${message.id}`), {
        message: newMessage
    });

    return messagesRef;
}

export const deleteMessage = async (chatId, messageId) => {
    const messageRef = ref(db, `chats/${chatId}/messages/${messageId}`);
    remove(messageRef);
}


export const getChatMessagesById = async (id) => {
    const snapshot = await get(ref(db, `chats/${id}/messages`));
    if (!snapshot.exists()) {
        return null;
    }

    return Object.keys(snapshot.val())
        .map((key) => ({
            id: key,
            ...snapshot.val()[key],
            author: snapshot.val()[key].author,
            sentOn: new Date(snapshot.val()[key].sentOn).toString(),
            message: snapshot.val()[key].message,
            fileURL: snapshot.val()[key].fileURL,
        }));
}


export const getChatWithLiveUpdates = (id, setMessages) => {
    const messagesRef = ref(db, `chats/${id}/messages`);

    const listener = onValue(messagesRef, (snapshot) => {
        const result = snapshot.val();
        if (result) {
            const messages = Object.keys(snapshot.val())
                .map((key) => ({
                    id: key,
                    ...snapshot.val()[key],
                    author: snapshot.val()[key].author,
                    sentOn: new Date(snapshot.val()[key].sentOn).toString(),
                    message: snapshot.val()[key].message,
                    fileURL: snapshot.val()[key].fileURL,
                }))
            setMessages(messages);
        } else {
            setMessages([]);
        }
    }, (error) => {
        console.error(error.code);
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

    if (participantToRemove && usersKeys.length > 1) {
        await remove(ref(db, `chats/${id}/participants/${participantToRemove}`));
        return true;
    } else if (participantToRemove && usersKeys.length === 1) {
        await remove(ref(db, `chats/${id}`));
        return true;
    } else
        return false;

}

export const setLastModified = async (sender, id, message) => {
    await set(ref(db, `chats/${id}/lastSender`), sender);
    await set(ref(db, `chats/${id}/lastModified`), Date.now());
    await set(ref(db, `chats/${id}/lastMessage`), message);
}

export const sendFile = async (file) => {

    if (file) {
        const fileRef = sRef(storage, `allFiles/${uuidv4()}`);
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    }

    return '';
}

export const listenToChat = (chatId, setChatInfo) => {
    const chatRef = ref(db, `chats/${chatId}`);

    const listener = onValue(chatRef, (snapshot) => {
        const result = snapshot.val();
        if (result) {
            setChatInfo(result);
        }
    }, (error) => {
        console.error(error.code);
    });

    return () => off(chatRef, listener);
};

export const removeMessageFile = async (id, messageId) => {
    await set(ref(db, `chats/${id}/messages/${messageId}/fileURL`), '');
}

export const getChatByParticipant = (participant, setChats) => {
    const chatRef = ref(db, 'chats');

    const listener = onValue(chatRef, (snapshot) => {
        const result = snapshot.val();

        if (result) {
            const chats = Object.keys(snapshot.val())
                .map((key) => ({
                    id: key,
                    ...snapshot.val()[key],
                    lastSender: snapshot.val()[key].lastSender,
                    lastMessage: snapshot.val()[key].lastMessage,
                    lastModified: new Date(snapshot.val()[key].lastModified).toString(),
                    createdOn: new Date(snapshot.val()[key].createdOn).toString(),
                    participants: snapshot.val()[key].participants ?
                        Object.values(snapshot.val()[key].participants) :
                        [],
                }))
                .filter((chat) => Object.values(chat.participants).includes(participant));

            setChats(chats);
        }
    }, (error) => {
        console.error(error.code);
    });

    return () => off(chatRef, listener);
}

export const getChatIdIfParticipantsMatch = async (user, secondUser) => {
    const snapshot = await get(ref(db, '/chats'));
    if (!snapshot.exists()) {
        return null;
    }

    const chats = snapshot.val();
    for (let chatId in chats) {
        const chat = chats[chatId];
        const participants = chat.participants || [];
        if (participants.length < 3 && participants.includes(user) && participants.includes(secondUser)) {
            return chatId;
        }
    }

    return null;
}