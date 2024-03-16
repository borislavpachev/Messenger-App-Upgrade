import 'bootstrap/dist/css/bootstrap.min.css';
import { get, ref} from 'firebase/database';
import { useContext, useState } from 'react';
import TeamMemberList from '../TeamMembersList/TeamMembersList';
import GeneralSearch from '../GeneralSearch/GeneralSearch';
import './Header.css';
import { AppContext } from '../../context/AppContext';
import { leaveChannel, getGeneralChannelId } from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import toast from "react-hot-toast";
import { db } from '../../config/firebase-config';
import { RxPerson } from "react-icons/rx";
import Status from '../Status/Status';



export default function Header({ channelId, toggle }){
    const { teamId } = useParams()
    const { userData } = useContext(AppContext)
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

    const handleTeamClick = (teamId) => {
      onItemClick(teamId);
    };

    const toggleShow = () => {
      setShow(!show);
  }

  const handleLeaveChannel = async () => {
    try {
      const generalChannelId = await getGeneralChannelId(teamId);
      if (channelId === generalChannelId) {
        toast.error("You cannot leave the general channel");
        return;
      }

      const channelSnapshot = await get(ref(db, `channels/${channelId}`));
      const channelData = channelSnapshot.val();
  
      // Check if the current user is the owner of the channel
      if (userData.username === channelData.owner) {
        toast.error("The owner cannot leave the channel");
        return;
      }

      const success = await leaveChannel(channelId, userData.username);
      
      if (success) {
        toast.success("Successfully left the channel");
       
        navigate(`/main`);
      } else {
        toast.error("Failed to leave the channel");
      }
    } catch (error) {
      console.error("Error leaving channel:", error);
      toast.error("An error occurred while trying to leave the channel");
    }
  }

  return (
    <header className="channel-header">Header
                {/* {channelId && (
          <button className='leave-chan-but' onClick={handleLeaveChannel}>Leave Channel</button>
        )} */}
      <div className='general-search-bar'>
        <GeneralSearch onItemClick={handleTeamClick} />
      </div>

      <Status>Status</Status>

      <RxPerson className='sidebar-svg' onClick={toggle} />

    </header>
  )
}
