import { useEffect, useState } from 'react';
import { AppContext } from './context/AppContext'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getUserData } from './services/users.service'
import Authenticated from './hoc/Authenticated';
import Login from './views/Login/Login'
import ForgotPassword from './views/ForgotPassword/ForgotPassword'
import CreateAccount from './views/CreateAccount/CreateAccount'
import MainView from './views/MainView/MainView'
import UserProfile from './views/UserProfile/UserProfile';
import CreateTeam from './views/CreateTeam/CreateTeam';
import ErrorPage from './views/ErrorPage/ErrorPage'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { Toaster } from 'react-hot-toast';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });
  const [user, loading, error] = useAuthState(auth);


  useEffect(() => {
    if (user) {

      getUserData(user.uid)
        .then(snapshot => {
          if (snapshot.exists()) {
            setAppState({ user, userData: snapshot.val()[Object.keys(snapshot.val())[0]] });
          }
        })
    }
  }, [user]);

  // if (loading) {
  //   return <Loader />
  // }

  return (
    <>
      <BrowserRouter>
        <AppContext.Provider value={{ ...appState, setAppState }}>
          {/* <Header /> */}
          <Toaster />
          <Routes>
            <Route index element={<Login />} />
            <Route path='/login' element={<Login />} />
            <Route path='/create-account' element={<CreateAccount />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            {/*  <Route path='/update-profile' element={<Authenticated><UpdateAccount /></Authenticated>} />*/}
            <Route path='/main' element={<Authenticated><MainView /></Authenticated>} />
            <Route path='/user-profile' element={<Authenticated><UserProfile/></Authenticated>} />
            <Route path='/create-team' element={<Authenticated><CreateTeam /></Authenticated>} />
            <Route path='*' element={<ErrorPage />} />
          </Routes>
        </AppContext.Provider>
      </BrowserRouter >
    </>
  )
}

export default App
