import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db, storage } from '../config/firebase-config';


export const getUserData = async (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getUserByUsername = async (username) => {

  return get(ref(db, `users/${username}`));
};

export const createUser = async (username, firstName, lastName, email, uid, phoneNumber, photoURL) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), phoneNumber, photoURL })
};


