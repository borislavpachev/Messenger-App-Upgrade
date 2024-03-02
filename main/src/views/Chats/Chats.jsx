import { useContext, useEffect, useState } from 'react';
import ChatContent from '../../components/ChatComponents/ChatContent/ChatContent';
import CreateChatRoom from "../../components/ChatComponents/CreateChatRoom/CreateChatRoom";
import UserChats from "../../components/ChatComponents/UserChats/UserChats";
import { getChatsByParticipant } from '../../services/messages.service';
import { AppContext } from '../../context/AppContext';
import { useParams } from 'react-router-dom';

export default function Chats() {
    const { userData } = useContext(AppContext);
    const [chats, setChats] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        getChatsByParticipant(userData.username).then(setChats)
    }, []);

    const onChatCreated = async () => {
        const chats = await getChatsByParticipant(userData.username)
        setChats(chats);
    }

    return (
        <div className='chats-container'>
            <CreateChatRoom onCreate={onChatCreated} />
            <div className='chat-main'>
            <UserChats chats={chats} />
            <ChatContent chatId={id} />
            </div>
        </div >
    )
}