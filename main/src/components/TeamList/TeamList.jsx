import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getAllTeams } from "../../services/teams.service";
import { useEffect, useState } from "react";
import { addUserToTeam, removeUserFromTeam } from "../../services/teams.service";
import toast from "react-hot-toast";

export default function TeamList({ onItemClick }) {
  const { userData } = useContext(AppContext);

  //    const navigate = useNavigate();

  //Teams shown in the sidebar
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    onItemClick(team);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      const allTeams = await getAllTeams();
      const userUsername = await userData.username;
      const userTeams = allTeams.filter((team) => team.teamMembers.includes(userUsername));
      setTeams(userTeams);
    };

    fetchTeams();
  }, [userData]);

  return (
    <div>
      {teams.map((team) => (
        <div key={team.teamName}>
          <button onClick={() =>  handleTeamClick(team)}>{team.teamName}</button>
        </div>
      ))}
  </div>
  );
}