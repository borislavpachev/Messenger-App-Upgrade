import { useContext, useRef, useState } from "react";
import PropTypes from 'prop-types';
import { AppContext } from "../../../context/AppContext";
import { sendFile, sendMessage, setLastModified } from "../../../services/chats.service";
import EmojiPicker from "../../EmojiPicker/EmojiPicker";
import toast from "react-hot-toast";
import './ChatInput.css'

export default function ChatInput({ chatId, onChatEvent }) {
    const { userData } = useContext(AppContext);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);

    const inputRef = useRef(null);
   
    const sendUserMessage = async () => {
        const sender = userData.username;
        try {
            if (message.trim() === '' && !file) {
                return;
            }
            const fileURL = await sendFile(file);
            await sendMessage(chatId, sender, message, fileURL);
            await setLastModified(sender, chatId, message);
            //Used to change the content in user chats
            await onChatEvent();
            setShowEmojis(false);
            setMessage('');
            setFile(null);
            setFileName('');
        } catch (error) {
            toast.error(error.code);
        }
    }

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const name = e.target.files[0].name;

        setFile(selectedFile);
        setFileName(name);
    }

    const removeFile = () => {
        setFile(null);
        setFileName('');
    }

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
    }

    const handleShowEmojis = () => {
        setShowEmojis(!showEmojis);
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            e.stopPropagation();
            sendUserMessage();
        }
    };
    return (
        <div className="input-div">

            <form onSubmit={e => e.preventDefault()}>
                <input
                    type="text"
                    name="message"
                    id="message"
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="chat-message-input"
                    ref={inputRef} />
                <button className='emoji-button' onClick={handleShowEmojis}>Emojis</button>
                {showEmojis && <EmojiPicker onEmojiSelect={handleEmojiSelect} />}
                <button type='submit' onClick={sendUserMessage}
                    className="btn btn-primary">send</button>
            </form>
            <label htmlFor="chat-file-upload" className="chat-file-label">
                File: {fileName ? (`${fileName}`) : null}</label>
            <input type="file" id="chat-file-upload" onChange={handleFileChange} />
            <button onClick={removeFile}>remove</button>
        </div >
    )
}

ChatInput.propTypes = {
    chatId: PropTypes.string,
    onChatEvent: PropTypes.func,
}