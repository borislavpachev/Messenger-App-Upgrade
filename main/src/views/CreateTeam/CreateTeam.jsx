import toast from 'react-hot-toast';
import Button from '../../components/Button/Button';
import { AppContext } from '../../context/AppContext';
import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkTeamNameExists, createNewTeam} from '../../services/teams.service';
import { createChannel } from '../../services/channel.service';

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
            const initialChat = {
              text: `Welcome to the General channel!`,
              sender: form.teamOwner,
              timeStamp: Date.now(),
          };
          await createChannel(teamId, form.teamOwner, 'General', initialChat, form.teamMembers);
            toast.success(`Team ${form.teamName} created successfully.`);
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