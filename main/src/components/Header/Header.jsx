import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import TeamMemberList from '../TeamMembersList/TeamMembersList';
import GeneralSearch from '../GeneralSearch/GeneralSearch';
import './Header.css';


export default function Header( { teamId }){
    // const [showTeamMemberList, setShowTeamMemberList] = useState(false);

    // const handleOpenTeamMemberList = () => {
    //   setShowTeamMemberList(true);
    // };

    // const handleCloseTeamMemberList = () => {
    //   setShowTeamMemberList(false);
    // };

    const [show, setShow] = useState(false);

    const toggleShow = () => {
      setShow(!show);
  }

  return (
    <header className="d-flex justify-content-between bg-dark text-white p-3">Header

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