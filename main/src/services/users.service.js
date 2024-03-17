import { get, set, ref, query, equalTo, orderByChild, update, onValue, off } from 'firebase/database';
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

export const createUser = async (username, firstName, lastName, email, uid, phoneNumber, photoURL, status) => {

  return set(ref(db, `users/${username}`), { username, firstName, lastName, uid, email, createdOn: Date.now(), phoneNumber, photoURL, status })
};

export const uploadProfilePicture = async (file, user) => {

  const fileRef = sRef(storage, `profile-photos/${user.uid}.png`);
  await uploadBytes(fileRef, file);
  const uploadedPhotoURL = await getDownloadURL(fileRef);
  await updateProfile(user, { photoURL: uploadedPhotoURL });

  return uploadedPhotoURL;
}

export const updatePhotoURL = async (username, photoURL) => {
  return set(ref(db, `users/${username}/photoURL`), photoURL);
}

export const getUserByEmail = async (email) => {

  return get(ref(db, `users'/${email}`));
};


export const getUserDataByUsername = async (username) => {
  const snapshot = await get(ref(db, `users/${username}`));
  if (!snapshot.exists()) {
    return null;
  }
  return snapshot.val();
}

export const getUserDataByUsernameLive = (username, setUser) => {
  const userRef = ref(db, `users/${username}`);

  const listener = onValue(userRef, (snapshot) => {
    const result = snapshot.val();
    if (result) {
      setUser(result);
    } else {
      setUser(null);
    }
  }, (error) => {
    console.error(error.code);
  });

  return () => {
    
    off(userRef, listener);
  };
}


export const updateUser = async (username, firstName, lastName, email, uid, phoneNumber) => {

  return update(ref(db, `users/${username}`), { username, firstName, lastName, email, uid, phoneNumber });
}

export const getAllUsers = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) {
    return [];
  }
  const users = Object.keys(snapshot.val()).map(key => snapshot.val()[key]);
  return users;
}

export const getAllUsersUsernames = async () => {
  const snapshot = await get(ref(db, 'users'));
  if (!snapshot.exists()) {
    return [];
  }
  const userNames = Object.keys(snapshot.val());
  return userNames;
}

export const changeUserStatus = async (username, status) => {
  return update(ref(db, `users/${username}`), { status });
}

export const getUserStatus = async (username) => {
  const snapshot = await get(ref(db, `users/${username}/status`));
  return snapshot.val();
};
