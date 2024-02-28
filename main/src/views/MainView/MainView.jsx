import { AppContext } from "../../context/AppContext";
import { useContext } from "react";
import { logoutUser } from "../../services/auth.service";
import { NavLink, useNavigate } from 'react-router-dom';
import TeamBar from "../../components/TeamBar/TeamBar";
import ChannelBar from "../../components/ChannelBar/ChannelBar";
import Header from "../../components/Header/Header";
import ContentBox from "../../components/ContentBox/ContentBox";

export default function MainView() {
    const { user, userData, setAppState } = useContext(AppContext);

    const navigate = useNavigate();

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        navigate('/');
    }

    return (
        <div className="container-fluid h-100 m-2 p-0">
        <div className="row h-100">          
            <TeamBar />         
            <ChannelBar/>          
          <div className="col-9 d-flex flex-column">
            <Header />
            <ContentBox className="flex-grow-1 bg-dark" />            
          </div>          
        </div>
      </div>
    );
    

}



// return (
//     <div>
//         <h2>main view</h2>
//         <div>
//             <NavLink to="/user-profile">Profile</NavLink>
//         </div>
//         <button onClick={logout}>Logout</button>
//     </div>
// )