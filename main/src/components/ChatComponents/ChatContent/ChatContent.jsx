import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getChatById } from "../../../services/messages.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import ChatInput from "../ChatInput/ChatInput";

export default function ChatContent({ chatId }) {
    const [chat, setChat] = useState();

    useEffect(() => {
        getChatById(chatId).then(setChat)
    }, [chatId]);

    return (
        <div className="chats-content">
            {
              chat ?  chat.map((message) => {
                    return <div key={message.id}>
                        <span><SimpleProfilePreview username={message.author}/> {new Date(message.sentOn).toLocaleString('bg-BG')}</span>
                        <p>Message: {message.message}</p>
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