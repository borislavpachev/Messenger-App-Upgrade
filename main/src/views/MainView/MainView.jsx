import { AppContext } from "../../context/AppContext";
import { useContext, useState } from "react";
import { logoutUser } from "../../services/auth.service";
import { NavLink, useNavigate } from 'react-router-dom';
import TeamBar from "../../components/TeamBar/TeamBar";
import ChannelBar from "../../components/ChannelBar/ChannelBar";
import Header from "../../components/Header/Header";
import ContentBox from "../../components/ContentBox/ContentBox";
import MainBar from "../../components/MainBar/MainBar";

export default function MainView() {
  const [selectedTeam, setSelectedTeam] = useState(null);

  return (
    <div className="container-fluid h-100 m-2 p-0">
      <div className="row h-100">          
        <TeamBar onItemClick={setSelectedTeam} />
        <MainBar>
          {selectedTeam ? <ChannelBar teamId={selectedTeam.teamId} /> : null}
        </MainBar>    
        <div className="col-9 d-flex flex-column">
          <Header />
          <ContentBox className="flex-grow-1 bg-dark" />            
        </div>          
      </div>
    </div>
  );
}
