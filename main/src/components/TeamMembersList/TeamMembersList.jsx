import { useState, useEffect } from "react";
import { addUserToTeam, getTeamMembersByTeamId, removeUserFromTeam } from "../../services/teams.service";
import toast from "react-hot-toast";

export default function TeamMembersList({ teamId }) {
    //Add and remove users

    const [selectedUser, setSelectedUser] = useState(null);
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        getTeamMembersByTeamId(teamId)
          .then(fetchedMembers => {
            //console.log('Fetched members:', fetchedMembers); // Add this line
            setTeamMembers(fetchedMembers);
          })
          .catch(error => {
            console.error(error);
          });
      }, [teamId]);

    const handleInputChange = (event) => {
        setSelectedUser(event.target.value);
    };

    const handleAddUser = async () => {
        if (selectedUser && selectedUser.trim() !== "") {
            try {
                await addUserToTeam(teamId, selectedUser);
                setTeamMembers(prevMembers => [...prevMembers, selectedUser]);
                toast.success(`User ${selectedUser} added to team ${teamId}`);
                setSelectedUser(null);
            } catch (error) {
                toast.error("Failed to add user to team");
                console.error("Failed to add user to team", error);
            }
        }
    };

    const handleRemoveUser = async (username) => {
        try {
            await removeUserFromTeam(teamId, username);
            setTeamMembers(prevMembers => prevMembers.filter(member => member !== username));
        } catch (error) {
            toast.error("Failed to remove user from team");
            console.error("Failed to remove user from team", error);
        }
    };

    return (
        <div>
            <input type="text" value={selectedUser || ''} onChange={handleInputChange} />
            <button onClick={handleAddUser}>Add user</button>
            {teamMembers.map(member => (
                <div key={member}>
                    {member}
                    <button onClick={() => handleRemoveUser(member)}>Remove</button>
                </div>
            ))}
        </div>
    );
}