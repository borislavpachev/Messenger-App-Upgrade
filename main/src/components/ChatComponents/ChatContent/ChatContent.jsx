import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getChatById, getChatWithLiveUpdates } from "../../../services/chats.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import ChatInput from "../ChatInput/ChatInput";
import './ChatContent.css'

export default function ChatContent({ chatId }) {
    const [chat, setChat] = useState();

    useEffect(() => {
        getChatById(chatId).then(setChat)
    }, [chatId]);

    useEffect(() => {
        const listener = getChatWithLiveUpdates(chatId, setChat);

        return () => listener();

    }, [chatId]);

    return (
        <div className="chats-contents">
            <div className="chat-messages">
                {
                    chat ? chat.map((message) => {
                        return <div key={message.id} className="chats-message">
                            <SimpleProfilePreview username={message.author} date={new Date(message.sentOn).toLocaleString('bg-BG')}/> 
                            <span><strong>Message: </strong>{message.message}</span>
                        </div>
                    }) : (
                        <p>No messages yet.</p>
                    )
                }
            </div>
            <ChatInput chatId={chatId} />
        </div>
    )
}

ChatContent.propTypes = {
    chatId: PropTypes.string,
}