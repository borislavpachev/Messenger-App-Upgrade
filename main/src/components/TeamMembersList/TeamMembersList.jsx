import { useState, useEffect } from "react";
import { addUserToTeam, getTeamById, getTeamMembersByTeamId, removeUserFromTeam, deleteTeam, getAllTeams } from "../../services/teams.service";
import toast from "react-hot-toast";
import { getAllUsers, getUserStatus } from "../../services/users.service";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { getTeamOwner } from "../../services/teams.service";
import { BsFillDashCircleFill, BsFillRecordCircleFill, BsCheckCircle } from "react-icons/bs";
import './TeamMembersList.css'
import { useNavigate } from "react-router-dom";

export default function TeamMembersList({ teamId }) {
    const { userData } = useContext(AppContext);
    const [teamMembers, setTeamMembers] = useState([]);
    const [userRemoved, setUserRemoved] = useState(false);
    const [teamMembersStatus, setTeamMembersStatus] = useState([]);
    const [noTeam, setNoTeam] = useState([false]);

    const navigate = useNavigate();

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
                    return { username: memberUsername, status }; 
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
            setUserRemoved(true);
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

    const handleLeaveTeam = async () => {
        try {
            await removeUserFromTeam(teamId, userData.username);
            navigate(`/main`)
            setTeamMembers(prevMembers => prevMembers.filter(member => member !== userData.username));
            toast.success("You have left the team");
        } catch (error) {
            toast.error("Failed to leave the team");
            console.error("Failed to leave the team", error);
        }
    };

    const handleDeleteTeam = async () => {
        try {
            await deleteTeam(teamId);
            navigate(`/main`)
            toast.success("Team deleted successfully");
        } catch (error) {
            toast.error("Failed to delete team");
            console.error("Failed to delete team", error);
        }
    };

    const allTeamMembers = (
        <div className="team-members-author-view">
            {teamMembersStatus.map(member => (
                <div key={member.username}>
                    {member.status === 'Online' ? <BsCheckCircle color='green' size='1rem' /> :
                        member.status === 'Offline' ? <BsFillRecordCircleFill color='grey' size='1rem' /> :
                            member.status === 'Do not disturb' ? <BsFillDashCircleFill color='red' size='1rem' /> : null}
                    {member.username}
                    {member.username !== teamOwner && <button className="remove-user-from-team-list" onClick={() => handleRemoveUser(member.username)}>Remove</button>}
                </div>
            ))}
        </div>
    );

    const allTeamMembersNotAuthor = (
        <div className="team-members-not-author-view">
            {teamMembersStatus.map(member => (
                <div key={member.username}>
                    {member.status === 'Online' ? <BsCheckCircle color='green' size='1rem' /> :
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

    const checkUserTeams = async () => {
        try {
            const allTeams = await getAllTeams();
            const userTeams = allTeams.filter(team => team.teamMembers.includes(userData.username));
    
            if (userTeams.length === 0) {
                setNoTeam(true);
            }
        } catch (error) {
            console.error("Failed to fetch teams", error);
        }
    };

    useEffect(() => {
        checkUserTeams();
    }, [])

    return (
        <div className='team-members-list'>
            {userData && userData.username === teamOwner ? (
                <form className="team-memberes-list-form" onSubmit={handleSubmit}>
                    <h1 className="search-user-team">Add user</h1>
                    <input autoComplete="off" className="form-control-team-members-list"
                        type="text" id="username-team-members-list" placeholder="Search by username"
                        value={searchInput.username} onChange={updateFormSearch('username')} />
                    <button className="search-button-team-member-list" onClick={handleSubmit}>Search</button>
                    <h2>{searchPerformed ? "Search Results" : "Team Members"}</h2>
                    <div className="search-results-team-members-list">
                        {!searchPerformed
                            ? allTeamMembers
                            : (searchResults).map((user, index) => (
                                <div className="search-results-team-members-list" key={index}>
                                    <div className="user-info-team-members-list">
                                        {user.username}
                                    </div>
                                    {!teamMembers.some(member => member === user.username)
                                        ? <div className="use-actions-team-members-list">
                                            <button className="add-user-to-team" onClick={() => handleAddUser(user.username)}>Add</button>
                                        </div>
                                        : user.username !== teamOwner && <div className="use-actions-team-members-list">
                                            <button className="remove-user-from-team" onClick={() => handleRemoveUser(user.username)}>Remove</button>
                                        </div>}
                                </div>
                            ))}
                    </div>
                    {userData && userData.username === teamOwner && !searchPerformed && (
                        <button className='delete-team-button' onClick={handleDeleteTeam}>Delete Team</button>
                    )}
                </form>
            ) : (
                <div className="not-author-list">
                    <h2 className="team-members-not-author-header">Team Members</h2>
                    {allTeamMembersNotAuthor}
                </div>
            )}
            {userData && userData.username !== teamOwner && !noTeam && (
                <button className="leave-team-button" onClick={handleLeaveTeam}>Leave Team</button>
            )}
        </div>
    );
}