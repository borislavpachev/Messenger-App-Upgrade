import { useEffect, useRef, useState } from "react";
import PropTypes from 'prop-types';
import {
    getChatWithLiveUpdates,
} from "../../../services/chats.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import ChatInput from "../ChatInput/ChatInput";
import ChatMessage from "../ChatMessage/ChatMessage";
import ChatHeader from "../ChatHeader/ChatHeader";
import './ChatContent.css'

export default function ChatContent({ chatId }) {
    const [chatMessages, setChatMessages] = useState([]);

    const scroll = useRef(null);

    useEffect(() => {
        scrollDown();
    }, [chatMessages]);

    useEffect(() => {
        const listener = getChatWithLiveUpdates(chatId, setChatMessages);

        return () => listener;
    }, [chatId]);

    const scrollDown = () => {
        setTimeout(() => {
            if (scroll.current) {
                scroll.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
        }, 150);
    };

    return (

        (!chatId) ?
            (
                <div className="chats-contents">
                    <div style={{ justifyContent: "center", textAlign: "center" }}>
                        <h1>No chat selected</h1>
                    </div>
                </div>
            ) : (
                <div className="chats-contents">
                    < ChatHeader chatId={chatId} />
                    <div className="chat-messages" key={chatId}>
                        {
                            chatMessages ?
                                chatMessages.map((message) => {

                                    return <div key={message.id} className="chats-message">
                                        <SimpleProfilePreview username={message.author}
                                            date={new Date(message.sentOn).toLocaleString('bg-BG')} />
                                        <ChatMessage chatId={chatId}
                                            message={message} />
                                    </div>
                                }) :
                                (<p>No messages yet.</p>)
                        }
                        <div ref={scroll}></div>
                    </div >
                    <ChatInput chatId={chatId} />
                </div >
            )
    )
}

ChatContent.propTypes = {
    chatId: PropTypes.string,
}