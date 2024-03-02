import { db } from '../config/firebase-config';
import { ref, get, set, push } from 'firebase/database';


export const checkTeamNameExists = async (teamName) => {
  const teams = await getAllTeams();

  return teams.some((team) => team.teamName === teamName);
}

export const getTeamById = async (id) => {
    const snapshot = await get(ref(db, `teams/${id}`));
    if (!snapshot.exists()) {
      return null;
    }
  
    const team = {
      id,
      ...snapshot.val(),     
    };
  
    return team;
  };


  export const getTeamMembers = async (id) => {
    const snapshot = await get(ref(db, `teams/${id}/members`));
    if (!snapshot.exists()) {
      return null;
    }
  
    const members = snapshot.val();
  
    return members;
};

export const getAllTeams = async () => {
    const teams = get(ref(db, `teams`));
    const snapshot = await teams;

    try{
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        } else {
            return [];
        }
    } catch (error) {
        console.error(error);
    }
}

export const createNewTeam = async (teamName, teamOwner, teamMembers, teamChannels) => {
    const newTeamRef = push(ref(db, 'teams'));
    //const teamId = newTeamRef.key;

    await set(newTeamRef, { teamId: newTeamRef, teamName, teamOwner, teamMembers, teamChannels });

    return newTeamRef;
};

export const addUserToTeam = async (team, username) => {
    return set(ref(db, `teams/${team.teamId}/teamMembers`), [...team.teamMembers, username]);
};

export const removeUserFromTeam = async (team, username) => {
    return set(ref(db, `teams/${team.teamId}/teamMembers`), team.teamMembers.filter(member => member !== username));
};

export const getAllTeamMembers = async (team) => {
    return get(ref(db, `teams/${team.key}/teamMembers`));
};
