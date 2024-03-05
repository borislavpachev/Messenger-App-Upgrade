import { useEffect, useState, useContext } from 'react';
import { getChannelWithLiveUpdates, addChatMessage } from '../../services/channel.service';
import { AppContext } from "../../context/AppContext";
import { off } from 'firebase/database'

export default function ChannelChat ({ channelId }) {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const messagesRef = getChannelWithLiveUpdates( channelId, setMessages);
  
    return () => off(messagesRef);
  }, [ channelId]);

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
    <div>
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