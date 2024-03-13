import { useContext, useEffect, useState } from 'react';
import ChatContent from '../../components/ChatComponents/ChatContent/ChatContent';
import CreateChatRoom from "../../components/ChatComponents/CreateChatRoom/CreateChatRoom";
import UserChats from "../../components/ChatComponents/UserChats/UserChats";
import { getChatByParticipant } from '../../services/chats.service';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';
import './Chats.css'

export default function Chats() {
    const { userData } = useContext(AppContext);
    const [chats, setChats] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const cleanup = getChatByParticipant(userData.username, setChats);

        return cleanup;
    }, [userData.username]);

    const sortedChats = [...chats].sort((a, b) => {
        return new Date(b.lastModified) - new Date(a.lastModified);
    });

    return (
        <div className='chats-container'>
            <CreateChatRoom />
            <div className='chat-main'>
                <UserChats chats={sortedChats} />
                <ChatContent chatId={id} />
            </div>
        </div >
    )
}