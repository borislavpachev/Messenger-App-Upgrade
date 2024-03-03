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
              <button onClick={handleOpenTeamMemberList}>Open Team Member List</button>
       {showTeamMemberList && <TeamMemberList teamId={teamId} onClose={handleCloseTeamMemberList} />}
        </header>
    )
}