import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Dropdown from 'react-bootstrap/Dropdown';
import { changeUserStatus } from "../../services/users.service";
import { BsFillDashCircleFill, BsFillRecordCircleFill,BsCheckCircle  } from "react-icons/bs";

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
      <Dropdown.Item href="#" onClick={() => changeStatus('Online')}><BsCheckCircle  color='green' size='1rem'/>Online</Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => changeStatus('Offline')}><BsFillRecordCircleFill color='grey' size='1rem'/>Offline</Dropdown.Item>
        <Dropdown.Item href="#" onClick={() => changeStatus('Do not disturb')}><BsFillDashCircleFill color='red' size='1rem'/>Do not disturb</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}