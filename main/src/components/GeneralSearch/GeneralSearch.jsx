import { useState, useEffect } from "react";
import { getAllUsersUsernames } from "../../services/users.service";
import { getAllTeamsNames } from "../../services/teams.service";
import { Autocomplete, TextField } from '@mui/material'

export default function UserSearch({ teamId }) {
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchPerformed, setSearchPerformed] = useState(false);

    // const updateFormSearch = e => {
    //     setSearchInput(e.target.value);
    // }

    useEffect(() => {
        if (searchInput === '') {
            setSearchPerformed(false);
        }
    }, [searchInput]);

    const searchUsers = async () => {
        const allUsers = await getAllUsersUsernames(); 
        const allTeams = await getAllTeamsNames();
        const allTeamsandUsers = [...allTeams, ...allUsers]
    
        return allTeamsandUsers;
    };

    useEffect(() => {
        searchUsers().then(allTeamsandUsers => {
            setSearchResults(allTeamsandUsers);
        });
    }, []);

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     await searchUsers();
    // }

    // const handleOptionSelect = (event, value) => {
    //     setSelectedOption(value);
    //     window.location.href = `/main/chats/${value}`;
    // }

    return (
        <div className='user-search'>
            <form className="user-search-form">
                <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={searchResults}
                    sx={{ width: 300 }}
                    //onInputChange={updateFormSearch}
                    renderInput={(params) => <TextField {...params} label="Search" />}
                />
            </form>
        </div>
    );
}