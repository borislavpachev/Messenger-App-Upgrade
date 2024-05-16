import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getChatWithLiveUpdates } from '../../../services/chats.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';
import SimpleProfilePreview from '../../SimpleProfilePreview/SimpleProfilePreview';
import ChatInput from '../ChatInput/ChatInput';
import ChatMessage from '../ChatMessage/ChatMessage';
import ChatHeader from '../ChatHeader/ChatHeader';
import './ChatContent.css';

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
        scroll.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  };

  return !chatId ? (
    <div className="p-5 mt-5">
      <div className="d-flex flex-column align-items-center justify-content-center">
        <FontAwesomeIcon className="text-white h-25 w-25" icon={faComments} />
        <h1 className="text-white m-5">Please select a chat</h1>
      </div>
    </div>
  ) : (
    <div className="custom-margin-content align-items-center">
      <ChatHeader chatId={chatId} />
      <div className="chat-messages" key={chatId}>
        {chatMessages.length ? (
          chatMessages.map((message) => {
            return (
              <div key={message.id}>
                <SimpleProfilePreview
                  username={message.author}
                  date={new Date(message.sentOn).toLocaleString('bg-BG')}
                />
                <ChatMessage chatId={chatId} message={message} />
              </div>
            );
          })
        ) : (
          <div
            className="justify-content-between text-center fs-2 bg-warning bg-opacity-50
           m-5 p-3 rounded border border-warning
           "
          >
            <span>No messages yet.</span>
          </div>
        )}
        <div ref={scroll}></div>
      </div>
      <ChatInput chatId={chatId} />
    </div>
  );
}

ChatContent.propTypes = {
  chatId: PropTypes.string,
};
