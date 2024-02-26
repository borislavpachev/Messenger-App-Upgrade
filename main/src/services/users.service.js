import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db, storage } from '../config/firebase-config';


export const getUserData = async (uid) => {

    return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
  };