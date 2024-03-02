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

 export const createChannel = async (teamId, owner, title, members) => {
    return push (ref(db,`teams/${teamId}/channels`), {
        owner,
        title,
        teamId, 
        chat: {},
        members,
    })
}

export async function getChannelsByTeamId(teamId) {
  const channelsRef = ref (db, `teams/${teamId}/channels`);

  return new Promise ((resolve, reject) => {
    onValue(channelsRef, (snapshot) => {
      const data = snapshot.val();
      if(!data) {
        resolve([]);
        return
      }

      const channels = Object.keys(data).map((id) => ({
        id,
        ...data[id]
      }))

      resolve(channels)
    }, (error) => {
      reject(error)
    })
  })
}

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

