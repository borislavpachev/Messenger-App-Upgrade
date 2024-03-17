import { useEffect, useState, createContext, useContext } from 'react';
import { onValue, ref } from 'firebase/database';
import { db } from '../config/firebase-config';
import { AppContext } from './AppContext';


const IsSeenContext = createContext();


export function IsSeenProvider({ children }) {
  const [isSeen, setIsSeen] = useState({});
  const { userData, isLoading } = useContext(AppContext)

  useEffect(() => {
    if (!isLoading && userData) {
      const isSeenRef = ref(db, `users/${userData.username}/channels`);
  
      const unsubscribe = onValue(isSeenRef, (snapshot) => {
        const channels = snapshot.val() || {};
        const isSeenStatus = Object.keys(channels).reduce((acc, channelId) => {
          acc[channelId] = channels[channelId].isSeen;
          return acc;
        }, {});
        setIsSeen(isSeenStatus);
      });
  
      return () => unsubscribe();
    }
  }, [userData, isLoading]);

  return (
    <IsSeenContext.Provider value={isSeen}>
      {children}
    </IsSeenContext.Provider>
  );
}

// Create a custom hook to use the isSeen context
export function useIsSeen() {
  return useContext(IsSeenContext);
}