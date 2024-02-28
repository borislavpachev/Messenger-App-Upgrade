import toast from 'react-hot-toast';
import Button from '../../components/Button/Button';
import { AppContext } from '../../context/AppContext';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTeamNameExists, createNewTeam, createChannel } from '../../services/teams.service';

export default function CreateTeam() {
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
            setForm(prevForm => ({
                ...prevForm,
                teamOwner: userData.username,
                teamMembers: [userData.username],
            }));
        }
    }, [userData]);

    const teamNameHandler = (event) => {
        setForm(prevForm => ({ ...prevForm, teamName: event.target.value }));
    };

    const createTeam = async () => {
        if (
          form.teamName.length < 3 ||
          form.teamName.length > 40
        ) {
          toast.error('Name must be between 3 and 40 symbols.');
          return;
        }
    
        const teamNameExists = await checkTeamNameExists(form.teamName);
    
        if (teamNameExists) {
          toast.error(`The team name ${form.teamName} already exists.`);
          return;
        }
    
        try {
            const newTeamRef = await createNewTeam(form.teamName, form.teamOwner, form.teamMembers, form.teamChannels);
            const teamId = newTeamRef.key;
            await createChannel(teamId, 'general', form.teamOwner, form.teamMembers);
          navigate('/');
        } catch (error) {
          toast.error(error.message);
        }
      };

      return (
        <>
          <div className="Create-Team">
            <h3 className="Create-Team-Head">Make you own Team</h3>
            <div className="Team-Name">
              <form>
                <div className="Team-Name-Input">
                  <input onChange={teamNameHandler} type="text"/>
                </div>
                <Button title="Create" onClick={(event) => { event.preventDefault(); createTeam(); }}>Create Team</Button>              
                </form>
            </div>
          </div>
        </>
      );
}