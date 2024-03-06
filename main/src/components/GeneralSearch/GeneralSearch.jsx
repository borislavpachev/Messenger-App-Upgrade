import { useState } from "react";
import { getAllUsers } from "../../services/users.service";
import { getAllTeams } from "../../services/teams.service";

export default function UserSearch({ teamId }) {
    const [searchInput, setSearchInput] = useState({
        username: '',
    });

    const [searchResults, setSearchResults] = useState([]);
    const [emailResults, setEmailResults] = useState([]);
    const [teamResults, setTeamResults] = useState([]);
    const [teamTeamResults, setTeamTeamResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    const updateFormSearch = prop => e => {
        setSearchInput({ ...searchInput, [prop]: e.target.value })
    }

    const searchUsers = async () => {
        const allUsers = await getAllUsers(); 
        const allTeams = await getAllTeams();
        const filteredUsers = allUsers.filter(user => user.username.includes(searchInput.username));
        const filteredEmails = allUsers.filter(user => user.email.includes(searchInput.username));
        const teamTeamResults = allTeams.filter(team => team.teamName.includes(searchInput.username)) 
        const filteredTeams = teamTeamResults.flatMap(team => team.teamMembers.map(member => ({ member, teamName: team.teamName })));
        return {filteredUsers, filteredEmails, teamTeamResults, filteredTeams};
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const {filteredUsers, filteredEmails, filteredTeams, teamTeamResults} = await searchUsers();
        setSearchResults(filteredUsers);
        setEmailResults(filteredEmails);
        setTeamResults(filteredTeams);
        setTeamTeamResults(teamTeamResults);
        setSearchPerformed(true);
    }

    return (
        <div className='user-search'>
            <form className="user-search-form" onSubmit={handleSubmit}>
                <input autoComplete="off" className="form-control"
                    type="text" id="username"
                    value={searchInput.username} onChange={updateFormSearch('username')} />
                <button className="search-button" onClick={handleSubmit}>Search</button>
                <h6>Username matches</h6>
                <div className="search-results">
                    {searchPerformed && searchResults.map((user, index) => (
                        <div className="search-results-item" key={index}>
                            <div className="user-info">
                                {user.username}
                            </div>
                        </div>
                    ))}
                </div>
                <h6>E-mail matches</h6>
                <div className="search-results">
                    {searchPerformed && emailResults.map((user, index) => (
                        <div className="search-results-item" key={index}>
                            <div className="user-info">
                                {user.username} - {user.email}
                            </div>
                        </div>
                    ))}
                </div>
                <h6>Team matches</h6>
                <div className="search-results">
                    {searchPerformed && teamResults.map((result, index) => (
                        <div className="search-results-item" key={index}>
                            <div className="user-info">
                                {result.member} - {result.teamName}
                            </div>
                        </div>
                    ))}
                </div>
            </form>
        </div>
    );
}