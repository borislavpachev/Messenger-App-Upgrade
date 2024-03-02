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
            {
                chat ? chat.map((message) => {
                    return <div key={message.id} className="chats-message">
                        <span><SimpleProfilePreview username={message.author} /> {new Date(message.sentOn).toLocaleString('bg-BG')}</span>
                        <p >Message: {message.message}</p>
                    </div>

                }) : (' No messages yet.')
            }
            <ChatInput chatId={chatId} />
        </div>
    )
}

ChatContent.propTypes = {
    chatId: PropTypes.string,
}