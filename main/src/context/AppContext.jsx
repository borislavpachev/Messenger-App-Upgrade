import { createContext } from "react";

export const AppContext = createContext({
  user: null,
  userData: null,
  teams: null,
  channels:null,
  chats:null,
  isSeen: null,
  setIsSeen: null, 
});
