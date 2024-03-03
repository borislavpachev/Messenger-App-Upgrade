import 'bootstrap/dist/css/bootstrap.min.css';
import './ChannelBar.css'
import CreateChannel from '../../views/CreateChannel/CreateChannel';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getChannelsByTeamId } from '../../services/channel.service';

export default function ChannelBar({ teamId }) {    
    const [channels, setChannels] = useState([]);
    const [show, setShow] = useState(false); 

    const handleShow = () => setShow(true); 
    const handleClose = () => setShow(false); 
  
    useEffect(() => {
        getChannelsByTeamId(teamId)
          .then(fetchedChannels => {
            setChannels(fetchedChannels);
          })
          .catch(error => {
            console.error(error);
          });
      }, [teamId]);

    return (
        <div>
            <div className="d-stack gap-3">
            {channels.map(channel => (
          <div key={channel.id}>
            {channel.title}
          </div>
        ))}     <Button variant="primary" onClick={handleShow}>
                    Create Channel
                </Button>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create a new channel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CreateChannel teamId ={teamId} handleClose={handleClose} />
                </Modal.Body>
            </Modal>
        </div>
    )
}