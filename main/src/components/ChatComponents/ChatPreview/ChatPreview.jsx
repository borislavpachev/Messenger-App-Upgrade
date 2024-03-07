import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './ChatPreview.css'
import { getUserDataByUsername } from '../../../services/users.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPeopleGroup,faUser} from '@fortawesome/free-solid-svg-icons';

export default function ChatPreview({ author, lastMessage, users, chatId }) {
    const { userData } = useContext(AppContext);
    const [singleUser, setSingleUser] = useState(null);


    useEffect(() => {
        if (users.length === 2) {
            const [user] = users.filter((user) => user !== userData.username);
            getUserDataByUsername(user).then(setSingleUser);
        }
    }, []);

    return (
        <NavLink to={`/chats/${chatId}`}>
            <div className='chats-single-preview' >
                {singleUser ?
                    !singleUser.photoURL ?
                    <FontAwesomeIcon icon={faUser} className="single-preview-user"  />
                        :
                        <img alt="avatar-mini" className="single-img" src={singleUser.photoURL} />
                    :
                    <FontAwesomeIcon icon={faPeopleGroup} className="single-preview-img" />
                }
                <div className='single-preview-content'>

                    <p className='user-chats'>
                        {
                            users
                                .filter((user) => user !== userData.username)
                                .join(', ')
                        }
                    </p>
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
    author: PropTypes.string,
    lastMessage: PropTypes.string,
    users: PropTypes.array,
    chatId: PropTypes.string,
}