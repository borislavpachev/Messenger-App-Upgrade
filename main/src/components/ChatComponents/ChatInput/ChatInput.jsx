import { useContext, useRef, useState } from "react";
import Button from "../../Button/Button";
import PropTypes from 'prop-types';
import { AppContext } from "../../../context/AppContext";
import { sendMessage, setLastModified } from "../../../services/chats.service";
import EmojiPicker from "../../EmojiPicker/EmojiPicker";
import './ChatInput.css'

export default function ChatInput({ chatId, onChatEvent }) {
    const { userData } = useContext(AppContext);
    const [message, setMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);

    const inputRef = useRef(null);

    const sendUserMessage = async () => {
        const sender = userData.username;
        try {
            if (message.trim() === '') {
                return;
            }

            await sendMessage(chatId, sender, message);
            await setLastModified(sender, chatId, message);
            //Used to change the content in user chats
            setShowEmojis(false);
            await onChatEvent();
            setMessage('');
        } catch (error) {
            console.log(error.message);
        }
    }

    const handleChange = (e) => {
        setMessage(e.target.value);
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
        <div style={{ position: 'relative' }}>
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
        </div>
    )
}

ChatInput.propTypes = {
    chatId: PropTypes.string,
    onChatEvent: PropTypes.func,
}