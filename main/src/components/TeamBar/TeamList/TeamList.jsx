import { useContext } from "react";
import { useEffect, useState } from "react";
import TeamBarItem from "../TeamBarItem/TeamBarItem";
import './TeamList.css'
import { AppContext } from "../../../context/AppContext";
import { getAllTeams } from "../../../services/teams.service";

export default function TeamList({ onItemClick }) {
  const { userData } = useContext(AppContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true); // Add this line

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    onItemClick(team);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      if (!userData) {
        setLoading(true);
        return;
      }
      const allTeams = await getAllTeams();
      const userUsername = userData.username;
      const userTeams = allTeams.filter((team) => Array.isArray(team.teamMembers) && team.teamMembers.includes(userUsername));
      setTeams(userTeams);
      setLoading(false); // Set loading to false once the data has been fetched
    };

    fetchTeams();
  }, [userData]);

  if (loading) {
    return <div>Loading...</div>; // Or replace this with a loading spinner or some other placeholder content
  }

  return (
    <div className="team-list">
      {teams.map((team) => (
        <TeamBarItem key={team.teamName} onClick={() => handleTeamClick(team)}>
          <p>{team.teamName}</p>
        </TeamBarItem>
      ))}
    </div>
  );
}
