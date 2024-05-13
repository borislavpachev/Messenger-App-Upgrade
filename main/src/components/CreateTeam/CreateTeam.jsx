import toast from 'react-hot-toast';
import Button from '../../components/Button/Button';
import { AppContext } from '../../context/AppContext';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  checkTeamNameExists,
  createNewTeam,
} from '../../services/teams.service';
import { createChannel } from '../../services/channel.service';
import { getAllUsers } from '../../services/users.service';

export default function CreateTeam({ toggleShowCreateTeam }) {
  const navigate = useNavigate();
  const { userData } = useContext(AppContext);

  const [form, setForm] = useState({
    teamName: '',
    teamOwner: '',
    teamMembers: [],
    teamChannels: [],
  });

  useEffect(() => {
    if (userData) {
      setForm((prevForm) => ({
        ...prevForm,
        teamOwner: userData.username,
        teamMembers: [userData.username],
      }));
    }
  }, [userData]);

  const teamNameHandler = (event) => {
    setForm((prevForm) => ({ ...prevForm, teamName: event.target.value }));
  };

  const createTeam = async () => {
    if (form.teamName.length < 3 || form.teamName.length > 40) {
      toast.error('Name must be between 3 and 40 symbols.');
      return;
    }

    const teamNameExists = await checkTeamNameExists(form.teamName);

    if (teamNameExists) {
      toast.error(`The team name ${form.teamName} already exists.`);
      return;
    }

    try {
      const newTeamRef = await createNewTeam(
        form.teamName,
        form.teamOwner,
        form.teamMembers,
        form.teamChannels
      );
      const teamId = newTeamRef.key;
      const initialChat = {
        text: `Welcome to the General channel!`,
        sender: form.teamOwner,
        timeStamp: Date.now(),
      };
      await createChannel(
        teamId,
        form.teamOwner,
        'General',
        initialChat,
        form.teamMembers,
        false
      );
      toast.success(`Team ${form.teamName} created successfully.`);
      toggleShowCreateTeam();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleAddUser = (username) => {
    if (username && username.trim() !== '') {
      setForm((prevForm) => ({
        ...prevForm,
        teamMembers: [...prevForm.teamMembers, username],
      }));
      toast.success(`User ${username} added to team`);
    }
  };

  const [searchInput, setSearchInput] = useState('');

  const [searchResults, setSearchResults] = useState([]);

  const [searchPerformed, setSearchPerformed] = useState(false);

  const updateFormSearch = (e) => {
    setSearchInput(e.target.value);
  };

  const searchUsers = async () => {
    const allUsers = await getAllUsers();
    const filteredUsers = allUsers.filter((user) =>
      user.username.startsWith(searchInput)
    );
    return filteredUsers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const results = await searchUsers();
    setSearchResults(results);
    setSearchPerformed(true);
  };

  useEffect(() => {
    if (searchInput === '') {
      setSearchPerformed(false);
    }
  }, [searchInput]);

  return (
    <>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="d-flex align-items-center justify-content-center mt-2">
            <span className="text-black me-1">Add team members:</span>
            <input
              autoComplete="off"
              className="form-control w-50"
              type="search"
              placeholder="Search by username"
              value={searchInput}
              onChange={updateFormSearch}
            />
            <button className="btn btn-primary" onClick={handleSubmit}>
              Search
            </button>
          </div>
          <div className="border border-dark m-4">
            {searchResults.map((user, index) => (
              <div className="d-inline-flex m-3" key={index}>
                <div className="d-flex justify-content-center align-items-center">
                  <p className="fs-6 m-1">{user.username}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddUser(user.username)}
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>
        <div>
          <form className="w-100">
            <input
              placeholder="Your Team Name"
              className="form-control"
              onChange={teamNameHandler}
              type="text"
            />
            <button
              className="btn btn-primary m-2 w-100 p-2"
              onClick={(event) => {
                event.preventDefault();
                createTeam();
              }}
            >
              Create Team
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
