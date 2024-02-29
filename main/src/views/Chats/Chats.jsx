import ChatContent from '../../components/ChatComponents/ChatContent/ChatContent';
import ChatInput from '../../components/ChatComponents/ChatInput/ChatInput';
import CreateChatRoom from "../../components/ChatComponents/CreateChatRoom/CreateChatRoom";
import UserChats from "../../components/ChatComponents/UserChats/UserChats";

export default function Chats() {

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <CreateChatRoom />
            <UserChats />
            {/* <ChatContent />
            <ChatInput />  */}
        </div >
    )
}