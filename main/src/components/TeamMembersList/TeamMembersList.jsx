import { useState, useEffect } from "react";
import { addUserToTeam, getTeamById, getTeamMembersByTeamId, removeUserFromTeam } from "../../services/teams.service";
import toast from "react-hot-toast";
import { getAllUsers, getUserStatus } from "../../services/users.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getTeamOwner } from "../../services/teams.service";
import { BsFillDashCircleFill, BsFillRecordCircleFill,BsCheckCircle  } from "react-icons/bs";

export default function TeamMembersList({ teamId }) {
    const {userData} = useContext(AppContext);
    const [teamMembers, setTeamMembers] = useState([]);
    const [userRemoved, setUserRemoved] = useState(false);
    const [teamMembersStatus, setTeamMembersStatus] = useState([]);


    useEffect(() => {
        getTeamMembersByTeamId(teamId)
          .then(fetchedMembers => {
            setTeamMembers(fetchedMembers);
          })
          .catch(error => {
            console.error(error);
          });
      }, [teamId]);

      useEffect(() => {
        const fetchMemberStatuses = async () => {
          try {
            const memberStatusPromises = teamMembers.map(async (memberUsername) => {
              const status = await getUserStatus(memberUsername);
              return { username: memberUsername, status }; // returns an object with the username and status
            });
            
            const memberStatuses = await Promise.all(memberStatusPromises);
            setTeamMembersStatus(memberStatuses);
          } catch (error) {
            console.error("Error fetching team member statuses", error);
          }
        };
      
        if (teamMembers.length > 0) {
          fetchMemberStatuses();
        }
    
        const intervalId = setInterval(fetchMemberStatuses, 1000);
    
        return () => clearInterval(intervalId);
      }, [teamMembers]);

    //   const membersOfTeam = teamMembersStatus.length === 0 ? null : teamMembersStatus.map(obj => (obj.username));
    //   console.log(membersOfTeam);
    //   const statusOfTeam = teamMembersStatus.length === 0 ? null : teamMembersStatus.map(obj => (obj.status));
    //   console.log(statusOfTeam);

    const handleAddUser = async (username) => {
        if (!teamMembers.some(member => member === username)) {
            try {
                await addUserToTeam(teamId, username);
                setTeamMembers(prevMembers => [...prevMembers, username]);
                const teamName = await getTeamById(teamId)
                toast.success(`User ${username} added to team ${teamName.teamName}`);
            } catch (error) {
                toast.error("Failed to add user to team");
                console.error("Failed to add user to team", error);
            }
        } else {
            toast.error("User is already team member.") 
        }
    };

    const handleRemoveUser = async (username) => {
        try {
            await removeUserFromTeam(teamId, username);
            setTeamMembers(prevMembers => prevMembers.filter(member => member !== username));
            setUserRemoved(true); // Set userRemoved to true when a user is removed
        } catch (error) {
            toast.error("Failed to remove user from team");
            console.error("Failed to remove user from team", error);
        }
    };
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

    const allTeamMembers = (
        <div>
            {teamMembersStatus.map(member => (
                <div key={member.username}>
                {member.status === 'Online' ? <BsCheckCircle  color='green' size='1rem' /> : 
                 member.status === 'Offline' ? <BsFillRecordCircleFill color='grey' size='1rem' /> : 
                 member.status === 'Do not disturb' ? <BsFillDashCircleFill color='red' size='1rem' /> : null}
                {member.username}
                {member.username !== teamOwner && <button onClick={() => handleRemoveUser(member.username)}>Remove</button>}
                </div>
            ))}
        </div>
    );

    const allTeamMembersNotAuthor = (
        <div>
            {teamMembersStatus.map(member => (
                <div key={member.username}>
                {member.status === 'Online' ? <BsCheckCircle  color='green' size='1rem' /> : 
                 member.status === 'Offline' ? <BsFillRecordCircleFill color='grey' size='1rem' /> : 
                 member.status === 'Do not disturb' ? <BsFillDashCircleFill color='red' size='1rem' /> : null}
                {member.username}
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
        const filteredUsers = allUsers.filter(user => user.username.startsWith(searchInput.username));
        return filteredUsers;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const results = await searchUsers();
        setSearchResults(results);
        setSearchPerformed(true);
        setUserRemoved(false);
    }

    useEffect(() => {
        if (searchInput.username === '' && !userRemoved) {
            setSearchPerformed(false);
        }
    }, [searchInput, userRemoved]);

    
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
                                {!teamMembers.some(member => member === user.username)
                                ? <div className="use-actions">
                                    <button onClick={() => handleAddUser(user.username)}>Add</button>
                                </div>
                                : user.username !== teamOwner && <div className="use-actions">
                                    <button onClick={() => handleRemoveUser(user.username)}>Remove</button>
                                </div>}
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