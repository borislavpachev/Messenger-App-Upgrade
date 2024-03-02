import { useContext, useState } from "react";
import Button from "../../Button/Button";
import PropTypes from 'prop-types';
import { AppContext } from "../../../context/AppContext";
import { sendMessage } from "../../../services/chats.service";

export default function ChatInput({ chatId }) {
    const { userData } = useContext(AppContext);
    const [message, setMessage] = useState('');

    const sendUserMessage = async () => {
        try {
            await sendMessage(chatId, userData.username, message);
            setMessage('');
        } catch (error) {
            console.log(error.message);
        }
    }
    
    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input type="text" name="message" id="message" value={message}
                    onChange={handleChange} style={{outline:'none', width: '90%', margin: '10px'}}/>
                <Button type='submit' onClick={sendUserMessage}>send</Button>
            </form>
        </div>
    )
}

ChatInput.propTypes = {
    chatId: PropTypes.string,
}