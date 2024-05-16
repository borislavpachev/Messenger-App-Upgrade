import { useContext, useRef, useState, useEffect } from 'react';
import { AppContext } from '../../../context/AppContext';
import PropTypes from 'prop-types';
import {
  sendFile,
  sendMessage,
  setLastModified,
} from '../../../services/chats.service';
import EmojiPicker from '../../EmojiPicker/EmojiPicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFaceSmile } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import FileUpload from '../../FileUpload/FileUpload';
import Button from '../../Button/Button';
import './ChatInput.css';

export default function ChatInput({ chatId }) {
  const { userData } = useContext(AppContext);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    setMessage('');
  }, [chatId]);

  const clearFileInput = () => {
    document.getElementById('chat-file-upload').value = null;
  };

  const sendUserMessage = async () => {
    const sender = userData.username;
    try {
      if (message.trim() === '' && !file) {
        return;
      }
      const fileURL = await sendFile(file);
      await sendMessage(chatId, sender, message, fileURL);
      await setLastModified(sender, chatId, message);

      setShowEmojis(false);
      setMessage('');
      setFile(null);
      setFileName('');
      clearFileInput();
    } catch (error) {
      console.error(error.code);
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const name = e.target.files[0].name;

    const maxSize = 5 * 1024 * 1024; // size in MB
    if (selectedFile.size > maxSize) {
      toast.error(`File size exceeds the limit of 5 MB
            Please select a smaller file`);
      return;
    }

    setFile(selectedFile);
    setFileName(name);
  };

  const removeFile = () => {
    setFile(null);
    setFileName('');
    clearFileInput();
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

    setMessage(newValue);

    const newCursorPosition = selectionStart + emoji.emoji.length;
    input.selectionStart = newCursorPosition;
    input.selectionEnd = newCursorPosition;
  };

  const handleShowEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      sendUserMessage();
    }
  };

  return (
    <div className="position-relative mt-4">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="d-flex bg-white rounded align-items-center">
          <FileUpload
            file={file}
            fileName={fileName}
            fileChange={handleFileChange}
            removeFile={removeFile}
          />
          <textarea
            type="text"
            name="message"
            id="message"
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="chat-message-input"
            ref={inputRef}
          />
          <FontAwesomeIcon
            className="emoji-button"
            onClick={handleShowEmojis}
            icon={faFaceSmile}
          />
          {showEmojis && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
          <Button
            type="submit"
            onClick={sendUserMessage}
            className="btn btn-primary m-2 px-2 py-2"
          >
            Send
          </Button>
        </div>
      </form>
    </div>
  );
}

ChatInput.propTypes = {
  chatId: PropTypes.string,
};
