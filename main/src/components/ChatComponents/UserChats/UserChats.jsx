import PropTypes from 'prop-types'
import ChatPreview from "../ChatPreview/ChatPreview";

export default function UserChats({ chats }) {
    
    return (
        <div className="chats-custom">
            {
                chats.map((chat) => <ChatPreview key={chat.id} 
                users={Object.values(chat.participants)} chatId={chat.id} />)
            }
        </div>
    )
}

UserChats.propTypes = {
    chats: PropTypes.array,
}