import { useState, useEffect } from 'react';
import {
  addUserToTeam,
  getTeamById,
  getTeamMembersByTeamId,
  removeUserFromTeam,
  deleteTeam,
  getAllTeams,
} from '../../services/teams.service';
import toast from 'react-hot-toast';
import { getAllUsers, getUserStatus } from '../../services/users.service';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import { getTeamOwner } from '../../services/teams.service';
import {
  BsFillDashCircleFill,
  BsFillRecordCircleFill,
  BsCheckCircle,
} from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

export default function TeamMembersList({ teamId }) {
  const { userData } = useContext(AppContext);
  const [teamMembers, setTeamMembers] = useState([]);
  const [userRemoved, setUserRemoved] = useState(false);
  const [teamMembersStatus, setTeamMembersStatus] = useState([]);
  const [noTeam, setNoTeam] = useState([false]);
  const [searchInput, setSearchInput] = useState({
    username: '',
  });
  const [searchResults, setSearchResults] = useState([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    getTeamMembersByTeamId(teamId)
      .then((fetchedMembers) => {
        setTeamMembers(fetchedMembers);
      })
      .catch((error) => {
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
        console.error('Error fetching team member statuses', error);
      }
    };

    if (teamMembers.length > 0) {
      fetchMemberStatuses();
    }

    const intervalId = setInterval(fetchMemberStatuses, 1000);

    return () => clearInterval(intervalId);
  }, [teamMembers]);

  const handleAddUser = async (username) => {
    if (!teamMembers.some((member) => member === username)) {
      try {
        await addUserToTeam(teamId, username);
        setTeamMembers((prevMembers) => [...prevMembers, username]);
        const teamName = await getTeamById(teamId);
        toast.success(`User ${username} added to team ${teamName.teamName}`);
      } catch (error) {
        toast.error('Failed to add user to team');
        console.error('Failed to add user to team', error);
      }
    } else {
      toast.error('User is already team member.');
    }
  };

  const handleRemoveUser = async (username) => {
    try {
      await removeUserFromTeam(teamId, username);
      setTeamMembers((prevMembers) =>
        prevMembers.filter((member) => member !== username)
      );
      setUserRemoved(true);
    } catch (error) {
      toast.error('Failed to remove user from team');
      console.error('Failed to remove user from team', error);
    }
  };
  const [teamOwner, setTeamOwner] = useState('');

  useEffect(() => {
    getTeamOwner(teamId)
      .then((owner) => {
        setTeamOwner(owner);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [teamId]);

  const handleLeaveTeam = async () => {
    try {
      await removeUserFromTeam(teamId, userData.username);
      navigate(`/main`);
      setTeamMembers((prevMembers) =>
        prevMembers.filter((member) => member !== userData.username)
      );
      toast.success('You have left the team');
    } catch (error) {
      toast.error('Failed to leave the team');
      console.error('Failed to leave the team', error);
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await deleteTeam(teamId);
      navigate(`/main`);
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error('Failed to delete team');
      console.error('Failed to delete team', error);
    }
  };

  const allTeamMembers = (
    <div className="d-flex flex-column align-items-start">
      {teamMembersStatus.map((member) => (
        <div
          key={member.username}
          className="d-flex align-items-center justify-content-center"
        >
          {member.status === 'Online' ? (
            <BsCheckCircle color="green" size="1rem" />
          ) : member.status === 'Offline' ? (
            <BsFillRecordCircleFill color="grey" size="1rem" />
          ) : member.status === 'Do not disturb' ? (
            <BsFillDashCircleFill color="red" size="1rem" />
          ) : null}
          <p className="my-1 mx-2 fs-6">{member.username}</p>
          {member.username !== teamOwner && (
            <button
              className="btn btn-danger px-3 py-0"
              onClick={() => handleRemoveUser(member.username)}
            >
              -
            </button>
          )}
        </div>
      ))}
    </div>
  );

  const allTeamMembersNotAuthor = (
    <div className="container d-flex flex-column align-items-start">
      <div className="border-top border-light w-100"></div>
      {teamMembersStatus.map((member) => (
        <div
          key={member.username}
          className="d-flex align-items-center justify-content-center ms-2"
        >
          {member.status === 'Online' ? (
            <BsCheckCircle color="green" size="1rem" />
          ) : member.status === 'Offline' ? (
            <BsFillRecordCircleFill color="grey" size="1rem" />
          ) : member.status === 'Do not disturb' ? (
            <BsFillDashCircleFill color="red" size="1rem" />
          ) : null}
          <p className="my-1 mx-2 fs-4">{member.username}</p>
        </div>
      ))}
    </div>
  );

  const updateFormSearch = (prop) => (e) => {
    setSearchInput({ ...searchInput, [prop]: e.target.value });
  };

  const searchUsers = async () => {
    const allUsers = await getAllUsers();
    const filteredUsers = allUsers.filter((user) =>
      user.username.startsWith(searchInput.username)
    );
    return filteredUsers;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const results = await searchUsers();
    setSearchResults(results);
    setSearchPerformed(true);
    setUserRemoved(false);
  };

  useEffect(() => {
    if (searchInput.username === '' && !userRemoved) {
      setSearchPerformed(false);
    }
  }, [searchInput, userRemoved]);

  const checkUserTeams = async () => {
    try {
      const allTeams = await getAllTeams();
      const userTeams = allTeams.filter((team) =>
        team.teamMembers.includes(userData.username)
      );

      if (userTeams.length === 0) {
        setNoTeam(true);
      }
    } catch (error) {
      console.error('Failed to fetch teams', error);
    }
  };

  useEffect(() => {
    checkUserTeams();
  }, []);

  return (
    <div
      className="d-flex flex-column text-white text-center align-items-center
    justify-content-top h-100 border-start border-light"
    >
      {userData && userData.username === teamOwner ? (
        <form className="team-memberes-list-form" onSubmit={handleSubmit}>
          <label htmlFor="username-team-members-list" className="w-100 fs-4">
            Add user
          </label>
          <input
            autoComplete="off"
            className="form-control"
            type="search"
            id="username-team-members-list"
            placeholder="Search by username"
            value={searchInput.username}
            onChange={updateFormSearch('username')}
          />
          <button className="btn btn-primary w-100 mt-2" onClick={handleSubmit}>
            Search
          </button>
          <h3 className="m-3">
            {searchPerformed ? 'Search Results' : 'Team Members'}
          </h3>
          <div className="d-flex flex-column">
            {!searchPerformed
              ? allTeamMembers
              : searchResults.map((user, index) => (
                  <div
                    className="container d-flex align-items-center justify-content-start m-1"
                    key={index}
                  >
                    <div className="d-flex mx-2">{user.username}</div>
                    {!teamMembers.some((member) => member === user.username) ? (
                      <button
                        className="btn btn-primary px-3 py-0"
                        onClick={() => handleAddUser(user.username)}
                      >
                        +
                      </button>
                    ) : (
                      user.username !== teamOwner && (
                        <button
                          className="btn btn-danger px-3 py-0"
                          onClick={() => handleRemoveUser(user.username)}
                        >
                          -
                        </button>
                      )
                    )}
                  </div>
                ))}
          </div>
          {userData && userData.username === teamOwner && !searchPerformed && (
            <div className="d-flex flex-column align-items-center justify-content-center m-2">
              <div className="border border-light w-100"></div>
              <button
                className="btn btn-danger w-50 mt-5"
                onClick={handleDeleteTeam}
              >
                Delete Team
              </button>
            </div>
          )}
        </form>
      ) : (
        <div className="not-author-list">
          <h2 className="team-members-not-author-header">Team Members</h2>
          {allTeamMembersNotAuthor}
        </div>
      )}
      {userData && userData.username !== teamOwner && !noTeam && (
        <button className="btn btn-danger" onClick={handleLeaveTeam}>
          Leave Team
        </button>
      )}
    </div>
  );
}

TeamMembersList.propTypes = {
  teamId: PropTypes.string,
};
