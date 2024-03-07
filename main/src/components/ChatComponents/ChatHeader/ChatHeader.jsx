import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getChatById, leaveChat } from "../../../services/chats.service";
import RenameChat from "../RenameChat/RenameChat";
import Button from "../../Button/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

export default function ChatHeader({ chatId, onChatEvent }) {
    const { userData } = useContext(AppContext)
    const [chatInfo, setChatInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getChatById(chatId).then(setChatInfo);
    }, [chatId]);

    const onRename = async () => {
        getChatById(chatId).then(setChatInfo);
    }

    const leaveThisChat = async () => {
        const participant = userData.username;
        try {
            const leaveCompleted = await leaveChat(chatId, participant);
            if (leaveCompleted) {
                toast.success('You left this chat!');
                // Updates the user chats where the user is participant
                onChatEvent();
                navigate('/chats');
            }
        } catch (error) {
            toast.error(error.code);
        }
    }

    return (
        <header className="container bg-light flex-row" style={{ padding: '10px' }}>
            {
                // chatInfo ?
                //     chatInfo.chatTitle ? chatInfo.chatTitle : chatInfo.participants.join(' ') : null
            }
            <Button className="btn btn-info m-2" onClick={() => setShowModal(true)}>Rename</Button>
            <RenameChat id={chatId} show={showModal} setShow={setShowModal} rename={onRename} />
            <Button className="btn btn-danger" onClick={leaveThisChat}> Leave chat</Button>
        </header>
    )
}

ChatHeader.propTypes = {
    chatId: PropTypes.string,
    onChatEvent: PropTypes.func,
}
