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
    equalTo,
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

export const getGeneralChannelId = async (teamId) => {
  const channelsRef = ref(db, 'channels');
  const q = query(channelsRef, orderByChild('teamId'), equalTo(teamId));
  const snapshot = await get(q);
  const channels = snapshot.val();

  // Find the ID of the "General" channel
  let generalChannelId;
  for (let id in channels) {
    if (channels[id].title === "General") {
      generalChannelId = id;
      break;
    }
  }

  return generalChannelId;
};

export const addChatMessage = async (channelId, message, sender) => {
  const userMessage = {
    message: message,
    sender: sender,
    sentOn: Date.now(),
}
const messagesRef = push(ref(db, `channels/${channelId}/chat`), userMessage);
return messagesRef;
}

export const getChannelMessagesById = async ( channelId) => {
  const snapshot = await get(ref(db, `channels/${channelId}/chat`));
  if (!snapshot.exists()) {
      return null;
  }
  return Object.values(snapshot.val());
}



export const getChannelWithLiveUpdates = (channelId, setMessages) => {
  const messagesRef = ref(db, `channels/${channelId}/chat`);
  onValue(messagesRef, (snapshot) => {
    const result = snapshot.val();
    if (result) {
      setMessages(Object.values(snapshot.val()));
    }
  });

  // Return the Firebase reference instead of the unsubscribe function
  return messagesRef;
}
