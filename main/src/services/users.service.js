import { get, set, ref, query, equalTo, orderByChild, update } from 'firebase/database';
import { db, storage } from '../config/firebase-config';
import { ref as sRef } from 'firebase/storage';
import { getDownloadURL, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';

export const getUserData = async (uid) => {

  return get(query(ref(db, 'users'), orderByChild('uid'), equalTo(uid)));
};

export const getUserByUsername = async (username) => {

  return get(ref(db, `users/${username}`));
};

export const createUser = async (username, firstName, lastName, email, uid, phoneNumber, photoURL) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), phoneNumber, photoURL })
};

export const uploadProfilePicture = async (file, user) => {

  const fileRef = sRef(storage, `profile-photos/${user.uid}.png`);
  await uploadBytes(fileRef, file);
  const uploadedPhotoURL = await getDownloadURL(fileRef);
  updateProfile(user, { photoURL: uploadedPhotoURL });

  return uploadedPhotoURL;
}

export const updatePhotoURL = async (username, photoURL) => {
  return set(ref(db, `users/${username}/photoURL`), photoURL);
}