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
    increment,   
  } from 'firebase/database';
   import { db } from '../config/firebase-config';   

 export const createChannel = async (teamId, owner, title, chat, members, isPrivate) => {
  if (title.length < 2 || title.length > 20) {
    throw new Error('Channel title must be between 2 and 20 characters long');
  }
  
  const newChannel = await push (ref(db,`channels`), {
      owner,
      title,
      teamId, 
      members,
      isPrivate,
      isSeen: true,
  });
 
  return newChannel;
}

export async function getChannelsByTeamId(teamId, username) {
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

      const accessibleChannels = channels.filter(channel => 
        !channel.isPrivate || channel.owner === username || (channel.isPrivate && channel.members.includes(username))
      );

      resolve(accessibleChannels)
    }, (error) => {
      reject(error)
    })
  })
}

export async function getChannelIdByTitle(teamId, channelTitle, username) {
  const channelsQuery = query(ref(db, 'channels'), orderByChild('teamId'), equalTo(teamId));

  return new Promise ((resolve, reject) => {
    onValue(channelsQuery, (snapshot) => {
      const data = snapshot.val();
      if(!data) {
        resolve(null);
        return
      }

      const channels = Object.keys(data).map((id) => ({
        id,
        ...data[id]
      }))

      const accessibleChannels = channels.filter(channel => 
        !channel.isPrivate || channel.owner === username || (channel.isPrivate && channel.members.includes(username))
      );

      // Find the ID of the specified channel
      const channel = accessibleChannels.find(channel => channel.title === channelTitle);

      resolve(channel ? channel.id : null);
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

export const leaveChannel = async (channelId, username) => {

  const snapshot = await get(ref(db, `channels/${channelId}/members`));
  if (!snapshot.exists()) {
    return false;
  }
  const participants = snapshot.val();
  const participantKey = Object.keys(participants).find(key => participants[key] === username);

  if (participantKey) {
    await remove(ref(db, `channels/${channelId}/members/${participantKey}`));
    return true;
  } else {
    return false;
  }
}

export const setChannelIsSeen = async (channelId, username, isSeen) => {
    await set(ref(db, `users/${username}/channels/${channelId}/isSeen`), isSeen);
  }

export const addChatMessage = async (channelId, message, sender, fileURL) => {
  const userMessage = {
    message: message,
    sender: sender,
    sentOn: Date.now(),    
    fileURL: fileURL,
    reactions: { like: 0, laugh: 0, cry: 0 },
  }

  const messagesRef = push(ref(db, `channels/${channelId}/chat`));
  userMessage.id = messagesRef.key;
  await set(messagesRef, userMessage);

  const channelSnapshot = await get(ref(db, `channels/${channelId}`));
  if (channelSnapshot.exists()) {
    const channel = channelSnapshot.val();
    if (Array.isArray(channel.members)) {
      channel.members.forEach(async member => {
        if (member !== sender) {
          await set(ref(db, `users/${member}/channels/${channelId}/isSeen`), false);
        }
      });
    }
  }

  return messagesRef;
}


export const getChannelMessagesById = async (channelId) => {
  const snapshot = await get(ref(db, `channels/${channelId}/chat`));
  if (!snapshot.exists()) {
    return null;
  }
  return Object.entries(snapshot.val()).map(([id, message]) => ({ id, ...message }));
}

export const editChatMessage = async (channelId, messageId, newMessageContent, newFileURL) => {
  let updateData = {
    message: newMessageContent,
  };

  if (newFileURL) {
    updateData.fileURL = newFileURL;
  }

  const messageRef = update(ref(db, `channels/${channelId}/chat/${messageId}`), updateData);

  return messageRef;
}

export const deleteChatMessage = async (channelId, messageId) => {
  const messageRef = ref(db, `channels/${channelId}/chat/${messageId}`);
  remove(messageRef);
}

export const handleReactionClick = async (channelId, messageId, reactionType) => {
  const messageRef = ref(db, `channels/${channelId}/chat/${messageId}`);
  await update(messageRef, {
    [`reactions/${reactionType}`]: increment(1),
  });
}


export const getChannelWithLiveUpdates = (channelId, callback) => {
  const messagesRef = ref(db, `channels/${channelId}/chat`);
  onValue(messagesRef, (snapshot) => {
    if (snapshot.exists()) {
      const messages = Object.entries(snapshot.val()).map(([id, message]) => ({ id, ...message }));
      callback(messages);
    } else {
      callback([]);
    }
  });

  return messagesRef;
}

export const renameChannel = async (channelId, newTitle) => {
  if (newTitle.length < 2 || newTitle.length > 20) {
    throw new Error('Channel title must be between 2 and 20 characters long');
  }

  await update(ref(db, `channels/${channelId}`), {
    title: newTitle,
  });
}

export const deleteChannel = async (channelId) => {
  await remove(ref(db, `channels/${channelId}`));
}

export const deleteChannelsByTeamId = async (teamId) => {
  const channelsRef = ref(db, 'channels');
  const channelsQuery = query(channelsRef, equalTo(teamId, 'teamId'));
  const snapshot = await get(channelsQuery);

  if (snapshot.exists()) {
    const channels = snapshot.val();
    for (const channelId in channels) {
      await deleteChannel(channelId);
    }
  }
}

export const addMemberToChannel = async (channelId, newMember) => {
  const snapshot = await get(ref(db, `channels/${channelId}/members`));
  const members = snapshot.exists() ? snapshot.val() : [];
  members.push(newMember);

  await set(ref(db, `channels/${channelId}/members`), members);
}

