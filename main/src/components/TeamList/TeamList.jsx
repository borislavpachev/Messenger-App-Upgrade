import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getAllTeams } from "../../services/teams.service";
import { useEffect, useState } from "react";
import { addUserToTeam, removeUserFromTeam } from "../../services/teams.service";
import toast from "react-hot-toast";

export default function TeamList() {
  const { userData } = useContext(AppContext);

  //    const navigate = useNavigate();

  //Teams shown in the sidebar
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const allTeams = await getAllTeams();
      const userUsername = await userData.username;
      const userTeams = allTeams.filter((team) => team.teamMembers.includes(userUsername));
      setTeams(userTeams);
    };

    fetchTeams();
  }, [userData]);

  const handleInputChange = (event) => {
    setSelectedUser(event.target.value);
  };

  const handleAddUser = async () => {
    if (selectedUser) {
      try {
        await addUserToTeam(selectedTeam, selectedUser);
        setTeams(teams.map(team => 
          team.teamName === selectedTeam.teamName 
            ? {...team, teamMembers: [...team.teamMembers, selectedUser]} 
            : team
        ));
        toast.success(`User ${selectedUser} added to team ${selectedTeam.teamName}`);
        setSelectedUser(null);
      } catch (error) {
        console.error("Failed to add user to team", error);
      }
    }
  };

  const handleRemoveUser = async (username) => {
    try {
      await removeUserFromTeam(selectedTeam, username);
      setTeams(teams.map(team => 
        team.teamName === selectedTeam.teamName 
          ? {...team, teamMembers: team.teamMembers.filter(member => member !== username)} 
          : team
      ));
    } catch (error) {
      console.error("Failed to remove user from team", error);
    }
  };

  return (
    <div>
      {teams.map((team) => (
        <div key={team.teamName}>
          <button onClick={() => setSelectedTeam(team)}>{team.teamName}</button>
          {selectedTeam === team && selectedTeam.teamOwner === userData.username && (
            <div className="dropdown">
              <input type="text" value={selectedUser} onChange={handleInputChange} />
              <button onClick={handleAddUser}>Add user</button>
              {team.teamMembers.map(member => (
                <div key={member}>
                  {member}
                  <button onClick={() => handleRemoveUser(member)}>Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}