import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AppContext } from "../../../context/AppContext";
import { editMessage } from '../../../services/chats.service';
import './ChatMessage.css';

export default function ChatMessage({ chatId, message }) {
    const { userData } = useContext(AppContext);
    const [inEditMode, setInEditMode] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState(message.message);

    const makeLinkMessage = (message) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return message.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
            }
            return part;
        });
    };

    const handleEdit = () => {
        setInEditMode(!inEditMode);
        setMessageToEdit(message.message);
    }

    const handleChange = (e) => {
        setMessageToEdit(e.target.value);
    }

    const editMessageContent = async () => {
        try {
            await editMessage(chatId, message, messageToEdit);
            setInEditMode(!inEditMode);

            // if (message.message === lastMessage) {
            //     await setLastModified(userData.username, chatId, messageToEdit);
            //     onChatEvent();
            // }
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div>
            {inEditMode ?
                (
                    <div className="edit-message">
                        <textarea className="edit-chat-message" key={message.id} type="text"
                            value={messageToEdit}
                            onChange={handleChange}
                        />
                        <button onClick={editMessageContent}>Save</button>
                        <button onClick={handleEdit}>Cancel</button>
                    </div>
                )
                :
                (<div className='my-message'>
                    <span>{makeLinkMessage(message.message)}</span>
                </div>
                )
            }
            {userData.username === message.author ?
                (<button className='btn btn-primary ms-2' onClick={handleEdit}>edit</button>)
                :
                (null)
            }
        </div>
    )
}

ChatMessage.propTypes = {
    onChatEvent: PropTypes.func,
    chatId: PropTypes.string,
    message: PropTypes.object,
    lastMessage: PropTypes.string,
}