import { useEffect, useState, useContext, useRef } from 'react';
import {
  getChannelWithLiveUpdates,
  addChatMessage,
  editChatMessage,
  deleteChatMessage,
  getChannelMessagesById,
} from '../../services/channel.service';
import { AppContext } from '../../context/AppContext';
import { off } from 'firebase/database';
import './ChannelChat.css';
import toast from 'react-hot-toast';
import { sendFile } from '../../services/chats.service';
import FileUpload from '../FileUpload/FileUpload';
import EmojiPicker from '../EmojiPicker/EmojiPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import SimpleProfilePreview from "../SimpleProfilePreview/SimpleProfilePreview";

export default function ChannelChat({ channelId, teamId }) {
  const { userData } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [editMessageId, setEditMessageId] = useState(null);
  const [editMessageContent, setEditMessageContent] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const inputRef = useRef(null);
  const lastMessageRef = useRef(null);

  const clearFileInput = () => {
    document.getElementById('chat-file-upload').value = null;
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const messagesRef = getChannelWithLiveUpdates(channelId, (newMessages) => {
      setMessages(newMessages);
    });
  
    // Cleanup function
    return () => {
      off(messagesRef);
    };
  }, [channelId]);

  const handleSend = async () => {
    if (newMessage.trim() !== '' || file) {
      try {
        
        const fileURL = file ? await sendFile(file) : null;
        
        await addChatMessage(channelId, newMessage, userData.username, fileURL);
        setNewMessage('');
        setFile(null); 
      } catch (error) {
        console.error('Failed to send message:', error);
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
    const messageToEdit = messages.find((message) => message.id === messageId);
    if (messageToEdit.sender !== userData.username) {
      return; // If the current user is not the sender of the message, do nothing
    }
    setEditMessageId(messageId);
    setEditMessageContent(messageToEdit.message);
  };

  const handleUpdate = async () => {
    if (editMessageContent.trim() !== '' || file) {
      const messageToEdit = messages.find(
        (message) => message.id === editMessageId
      );
      if (messageToEdit.sender !== userData.username) {
        return;
      }
      try {
        const fileURL = file ? await sendFile(file) : messageToEdit.fileURL;
        await editChatMessage(
          channelId,
          editMessageId,
          editMessageContent,
          fileURL
        );
        setMessages(
          messages.map((message) =>
            message.id === editMessageId
              ? { ...message, message: editMessageContent, fileURL }
              : message
          )
        );
        setEditMessageId(null);
        setEditMessageContent('');
        setFile(null);
      } catch (error) {
        console.log(error.message);
      }
    }
  };

  const handleDelete = async (messageId) => {
    const messageToDelete = messages.find(
      (message) => message.id === messageId
    );
    if (messageToDelete.sender !== userData.username) {
      return;
    }
    try {
      await deleteChatMessage(channelId, messageId);
      if (messageId === editMessageId) {
        setEditMessageId(null);
        setEditMessageContent('');
        setFile(null);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const name = e.target.files[0].name;

    const maxSize = 2 * 1024 * 1024; // size in MB
    if (selectedFile.size > maxSize) {
      toast.error(`File size exceeds the limit of 2 MB
      Please select a smaller file`);
      return;
    }

    console.log('File selected:', selectedFile); // Add this line
    setFile(selectedFile);
    setFileName(name);
  };

  const removeFile = () => {
    console.log('File removed'); // Add this line
    setFile(null);
    setFileName('');
    clearFileInput();
  };

  const makeLinkMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return message.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a key={index} href={part} target="_blank" rel="noopener noreferrer">
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleEmojiSelect = (emoji) => {
    const input = inputRef.current;
    if (!input) {
      return;
    }
    const { selectionStart, selectionEnd, value } = input;
    const newValue =
      value.substring(0, selectionStart) +
      emoji.emoji +
      value.substring(selectionEnd);

    if (editMessageId) {
      setEditMessageContent(newValue);
    } else {
      setNewMessage(newValue);
    }

    const newCursorPosition = selectionStart + emoji.emoji.length;
    input.selectionStart = newCursorPosition;
    input.selectionEnd = newCursorPosition;
    input.focus();
  };

  const handleShowEmojis = () => {
    setShowEmojis(!showEmojis);
  };


  return (
    <div className="chan-chat-container">
        <div className="messages-container">
        {messages &&
                messages.map((message, index) => (
                    <div key={message.id} ref={index === messages.length - 1 ? lastMessageRef : null} className={message.sender === userData.username ? "my-message" : "edit-chat-message"}>
                        <SimpleProfilePreview username={message.sender} date={new Date(message.sentOn).toLocaleString()} />
                        <p>
                            {makeLinkMessage(message.message)}
                        </p>
                        {message.fileURL && (
                            <img
                                src={message.fileURL}
                                alt="Message attachment"
                                className="uploaded-message-img"
                            />
                        )}
                        {message.sender === userData.username && (
                            <>
                                <button onClick={() => handleEditButtonClick(message.id)}>
                                    Edit
                                </button>
                                <button onClick={() => handleDelete(message.id)}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ))}
        </div>
        <form onSubmit={(e) => e.preventDefault()} encType="multipart/form-data">
            <div className="chat-input-field">
                <FileUpload
                    file={file}
                    fileName={fileName}
                    fileChange={handleFileChange}
                    removeFile={removeFile}
                />
                <textarea
                    ref={inputRef}
                    type="text"
                    name="message"
                    id="message"
                    value={editMessageId ? editMessageContent : newMessage}
                    onChange={
                        editMessageId
                            ? (e) => setEditMessageContent(e.target.value)
                            : (e) => setNewMessage(e.target.value)
                    }
                    className="chat-message-input"
                />
                <FontAwesomeIcon
                    className="emoji-button"
                    onClick={handleShowEmojis}
                    icon={faFaceSmile}
                />
                {showEmojis && (
                    <div className="channel-chat-emoji-picker">
                        <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                    </div>
                )}
            </div>
            <button
                type="submit"
                onClick={editMessageId ? handleUpdate : handleSend}
            >
                {editMessageId ? 'Update' : 'Send'}
            </button>
        </form>
    </div>
);
}
