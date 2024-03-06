import { useEffect, useState, useContext } from 'react';
import { getChannelWithLiveUpdates, addChatMessage } from '../../services/channel.service';
import { AppContext } from "../../context/AppContext";
import { off } from 'firebase/database'
import './ChannelChat.css'

export default function ChannelChat ({ channelId, teamId  }) {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = getChannelWithLiveUpdates(channelId, setMessages);
  
    return () => off(messagesRef, 'value', setMessages);
  }, [channelId, teamId]);

  const handleSend = async () => {
    if (newMessage.trim() !== '') {
      try {
        await addChatMessage( channelId, newMessage, userData.username);
        setNewMessage('');
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  return (
    <div className='chan-chat-container'>
      {messages.map((message, index) => (
        <div key={index}>
          <p>{message.sender}: {message.message}</p>
        </div>
      ))}
      <form onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={newMessage}
          onChange={e => setNewMessage(e.target.value)}
        />
        <button type='submit' onClick={handleSend}>Send</button>
      </form>
    </div>
  );
}