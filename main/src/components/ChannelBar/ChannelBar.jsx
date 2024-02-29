import 'bootstrap/dist/css/bootstrap.min.css';
import './ChannelBar.css'
import CreateChannel from '../../views/CreateChannel/CreateChannel';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getChannelNames } from "../../services/channel.service";


export default function ChannelBar(teamId){
    const [show, setShow] = useState(false);
    const [channelNames, setChannelNames] = useState([]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);    

    
    useEffect(() => {
        const fetchChannelNames = async () => {
            const channelNames = await getChannelNames(teamId);
            setChannelNames(channelNames);
        };

        fetchChannelNames();
    }, [teamId]);

    return (
        <div>
            <div className="d-stack gap-3">
               {channelNames.map((channelName, index) => (
                    <div key={index}>{channelName}</div>
                ))}
                <Button variant="primary" onClick={handleShow}>
                    Create Channel
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new channel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateChannel handleClose={handleClose} />
                </Modal.Body>
            </Modal>
        </div>
    )
}