import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AppContext } from "../../../context/AppContext";
import { editMessage } from '../../../services/chats.service';

export default function ChatMessage({ chatId, message }) {
    const { userData } = useContext(AppContext);
    const [inEditMode, setInEditMode] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState(message.message);

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
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div>
            {inEditMode ?
                (
                    <div className="edit-message">
                        <input className="edit-message-input" key={message.id} type="text"
                            value={messageToEdit}
                            onChange={handleChange}
                        />
                        <button onClick={editMessageContent}>Save</button>
                        <button onClick={handleEdit}>Cancel</button>
                    </div>
                )
                :
                (<span><strong>Message: </strong>{message.message}</span>)
            }
            {userData.username === message.author ?
                (<button onClick={handleEdit}>edit</button>)
                :
                (null)
            }
        </div>
    )
}

ChatMessage.propTypes = {
    chatId: PropTypes.string,
    message: PropTypes.object,
}