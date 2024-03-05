import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import TeamMemberList from '../TeamMembersList/TeamMembersList';

export default function Header( { teamId }){
    const [showTeamMemberList, setShowTeamMemberList] = useState(false);

    const handleOpenTeamMemberList = () => {
      setShowTeamMemberList(true);
    };

    const handleCloseTeamMemberList = () => {
      setShowTeamMemberList(false);
    };
    return (
        <header className="d-flex justify-content-between bg-dark text-white p-3">Header
        <div className='dropdown'>
        <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" >Team Members List</button>
       <TeamMemberList teamId={teamId} />
       </div>
        </header>
    )
}