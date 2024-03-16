import { useState, useEffect } from "react";
import { getAllUsersUsernames } from "../../services/users.service";
import { getAllTeamsNames, getTeamById, getTeamIdByTeamName } from "../../services/teams.service";
import { Autocomplete, TextField, Box } from '@mui/material';
import { FaUser, FaUserFriends  } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function UserSearch({ onItemClick }) {
    const [searchResults, setSearchResults] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const navigate = useNavigate();

    const handleTeamClick = (teamId) => {
        setSelectedTeam(teamId);
        onItemClick(teamId);
    };

    const searchUsers = async () => {
        const allUsers = await getAllUsersUsernames(); 
        const allTeams = await getAllTeamsNames();
        const allTeamsandUsers = [...allTeams.map(name => ({name, type: 'team'})), ...allUsers.map(name => ({name, type: 'user'}))];
        return allTeamsandUsers;
    };

    useEffect(() => {
        searchUsers().then(allTeamsandUsers => {
            setSearchResults(allTeamsandUsers);
        });
    }, []);

    const handleOptionSelect = async (event, value) => {
        if (value.type === 'team') {
            const teamId = await getTeamIdByTeamName(value.name);
            navigate(`/main/${teamId}`)
        } else if (value.type === 'user') {
            navigate(`/users/${value.name}`);
        }
    }

    return (
        <div className='user-search'>
            <form className="user-search-form">
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={searchResults}
                    sx={{ width: 300 }}
                    onChange={handleOptionSelect}
                    renderOption={(props, option) => (
                        <Box component="li" {...props}>
                            {option.type === 'user' ? <FaUser /> : <FaUserFriends />}
                            {option.name}
                        </Box>
                    )}
                    getOptionLabel={(option) => option.name}
                    renderInput={(params) => <TextField {...params} label="Search" />}
                />
            </form>
        </div>
    );
}