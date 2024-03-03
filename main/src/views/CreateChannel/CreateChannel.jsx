import { useContext, useState, useEffect } from "react";
import { createChannel } from "../../services/channel.service";
import { AppContext } from "../../context/AppContext";
import {  getTeamMembersByTeamId } from '../../services/teams.service';
import PropTypes from 'prop-types';
import ReactSelect, { components } from 'react-select';

export default function CreateChannel( {teamId, handleClose, onChannelCreated} ) {
    const { userData } = useContext(AppContext)
    const [title, setTitle] = useState('');
    const [members, setMembers] = useState([]);
    const [chat, setChat] = useState({});
    const [teamMembers, setTeamMembers] = useState([]);

    useEffect(() => {
        getTeamMembersByTeamId(teamId)
            .then(members => {
                setTeamMembers(members);
            })
            .catch(error => {
                console.error("Error fetching team members: ", error);
            });
    }, [teamId]);

    const handleSubmitChannel = async (event) => {
        event.preventDefault();
        console.log(members)

        try {
            await createChannel (teamId, userData.uid, title, chat, members);
            setTitle('');
            setMembers([]);
            setChat({})
            onChannelCreated();
            handleClose();
        } catch (error){
            console.error('Failed to create channel:', error)
        }
    }

    const options = teamMembers.map(memberName => ({ value: memberName, label: memberName }));

    const Option = props => {
        return (
          <div>
            <components.Option {...props}>
              {props.isSelected ? '✔' : ''} {props.label}
            </components.Option>
          </div>
        );
      };

    return (
<form onSubmit={handleSubmitChannel} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <label>
        Title:
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
    </label>    
    <ReactSelect
  isMulti
  options={options}
  value={members.map(memberName => ({ value: memberName, label: memberName }))}
  onChange={selectedOptions => setMembers(selectedOptions ? selectedOptions.map(option => option.value) : [])}
  components={{ Option }}
/>
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