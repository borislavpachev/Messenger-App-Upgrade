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
  const newChannel = await push (ref(db,`channels`), {
      owner,
      title,
      teamId, 
      members,
  });
  await push(ref(db, `chats/${newChannel.key}`), chat);
  return newChannel;
}

export async function getChannelsByTeamId(teamId) {
  const channelsQuery = query(ref(db, 'channels'), orderByChild('teamId'), equalTo(teamId));

  return new Promise ((resolve, reject) => {
    onValue(channelsQuery, (snapshot) => {
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

export const addChatMessage = async (teamId,channelId, message, sender) => {
  const userMessage = {
    message: message,
    sender: sender,
    sentOn: Date.now(),
}
const messagesRef = push(ref(db, `teams/${teamId}/channels/${channelId}/messages`), userMessage);
return messagesRef;
}

export const getChannelMessagesById = async (teamId, channelId) => {
  const snapshot = await get(ref(db, `teams/${teamId}/channels/${channelId}/messages`));
  if (!snapshot.exists()) {
      return null;
  }
  return Object.values(snapshot.val());
}

export const getChannelWithLiveUpdates = (teamId, channelId, setMessages) => {
  const messagesRef = ref(db, `teams/${teamId}/channels/${channelId}/messages`);
  const listener = onValue(messagesRef, (snapshot) => {
      const result = snapshot.val();
      if (result) {
          setMessages(Object.values(snapshot.val()));
      }
  });
  return listener;
}
