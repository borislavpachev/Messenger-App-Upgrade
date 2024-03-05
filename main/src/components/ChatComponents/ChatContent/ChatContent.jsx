import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getChatById, getChatMessagesById, getChatWithLiveUpdates, leaveChat } from "../../../services/chats.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import ChatInput from "../ChatInput/ChatInput";
import RenameChat from "../RenameChat/RenameChat";
import './ChatContent.css'
import Button from "../../Button/Button";
import toast from "react-hot-toast";
import { AppContext } from "../../../context/AppContext";
import { useNavigate } from "react-router-dom";

export default function ChatContent({ chatId, onLeave }) {
    const { userData } = useContext(AppContext);
    const [chatInfo, setChatInfo] = useState(null);
    const [chatMessages, setChatMessages] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getChatById(chatId).then(setChatInfo);
    }, [chatId]);



    useEffect(() => {
        getChatMessagesById(chatId).then(setChatMessages);

    }, [chatId]);

    useEffect(() => {
        const listener = getChatWithLiveUpdates(chatId, setChatMessages);

        return () => listener();
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
                onLeave();
                navigate('/chats');
            }

        } catch (error) {
            toast.error(error.message);
        }
    }

    return (
        <div className="chats-contents">
            <header className="container bg-warning flex-row" style={{ padding: '10px' }}>
                {
                    chatInfo ?
                        chatInfo.chatTitle ? chatInfo.chatTitle : chatInfo.participants.join(', ')
                        : null
                }
                <Button className="btn btn-info m-2" onClick={() => setShowModal(true)}>Rename</Button>
                <RenameChat id={chatId} show={showModal} setShow={setShowModal} rename={onRename} />
                <Button className="btn btn-danger" onClick={leaveThisChat}> Leave chat</Button>
            </header>
            <div className="chat-messages">
                {
                    chatMessages ? chatMessages.map((message) => {
                        return <div key={message.id} className="chats-message">
                            <SimpleProfilePreview username={message.author} date={new Date(message.sentOn).toLocaleString('bg-BG')} />
                            <span><strong>Message: </strong>{message.message}</span>
                        </div>
                    }) : (
                        <p>No messages yet.</p>
                    )
                }
            </div>
            <ChatInput chatId={chatId} />
        </div >
    )
}

ChatContent.propTypes = {
    chatId: PropTypes.string,
    onLeave: PropTypes.func,
}