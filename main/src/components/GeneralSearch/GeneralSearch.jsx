import { useState, useEffect, useContext } from 'react';
import { getAllUsersUsernames } from '../../services/users.service';
import { getTeamIdByTeamName, getAllTeams } from '../../services/teams.service';
import { Autocomplete, TextField, Box } from '@mui/material';
import { FaUser, FaUserFriends } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { getChatIdIfParticipantsMatch } from '../../services/chats.service';
import { createChatRoom } from '../../services/chats.service';
import { createDailyRoom } from '../../services/video.service';
import toast from 'react-hot-toast';

export default function UserSearch() {
  const { userData } = useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [newChatRoomId, setNewChatRoomId] = useState('');

  const navigate = useNavigate();

  const searchUsers = async () => {
    const allUsers = await getAllUsersUsernames();
    const allTeams = await getAllTeams();
    const userTeams = allTeams.filter(
      (team) =>
        Array.isArray(team.teamMembers) &&
        team.teamMembers.includes(userData?.username)
    );
    const allUsersTeams = userTeams.map((team) => team.teamName);
    const allTeamsAndUsers = [
      ...allUsersTeams.map((name) => ({ name, type: 'team' })),
      ...allUsers.map((name) => ({ name, type: 'user' })),
    ];
    return allTeamsAndUsers;
  };

  useEffect(() => {
    searchUsers().then((allTeamsAndUsers) => {
      setSearchResults(allTeamsAndUsers);
    });
  }, []);

  useEffect(() => {
    if (newChatRoomId !== '') {
      createDailyRoom(newChatRoomId)
        .then((roomData) => {
          console.log(roomData);
          toast.success('Room created successfully');
          setNewChatRoomId('');
        })
        .catch((error) => {
          console.error('Failed to create room:', error);
        });
    }
  }, [newChatRoomId]);

  const handleOptionSelect = async (event, value) => {
    if (value === null) {
      return;
    }
    if (value.type === 'team') {
      const teamId = await getTeamIdByTeamName(value.name);
      navigate(`/main/${teamId}`);
    } else if (value.type === 'user') {
      const chatId = await getChatIdIfParticipantsMatch(
        userData.username,
        value.name
      );
      if (chatId) {
        navigate(`chats/${chatId}`);
      } else {
        const chatId = await createChatRoom([userData.username, value.name]);
        setNewChatRoomId(chatId);

        const newChatId = await getChatIdIfParticipantsMatch(
          userData.username,
          value.name
        );
        navigate(`chats/${newChatId}`);
      }
    }
  };

  return (
    <div className="mx-2">
      <form>
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={searchResults}
          style={{
            width: '100%', 
            minWidth: '400px',
            margin: 'auto',
          }}
          onChange={handleOptionSelect}
          renderOption={(props, option) => (
            <Box
              component="li"
              {...props}
              sx={{ display: 'flex', alignItems: 'center', fontSize: '18px' }}
            >
              <Box sx={{ marginRight: 1 }}>
                {option.type === 'user' ? <FaUser /> : <FaUserFriends />}
              </Box>
              {option.name}
            </Box>
          )}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <TextField
              type="search"
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
