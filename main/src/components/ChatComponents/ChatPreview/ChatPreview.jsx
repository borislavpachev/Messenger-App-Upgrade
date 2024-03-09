import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { getUserDataByUsername } from '../../../services/users.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup, faUser } from '@fortawesome/free-solid-svg-icons';
import { off, onValue, ref } from 'firebase/database';
import { db } from '../../../config/firebase-config';
import { getChatById } from '../../../services/chats.service';
import toast from "react-hot-toast";
import './ChatPreview.css'

export default function ChatPreview({ users, chatId }) {
    const { userData } = useContext(AppContext);
    const [chatInfo, setChatInfo] = useState(null);
    const [singleUser, setSingleUser] = useState(null);

    useEffect(() => {
        const chatRef = ref(db, `chats/${chatId}`);

        const listener = onValue(chatRef, (snapshot) => {
            const result = snapshot.val();
            if (result) {
                setChatInfo(result);
            }
        }, (error) => {
            toast.error(error.code);
        });

        return () => off(chatRef, listener)
    }, [chatId]);

    useEffect(() => {
        getChatById(chatId).then(setChatInfo);
    }, [chatId]);

    useEffect(() => {
        if (users.length === 2) {
            const [user] = users.filter((user) => user !== userData.username);
            getUserDataByUsername(user).then(setSingleUser);
        }
    }, [users, userData.username]);

    const author = chatInfo?.lastSender;
    const lastMessage = chatInfo?.lastMessage;
    const title = chatInfo?.chatTitle;

    return (
        <NavLink to={`/chats/${chatId}`}>
            <div className='chats-single-preview' >
                {singleUser ?
                    (!singleUser.photoURL) ?
                        <FontAwesomeIcon icon={faUser} className="single-preview-user" />
                        :
                        <img alt="avatar-mini" className="single-img" src={singleUser.photoURL} />
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
                            (<span className='user-chats'>{author === userData.username ? (<span>You</span>) : author}: {lastMessage}</span>) : (
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