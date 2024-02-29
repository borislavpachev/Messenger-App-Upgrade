import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../../services/auth.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getAllTeams } from "../../services/teams.service";
import { useEffect, useState } from "react";

export default function TeamBar() {
  const { user, userData, setAppState } = useContext(AppContext);

  const navigate = useNavigate();

  const logout = async () => {
    await logoutUser();
    setAppState({ user: null, userData: null });
    navigate('/');
  }

  //Teams
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    const fetchTeams = async () => {
      const allTeams = await getAllTeams();
      const userUsername = await userData.username;
      const userTeams = allTeams.filter((team) => team.teamMembers.includes(userUsername));
      setTeams(userTeams);
    };

    fetchTeams();
  }, [userData]);

  const teamList = teams.map((team) => {
    return (
      <div key={team.teamName}>{team.teamName}</div>
    );
  });


  return (
    <div className="col-1 h-100 bg-dark text-white">
      <div className="d-stack gap-3">
        <NavLink to="/chats">Private chats</NavLink>
        <br /><br />
        <NavLink to="/create-team">Create Team</NavLink>
        {teamList}
        <NavLink to="/user-profile">Profile</NavLink>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}