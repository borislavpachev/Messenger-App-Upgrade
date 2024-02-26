import { NavLink, useNavigate } from "react-router-dom";
import "./Header.css"
import { useContext, useState } from "react";
import { logoutUser } from "../../services/auth.service";
import { CgProfile } from "react-icons/cg";
import { MdOutlineSettings } from "react-icons/md";
import { FaPowerOff } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
// import logo from '../../assets/logo.png';


export default function Header() {
    const { user, userData, setAppState } = useContext(AppContext);
    const [visible, setVisible] = useState(false);

    const navigate = useNavigate();

    const logout = async () => {
        await logoutUser();
        setAppState({ user: null, userData: null });
        toggleProfile();
        navigate('/');
    }

    const getUserInitials = () => {
        const firstName = userData.firstName[0].toUpperCase();
        const lastName = userData.lastName[0].toUpperCase();

        return firstName + lastName;
    }

    const toggleProfile = () => {
        setVisible(!visible);
    }

    return (
        <>
            <header>
                {/* <span className="logo-container"  ><img src={logo} alt="Logo" className="logo" /></span> */}
                <NavLink className='header-link' to="/">Home</NavLink>
                {userData && userData.isAdmin ? <NavLink className='header-link' to="/admin-powers">Admin Powers</NavLink> : undefined}
                {!user ?
                    (<>
                        <NavLink className='header-link' to="/login">Login</NavLink>
                    </>
                    ) : (
                        <>
                            <h4 className="header-username">
                                {`${userData?.username[0].toUpperCase()}${userData?.username.slice(1)}'s room`}
                            </h4>
                        </>
                    )
                }
                {user &&
                    <>
                        <div className="profile-view" onClick={toggleProfile}>
                            {!user.photoURL ? <CgProfile className='header-profile-pic' /> :
                                <img src={`${user.photoURL}`} alt="avatar" className="header-profile-pic" />
                            }
                            <p>{userData ? getUserInitials() : null}</p>
                        </div>
                        {visible && (
                            <div className="header-profile">
                                <div className="profile-overlay" onClick={toggleProfile}></div>
                                <div className="header-profile-content">
                                    <NavLink to="/user-profile" onClick={toggleProfile}><CgProfile className="profile-icons" />My room</NavLink>
                                    <NavLink to="/update-profile" onClick={toggleProfile}><MdOutlineSettings className="profile-icons" />Settings</NavLink>
                                    <div className="logout" onClick={logout}> <FaPowerOff className="profile-icons" />
                                        Log out</div>
                                </div>
                            </div>
                        )}
                    </>
                }
            </header >
        </>
    )
}