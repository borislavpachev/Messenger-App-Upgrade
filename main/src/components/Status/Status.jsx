import { useContext, useState } from "react";
import { AppContext } from "../../context/AppContext";
import Dropdown from 'react-bootstrap/Dropdown';
import { changeUserStatus } from "../../services/users.service";
import { BsFillDashCircleFill, BsFillRecordCircleFill,BsCheckCircle  } from "react-icons/bs";

export default function Status() {
    const {userData} = useContext(AppContext);

    const usernameUser = userData.username;
    const [status, setStatus] = useState(userData.status || 'Offline'); // Initialize status with user's current status

    const changeStatus = async (newStatus) => {
        await changeUserStatus(usernameUser, newStatus);
        setStatus(newStatus); // Update status state
    }

    const statusIcon = () => {
        switch (status) {
            case 'Online':
                return <BsCheckCircle color='green' size='1rem' />;
            case 'Offline':
                return <BsFillRecordCircleFill color='grey' size='1rem' />;
            case 'Do not disturb':
                return <BsFillDashCircleFill color='red' size='1rem' />;
            default:
                return null;
        }
    }

    return (
        <Dropdown className="mt-3">
            <Dropdown.Toggle variant="secondary" id="status-dropdown">
                {statusIcon()} Status {/* Display status icon */}
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item href="#" onClick={() => changeStatus('Online')}><BsCheckCircle color='green' size='1rem'/>Online</Dropdown.Item>
                <Dropdown.Item href="#" onClick={() => changeStatus('Offline')}><BsFillRecordCircleFill color='grey' size='1rem'/>Offline</Dropdown.Item>
                <Dropdown.Item href="#" onClick={() => changeStatus('Do not disturb')}><BsFillDashCircleFill color='red' size='1rem'/>Do not disturb</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    );
}