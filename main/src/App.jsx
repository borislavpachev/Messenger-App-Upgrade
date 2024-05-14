import { useEffect, useState } from 'react';
import { AppContext } from './context/AppContext';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './config/firebase-config';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { changeUserStatus, getUserData } from './services/users.service';
import Authenticated from './hoc/Authenticated';
import Login from './views/Login/Login';
import ForgotPassword from './views/ForgotPassword/ForgotPassword';
import CreateAccount from './views/CreateAccount/CreateAccount';
import UpdateAccount from './views/UpdateAccount/UpdateAccount';
import MainView from './views/MainView/MainView';
import ErrorPage from './views/ErrorPage/ErrorPage';
import { Toaster } from 'react-hot-toast';
import Loader from './components/Loader/Loader';
import CallNotification from './components/CallNotification/CallNotification';
import { IsSeenProvider } from './context/IsSeenProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
    isSeen: {},
    isLoading: true,
  });
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      getUserData(user.uid).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          const username = userData[Object.keys(userData)[0]].username;
          changeUserStatus(username, 'Online');

          setAppState({
            user,
            userData: userData[Object.keys(userData)[0]],
            isLoading: false, 
          });
        }
      });
    } else {
      setAppState((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  }, [user]);

  if (loading || appState.isLoading) {
    return <Loader />;
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
              <Route path="/login" element={<Login />} />
              <Route path="/create-account" element={<CreateAccount />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                path="/update-profile"
                element={
                  <Authenticated>
                    <UpdateAccount />
                  </Authenticated>
                }
              />
              <Route
                path="/main/*"
                element={
                  <Authenticated>
                    <MainView />
                  </Authenticated>
                }
              />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </IsSeenProvider>
        </AppContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
