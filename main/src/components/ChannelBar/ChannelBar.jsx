import 'bootstrap/dist/css/bootstrap.min.css';
import './ChannelBar.css'
import CreateChannel from '../../views/CreateChannel/CreateChannel';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getChannelsByTeamId } from '../../services/channel.service';
import { useParams } from 'react-router-dom';

export default function ChannelBar({ onChannelSelect }) { 
    const { teamId } = useParams();   
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

      const fetchChannels = () => {
        getChannelsByTeamId(teamId)
          .then(fetchedChannels => {
            setChannels(fetchedChannels);
          })
          .catch(error => {
            console.error(error);
          });
      }

      useEffect(() => {
        fetchChannels();
      }, [teamId]);

      const handleClick = (channelId) => {
        onChannelSelect(channelId);
      };


    return (
        <div>
            <div className="d-stack gap-3">
            {channels.map(channel => (
          <div key={channel.id} onClick={() => handleClick(channel.id)}>
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
                    <CreateChannel teamId ={teamId} handleClose={handleClose} onChannelCreated={fetchChannels} />
                </Modal.Body>
            </Modal>
        </div>
    )
}