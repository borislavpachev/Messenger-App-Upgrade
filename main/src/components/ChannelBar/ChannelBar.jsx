import 'bootstrap/dist/css/bootstrap.min.css';
import './ChannelBar.css'
import CreateChannel from '../../views/CreateChannel/CreateChannel';
import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect, useContext } from 'react';
import { getChannelsByTeamId } from '../../services/channel.service';
import { useParams, useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';

export default function ChannelBar({ onChannelSelect }) {
    const { userData } = useContext( AppContext)
    const { teamId, channelId } = useParams();   
    const [channels, setChannels] = useState([]);
    const [show, setShow] = useState(false); 
    const username = userData.username;
    const [currentChannelId, setCurrentChannelId] = useState(null);
    


    const handleShow = () => setShow(true); 
    const handleClose = () => setShow(false); 
  

      const fetchChannels = () => {
        getChannelsByTeamId(teamId, username)
          .then(fetchedChannels => {
            setChannels(fetchedChannels);
          })
          .catch(error => {
            console.error(error);
          });
    }

    useEffect(() => {
      fetchChannels();
      setCurrentChannelId(channelId);
    }, [teamId, username, channelId]);


    const navigate = useNavigate();

    const handleClick = (channelId) => {
      setCurrentChannelId(channelId);
      navigate(`/main/${teamId}/channels/${channelId}`);
    };
      
      return (
        <div className='channel-bar'>
            <div className="d-stack gap-3">
                {channels.map(channel => (
                    <div key={channel.id} onClick={() => handleClick(channel.id)} className="channels-single-preview">
                        <div className="single-preview-content">
                            <span className="user-channels">{channel.title}</span>
                        </div>
                    </div>
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
                    <CreateChannel teamId ={teamId} handleClose={handleClose} onChannelCreated={fetchChannels} />
                </Modal.Body>
            </Modal>
        </div>
    )
}