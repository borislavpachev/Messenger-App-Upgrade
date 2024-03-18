import PropTypes from 'prop-types'
import ChatPreview from "../ChatPreview/ChatPreview";
import { useEffect, useState } from 'react';
import './UserChats.css'

export default function UserChats({ chats }) {
    const [search, setSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        setSearchResults(chats);
    }, [chats]);

    const handleChange = (e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
    }

    const handleSearch = (searchParam) => {
        const filteredChats = chats
            .filter((chat) => chat.participants.some(p => p.includes(searchParam)));

        setSearchResults(filteredChats);
    }

    return (
        <>
            <div className='chats-search-wrapper'>
                <div className='chats-search'>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input
                            type="search"
                            name="chats"
                            id="chats"
                            value={search}
                            onChange={handleChange}
                            placeholder='Search in chats' />
                    </form>
                </div>
            </div>

            <div className="chat-previews">

                {
                    searchResults
                        .map((chat) => <ChatPreview key={chat.id}
                            users={Object.values(chat.participants)}
                            chatId={chat.id} />)
                }
            </div>
        </>
    )
}

UserChats.propTypes = {
    chats: PropTypes.array,
}