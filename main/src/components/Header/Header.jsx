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



export default function Header({ channelId }){
    // const [showTeamMemberList, setShowTeamMemberList] = useState(false);

    // const handleOpenTeamMemberList = () => {
    //   setShowTeamMemberList(true);
    // };

    // const handleCloseTeamMemberList = () => {
    //   setShowTeamMemberList(false);
    // };
    const { teamId } = useParams()
    const { userData } = useContext(AppContext)
    const [show, setShow] = useState(false);
    const navigate = useNavigate();

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
    <header className="d-flex justify-content-between bg-dark text-white p-3">Header
                {channelId && (
          <button onClick={handleLeaveChannel}>Leave Channel</button>
        )}
      <div className='general-search-bar'>
        <GeneralSearch teamId={teamId} />
      </div>

      <button className="btn-modal" type="button" onClick={toggleShow} >Team Members List</button>

      {show && <div className='team-members-modal'>
        <div
        onClick={toggleShow} 
        className='overlay-team-members'></div>
        <div className='modal-team-members-content'>
          <TeamMemberList teamId={teamId} />
          <button className='close-modal-members-btn' onClick={toggleShow}>Close</button>
        </div>
      </div>}

    </header>
  )
}