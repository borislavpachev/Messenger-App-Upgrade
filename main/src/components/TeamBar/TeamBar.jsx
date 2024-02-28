import { NavLink } from "react-router-dom";

export default function TeamBar(){
    return (
        <div className="col-1 h-100 bg-dark text-white">
        <div className="d-stack gap-3">
          <div>Private</div>
          <NavLink to="/create-team">Create Team</NavLink>
          <div>Team 1</div>
        </div>
      </div>
    );    
}