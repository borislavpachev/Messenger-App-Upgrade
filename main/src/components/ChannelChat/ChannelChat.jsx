import { useEffect, useState, useContext } from 'react';
import { getChannelWithLiveUpdates, addChatMessage, editChatMessage, deleteChatMessage, getChannelMessagesById } from '../../services/channel.service';
import { AppContext } from "../../context/AppContext";
import { off } from 'firebase/database'
import './ChannelChat.css'


export default function ChannelChat ({ channelId, teamId  }) {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');

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

  useEffect(() => {
    const fetchMessages = async () => {
      const messages = await getChannelMessagesById(channelId);
      setMessages(messages);
    };
  
    fetchMessages();
  }, [channelId]);

  const handleEditButtonClick = (messageId) => {
    const messageToEdit = messages.find(message => message.id === messageId);
    setEditMessageId(messageId);
    setEditMessageContent(messageToEdit.message);
  };

  const handleUpdate = async () => {
    if (editMessageContent.trim() !== '') {
      try {
        await editChatMessage(channelId, editMessageId, editMessageContent);
        setMessages(messages.map(message => 
          message.id === editMessageId 
            ? { ...message, message: editMessageContent } 
            : message
        ));
        setEditMessageId(null);
        setEditMessageContent('');
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleDelete = async (messageId) => {
    try {
      await deleteChatMessage(channelId, messageId);
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='chan-chat-container'>
      {messages && messages.map((message) => (
        <div key={message.id}>
          <p>{message.sender}: {message.message}</p>
          <button onClick={() => {             
            setEditMessageId(message.id); 
            setEditMessageContent(message.message); 
          }}>Edit</button>
          <button onClick={() => handleDelete(message.id)}>Delete</button>
        </div>
      ))}
      <form onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          value={editMessageId ? editMessageContent : newMessage}
          onChange={e => editMessageId ? setEditMessageContent(e.target.value) : setNewMessage(e.target.value)}
        />
        <button type='submit' onClick={editMessageId ? handleUpdate : handleSend}>
          {editMessageId ? 'Update' : 'Send'}
        </button>
      </form>
    </div>
  );
}