import PropTypes from 'prop-types';
import ChatPreview from '../ChatPreview/ChatPreview';
import { useEffect, useState } from 'react';
import './UserChats.css';

export default function UserChats({ chats }) {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    setSearchResults(chats);
  }, [chats]);

  const handleChange = (e) => {
    setSearch(e.target.value);
    handleSearch(e.target.value);
  };

  const handleSearch = (searchParam) => {
    const filteredChats = chats.filter((chat) =>
      chat.participants.some((p) => p.includes(searchParam))
    );

    setSearchResults(filteredChats);
  };

  return (
    <>
      <div className="user-chats-custom align-items-center justify-content-center px-2 py-2 ">
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control py-3 mb-2"
            type="search"
            name="chats"
            id="chats"
            value={search}
            onChange={handleChange}
            placeholder="Search in chats"
          />
        </form>
        <div className="border border-light"></div>
        <div className="chat-previews">
          {searchResults.map((chat) => (
            <ChatPreview
              key={chat.id}
              users={Object.values(chat.participants)}
              chatId={chat.id}
            />
          ))}
        </div>
      </div>
    </>
  );
}

UserChats.propTypes = {
  chats: PropTypes.array,
};
