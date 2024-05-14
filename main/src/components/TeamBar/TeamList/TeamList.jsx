import { useContext } from 'react';
import { useEffect, useState } from 'react';
import TeamBarItem from '../TeamBarItem/TeamBarItem';
import { getChannelsByTeamId } from '../../../services/channel.service';
import './TeamList.css';
import { AppContext } from '../../../context/AppContext';
import { getAllTeams } from '../../../services/teams.service';
import { useIsSeen } from '../../../context/IsSeenProvider';
import PropTypes from 'prop-types';

export default function TeamList({ onItemClick }) {
  const { userData } = useContext(AppContext);
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const isSeen = useIsSeen();

  const handleTeamClick = (team) => {
    setSelectedTeam(team);
    onItemClick(team);
  };

  useEffect(() => {
    const fetchTeams = async () => {
      if (!userData) {
        setLoading(true);
        return;
      }
      const allTeams = await getAllTeams();
      const userUsername = userData.username;
      const userTeams = allTeams.filter(
        (team) =>
          Array.isArray(team.teamMembers) &&
          team.teamMembers.includes(userUsername)
      );

      for (let team of userTeams) {
        team.channels = await getChannelsByTeamId(team.teamId); // Fetch the channels for each team
      }

      setTeams(userTeams);
      setLoading(false);
    };

    fetchTeams();

    const intervalId = setInterval(fetchTeams, 1000);

    return () => clearInterval(intervalId);
  }, [userData]);

  return (
    <div
      className="row align-items-center justify-content-center 
    align-self-center custom-scroll"
    >
      {teams.map((team, index) => (
        <TeamBarItem key={index} onClick={() => handleTeamClick(team)}>
          <p title={`${team.teamName}`}>{team.teamName.substring(0, 4)}</p>
          {team.channels.some((channel) => isSeen[channel.id] === false) && (
            <span className="not-seen-class"></span>
          )}
        </TeamBarItem>
      ))}
    </div>
  );
}

TeamList.propTypes = {
  onItemClick: PropTypes.func,
}