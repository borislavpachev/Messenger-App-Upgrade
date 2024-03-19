import { useState, useEffect, useContext } from "react";
import { getAllUsersUsernames } from "../../services/users.service";
import { getAllTeamsNames, getTeamById, getTeamIdByTeamName, getAllTeams } from "../../services/teams.service";
import { Autocomplete, TextField, Box } from '@mui/material';
import { FaUser, FaUserFriends } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { getChatIdIfParticipantsMatch } from "../../services/chats.service";
import { createChatRoom } from "../../services/chats.service";

export default function UserSearch({ onItemClick }) {
    const { userData } = useContext(AppContext);

    const [searchResults, setSearchResults] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);

    const navigate = useNavigate();

    const handleTeamClick = (teamId) => {
        setSelectedTeam(teamId);
        onItemClick(teamId);
    };

    const searchUsers = async () => {
        const allUsers = await getAllUsersUsernames();
        const allTeams = await getAllTeams();
        const userTeams = allTeams.filter((team) => Array.isArray(team.teamMembers) && team.teamMembers.includes(userData?.username));
        const allUsersTeams = userTeams.map(team => team.teamName);
        const allTeamsandUsers = [...allUsersTeams.map(name => ({ name, type: 'team' })), ...allUsers.map(name => ({ name, type: 'user' }))];
        return allTeamsandUsers;
    };

    useEffect(() => {
        searchUsers().then(allTeamsandUsers => {
            setSearchResults(allTeamsandUsers);
        });
    }, []);

    const handleOptionSelect = async (event, value) => {
        if (value === null) {
            return
        }
        if (value.type === 'team') {
            const teamId = await getTeamIdByTeamName(value.name);
            navigate(`/main/${teamId}`)
        } else if (value.type === 'user') {
            const chatId = await getChatIdIfParticipantsMatch(userData.username, value.name);
            if (chatId) {
                navigate(`chats/${chatId}`);
            } else {
                await createChatRoom([userData.username, value.name]);
                const newChatId = await getChatIdIfParticipantsMatch(userData.username, value.name);
                navigate(`chats/${newChatId}`);
            }
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
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Search"
                            InputProps={{ ...params.InputProps, endAdornment: null }}
                        />
                    )}
                />
            </form>
        </div>
    );
}