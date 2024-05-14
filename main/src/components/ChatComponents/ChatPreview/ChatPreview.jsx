import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { getUserDataByUsernameLive } from '../../../services/users.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPeopleGroup,
  faUser,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import { listenToChat, setChatAsSeen } from '../../../services/chats.service';
import { BsFillDashCircleFill } from 'react-icons/bs';
import './ChatPreview.css';

export default function ChatPreview({ users, chatId }) {
  const { userData } = useContext(AppContext);
  const [chatInfo, setChatInfo] = useState(null);
  const [singleUser, setSingleUser] = useState(null);
  const [isSeen, setIsSeen] = useState(true);

  const location = useLocation();
  const isActive = location.pathname === `/main/chats/${chatId}`;
  const activeClass = isActive ? 'active-chat-preview' : '';

  useEffect(() => {
    const unsubscribe = listenToChat(chatId, (newChatInfo) => {
      setChatInfo(newChatInfo);

      const isSeenValue = newChatInfo.isSeen[userData.username];
      setIsSeen(isSeenValue);
    });

    return () => unsubscribe(); // This will run when the component unmounts
  }, [chatId, userData.username]);

  useEffect(() => {
    if (users.length === 2) {
      const [user] = users.filter((user) => user !== userData.username);

      const cleanup = getUserDataByUsernameLive(user, (newUser) => {
        setSingleUser(newUser);
      });

      return cleanup;
    }
  }, [users, userData.username]);

  const statusIcon = (status) => {
    switch (status) {
      case 'Online':
        return (
          <FontAwesomeIcon
            icon={faCircle}
            title="Online"
            className="status-icon-chats"
            color="green"
            size="sm"
          />
        );
      case 'Offline':
        return (
          <FontAwesomeIcon
            icon={faCircle}
            title="Offline"
            className="status-icon-chats"
            color="grey"
            size="sm"
          />
        );
      case 'Do not disturb':
        return (
          <BsFillDashCircleFill
            title="Do not disturb"
            className="status-icon-chats"
            color="red"
            size="1em"
          />
        );
      default:
        return null;
    }
  };

  const author = chatInfo?.lastSender;
  const lastMessage = chatInfo?.lastMessage;
  const title = chatInfo?.chatTitle;

  const handleCLick = async () => {
    if (isActive) {
      return;
    }

    if (userData) {
      await setChatAsSeen(chatId, userData?.username);
      setIsSeen(true);
    }
  };

  const isSeenClass = isSeen ? 'is-seen' : 'not-seen-class';

  return (
    <NavLink to={`/main/chats/${chatId}`} onClick={handleCLick}>
      <div
        className={`${activeClass} d-flex w-100 rounded bg-info bg-opacity-10 border border-warning
      px-1 py-1 m-auto mt-2  chats-single-preview 
      `}
      >
        <div className={`${isSeenClass}`}></div>
        {singleUser ? (
          !singleUser.photoURL ? (
            <>
              <FontAwesomeIcon icon={faUser} className="single-preview-user" />
              {statusIcon(singleUser.status)}
            </>
          ) : (
            <>
              <img
                alt="avatar-mini"
                className="single-img"
                src={singleUser.photoURL}
              />
              {statusIcon(singleUser.status)}
            </>
          )
        ) : (
          <FontAwesomeIcon
            icon={faPeopleGroup}
            className="single-preview-group"
          />
        )}
        <div className="single-preview-content">
          <span className="user-chats">
            {title
              ? title
              : users.filter((user) => user !== userData.username).join(', ')}
          </span>
          {author ? (
            <span className="user-chats">
              {author === userData.username ? <span>You</span> : author}:{' '}
              {lastMessage}
            </span>
          ) : (
            <span className="user-chats">Empty Chat</span>
          )}
        </div>
      </div>
    </NavLink>
  );
}

ChatPreview.propTypes = {
  users: PropTypes.array,
  chatId: PropTypes.string,
};
