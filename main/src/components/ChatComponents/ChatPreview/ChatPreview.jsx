import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { getUserDataByUsername, getUserDataByUsernameLive } from '../../../services/users.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPeopleGroup, faUser,
    faCircle
} from '@fortawesome/free-solid-svg-icons';
import { listenToChat } from '../../../services/chats.service';
import {
    BsFillDashCircleFill,
    BsFillRecordCircleFill,
    BsCheckCircle
} from "react-icons/bs";
import './ChatPreview.css'

export default function ChatPreview({ users, chatId }) {
    const { userData } = useContext(AppContext);
    const [chatInfo, setChatInfo] = useState(null);
    const [singleUser, setSingleUser] = useState(null);
    const [hasNewMessage, setHasNewMessage] = useState(false);

    const location = useLocation();
    const isActive = location.pathname === `/main/chats/${chatId}`;
    const activeClass = isActive ? 'active-chat-preview' : '';

    useEffect(() => {
        const cleanup = listenToChat(chatId, (newChatInfo) => {
            setChatInfo(newChatInfo);

            // Check if the last message was not sent by the current user
            if (newChatInfo.lastSender !== userData.username) {
                setHasNewMessage(true);
            } else {
                setHasNewMessage(false);
            }
        });

        return cleanup; // This will run when the component unmounts
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
                return <FontAwesomeIcon icon={faCircle}
                    title="Online"
                    className='status-icon-chats'
                    color='green' size='sm' />
            case 'Offline':
                return <FontAwesomeIcon icon={faCircle}
                    title="Offline"
                    className='status-icon-chats'
                    color='grey' size='sm' />;
            case 'Do not disturb':
                return <BsFillDashCircleFill
                    title="Do not disturb"
                    className='status-icon-chats'
                    color='red' size='1em' />;
            default:
                return null;
        }
    }

    const author = chatInfo?.lastSender;
    const lastMessage = chatInfo?.lastMessage;
    const title = chatInfo?.chatTitle;

    const newMessageClass = hasNewMessage ? 'new-message' : '';

    return (
        <NavLink
            to={`/main/chats/${chatId}`}
            onClick={() => setHasNewMessage(false)}>
            <div className={`chats-single-preview ${activeClass} ${newMessageClass}`} >
                {singleUser ?
                    (!singleUser.photoURL) ?
                        <>
                            <FontAwesomeIcon icon={faUser} className="single-preview-user" />
                            {statusIcon(singleUser.status)}
                        </>
                        :
                        <>
                            <img alt="avatar-mini" className="single-img" src={singleUser.photoURL} />
                            {statusIcon(singleUser.status)}

                        </>
                    :
                    <FontAwesomeIcon icon={faPeopleGroup} className="single-preview-group" />
                }
                <div className='single-preview-content'>

                    <span className='user-chats'>
                        {title ?
                            (title) :
                            (users
                                .filter((user) => user !== userData.username)
                                .join(', '))
                        }
                    </span>
                    {
                        author ?
                            (<span className='user-chats'>{author === userData.username ?
                                (<span>You</span>) : author}: {lastMessage}</span>)
                            : (
                                <span className='user-chats'>Empty Chat</span>
                            )
                    }
                </div>
            </div>
        </NavLink >
    )
}

ChatPreview.propTypes = {
    users: PropTypes.array,
    chatId: PropTypes.string,
}