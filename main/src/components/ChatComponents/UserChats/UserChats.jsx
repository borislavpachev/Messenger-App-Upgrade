import { useContext, useEffect, useState } from "react"
import { AppContext } from "../../../context/AppContext"
import { getChatsByParticipant } from '../../../services/messages.service'
import ChatPreview from "../ChatPreview/ChatPreview";

export default function UserChats() {
    const { userData } = useContext(AppContext);
    const [chats, setChats] = useState([]);

    useEffect(() => {
        getChatsByParticipant(userData.username).then(setChats)
    }, []);
    
    const allChatsUsers = chats.map((chat) => chat.participants);

    return (
        <div className="chats-custom">
            {
                allChatsUsers.map((chatUsers, index) => <ChatPreview key={index} users={Object.keys(chatUsers)} />)
            }
        </div>
    )
}