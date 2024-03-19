import { useEffect, useState } from 'react';
import { AppContext } from './context/AppContext'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { changeUserStatus, getUserData } from './services/users.service'
import Authenticated from './hoc/Authenticated';
import Login from './views/Login/Login'
import ForgotPassword from './views/ForgotPassword/ForgotPassword'
import CreateAccount from './views/CreateAccount/CreateAccount'
import UpdateAccount from './views/UpdateAccount/UpdateAccount'
import MainView from './views/MainView/MainView'
import UserProfile from './views/UserProfile/UserProfile';
import ErrorPage from './views/ErrorPage/ErrorPage'
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader/Loader'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import CallNotification from './components/CallNotification/CallNotification'
import { IsSeenProvider } from './context/IsSeenProvider';


function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    teams: null,
    channels: null,
    chats: null,
    isSeen: {},
    isLoading: true,
  });
  const [user, loading, error] = useAuthState(auth);


  useEffect(() => {
    if (user) {
      setAppState(prevState => ({ ...prevState, isLoading: true }));

      getUserData(user.uid)
        .then(snapshot => {
          if (snapshot.exists()) {
            setAppState({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
            const userData = snapshot.val();
            const username = userData[Object.keys(userData)[0]].username;
            changeUserStatus(username, 'Online')


            setAppState(prevState => ({
              ...prevState,
              user,
              userData: userData[Object.keys(userData)[0]],
              isLoading: false,
            }));
          }
        })
    }
  }, [user]);

  if (loading) {
    return <Loader />
  }

  return (
    <>
   
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState }}>
        <CallNotification />
          <Toaster />
          <IsSeenProvider>
          <Routes>
            <Route index element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/create-account' element={<CreateAccount />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/update-profile' element={<Authenticated><UpdateAccount /></Authenticated>} />
            <Route path='/main/*' element={<Authenticated><MainView /></Authenticated>} />
            <Route path='/user-profile' element={<Authenticated><UserProfile /></Authenticated>} />
            <Route path='*' element={<ErrorPage/>} />
          </Routes>
          </IsSeenProvider>
        </AppContext.Provider>
      </BrowserRouter >
    </>
  )
}

export default App
