import { useContext, useEffect, useState } from 'react';
import ChatContent from '../../components/ChatComponents/ChatContent/ChatContent';
import CreateChatRoom from "../../components/ChatComponents/CreateChatRoom/CreateChatRoom";
import UserChats from "../../components/ChatComponents/UserChats/UserChats";
import { getChatByParticipant } from '../../services/chats.service';
import { AppContext } from '../../context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import './Chats.css'

export default function Chats() {
    const { userData } = useContext(AppContext);
    const [chats, setChats] = useState([]);
    const { id } = useParams();


    useEffect(() => {
        const unsubscribe = getChatByParticipant(userData.username, setChats);

        return () => unsubscribe;
    }, [userData.username]);

    const sortedChats = [...chats].sort((a, b) => {
        return new Date(b.lastModified) - new Date(a.lastModified);
    });

    return (
        <div className='chat-main'>
            <div className='chat-side'>
                <CreateChatRoom />
                <UserChats chats={sortedChats} />
            </div>
            <div className='chat-content'>
                <ChatContent chatId={id} />
            </div>
        </div>
    )
}