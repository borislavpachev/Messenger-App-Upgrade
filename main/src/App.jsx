import { useEffect, useState } from 'react';
import { AppContext } from './context/AppContext'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getUserData } from './services/users.service'
import Authenticated from './hoc/Authenticated';
import Login from './views/Login/Login'
import './App.css'
import Home from './views/Home/Home';
import Header from './components/Header/Header';

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
          <Header />
          <Routes>
            <Route index element={<Home />} />
            <Route path='/login' element={<Login/>} />
            {/* <Route path='/create-account' element={<CreateAccount />} />
            <Route path='/update-profile' element={<Authenticated><UpdateAccount /></Authenticated>} />
            <Route path='/forgot-password' element={<ForgotPassword />} />  */}
          </Routes>
        </AppContext.Provider>
      </BrowserRouter >
    </>
  )
}

export default App
