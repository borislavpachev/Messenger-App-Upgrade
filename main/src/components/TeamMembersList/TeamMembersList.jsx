import { useState, useEffect } from "react";
import { addUserToTeam, getTeamMembersByTeamId, removeUserFromTeam } from "../../services/teams.service";
import toast from "react-hot-toast";
import { getAllUsers } from "../../services/users.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getTeamOwner } from "../../services/teams.service";

export default function TeamMembersList({ teamId }) {
    const {userData} = useContext(AppContext);
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        getTeamMembersByTeamId(teamId)
          .then(fetchedMembers => {
            setTeamMembers(fetchedMembers);
          })
          .catch(error => {
            console.error(error);
          });
      }, [teamId]);


    const handleAddUser = async (username) => {
        if (username && username.trim() !== "") {
            try {
                await addUserToTeam(teamId, username);
                setTeamMembers(prevMembers => [...prevMembers, username]);
                toast.success(`User ${username} added to team ${teamId}`);
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

    const allTeamMembers = (
        <div>
            {teamMembers.map(member => (
                <div key={member}>
                    {member}
                    <button onClick={() => handleRemoveUser(member)}>Remove</button>
                </div>
            ))}
        </div>
    );

    const allTeamMembersNotAuthor = (
        <div>
            {teamMembers.map(member => (
                <div key={member}>
                    {member}
                </div>
            ))}
        </div>
    );

    //Search user
    const [searchInput, setSearchInput] = useState({
        username: '',
    });

    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const updateFormSearch = prop => e => {
        setSearchInput({ ...searchInput, [prop]: e.target.value })
    }

    const searchUsers = async () => {
        const allUsers = await getAllUsers(); 
        const filteredUsers = allUsers.filter(user => user.username.includes(searchInput.username));
        return filteredUsers;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const results = await searchUsers();
        setSearchResults(results);
        setSearchPerformed(true);
    }

    useEffect(() => {
        if (searchInput.username === '') {
            setSearchPerformed(false);
        }
    }, [searchInput]);

    //Check if the user is owner of the team
    const [teamOwner, setTeamOwner] = useState("");

    useEffect(() => {
        getTeamOwner(teamId)
            .then(owner => {
                setTeamOwner(owner);
            })
            .catch(error => {
                console.error(error);
            });
    }, [teamId]);


    
            return (
            <div className='team-members'>
                {userData && userData.username === teamOwner ? (
                    <form className="team-memberes-form" onSubmit={handleSubmit}>
                        <h1 className="search-user">Search user</h1>
                        <h4 className="username">Username: </h4>
                        <input autoComplete="off" className="form-control"
                            type="text" id="username"
                            value={searchInput.username} onChange={updateFormSearch('username')} />
                        <button className="search-button" onClick={handleSubmit}>Search</button>
                        <h2>Search Results</h2>
                        <div className="search-results">
                            {!searchPerformed
                            ? allTeamMembers
                            : (searchResults).map((user, index) => (
                                <div className="search-results-item" key={index}>
                                    <div className="user-info">
                                        {user.username}
                                    </div>
                                    <div className="use-actions">
                                        <button onClick={() => handleAddUser(user.username)}>Add</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </form>
                ) : (
                    allTeamMembersNotAuthor
                )}
            </div>
        );
}