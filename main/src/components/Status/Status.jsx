import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Dropdown from 'react-bootstrap/Dropdown';
import { changeUserStatus } from "../../services/users.service";

export default function Status() {
    const {userData} = useContext(AppContext);

    const usernameUser = userData.username;


    const changeStatus = async ( status) => {
        await changeUserStatus(usernameUser, status);
    }


  return (
    <Dropdown className="mt-3">
      <Dropdown.Toggle variant="secondary" id="status-dropdown">
        Status
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item href="#" onClick={() => changeStatus('Online')}>Online</Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => changeStatus('Offline')}>Offline</Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => changeStatus('Do not disturb')}>Do not disturb</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}