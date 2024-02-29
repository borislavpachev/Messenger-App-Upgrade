import { useContext, useState, useEffect } from "react";
import { createChannel } from "../../services/channel.service";
import { AppContext } from "../../context/AppContext";
import { getTeamMembers } from '../../services/teams.service';
import PropTypes from 'prop-types';

export default function CreateChannel( {teamId} ) {
    const { userData } = useContext(AppContext)
    const [title, setTitle] = useState('');
    const [members, setMembers] = useState([]);
    const [chat, setChat] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {      
        const fetchTeamMembers = async () => {
            const members = await getTeamMembers(teamId);
            setTeamMembers(members);
        };

        fetchTeamMembers();
    }, [teamId]);

    const handleSubmitChannel = async (event) => {
        event.preventDefault();

        try {
            await createChannel (teamId, userData.id, title, chat, members);
            setTitle('');
            setMembers([]);
            setChat({})
            // handleClose();
        } catch (error){
            console.error('Failed to create channel:', error)
        }
    }

    return (
<form onSubmit={handleSubmitChannel}>
    <label>
        Title:
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
    </label>    
    <select multiple value={members} onChange={e => setMembers(Array.from(e.target.selectedOptions, option => option.value))}>
        {teamMembers.map(member => (
            <option key={member.id} value={member.id}>{member.name}</option>
        ))}
    </select>
    <button type="submit">Create Channel</button>
</form>
    );
}

CreateChannel.propTypes = {
    teamId: PropTypes.string,
    owner: PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,     
    })
  };