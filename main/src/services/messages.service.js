import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db } from '../config/firebase-config';

export const createChatRoom = async () => {
    return set(ref(db, `chats/`), { chatParticipants: {}, chatMessages: {} })
}

