import {
    get,
    push,
    set,
    onValue,
    update,
    ref,
    query,
    orderByChild,
    remove,
    equalTo
  } from 'firebase/database';
 import { db } from '../config/firebase-config';

 export const createChannel = async (teamId, owner, title, chat, members) => {
    return push (ref(db, `teams/${teamId}/channels`), {
        owner,
        title,
        teamId, 
        chat,
        members,
    })
}

export const getChannelNames = async (teamId) => {
    const snapshot = await get(ref(db, `teams/${teamId}/channels`));
    if (snapshot.exists()) {
      const channels = snapshot.val();
      return Object.values(channels).map(channel => channel.title);
    } else {
      return [];
    }
  };

export const addChatMessage = async (teamId, channelId, message, sender) => {
    const timeStamp = Date.now();

    return push ( ref (db, `teams/${teamId}/channels/${channelId}/chat`), {
        text: message,
        sender,
        timeStamp,
    });
}

export const getChatMessages = (teamId, channelId, callback) => {
    const chatRef = ref(db, `teams/${teamId}/channels/${channelId}/chat`);
    onValue(chatRef, (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.val());
      } else {
        callback([]);
      }
    });
  };

