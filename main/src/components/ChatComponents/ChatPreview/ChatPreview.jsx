import PropTypes from 'prop-types';
import { useContext} from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import './ChatPreview.css'

export default function ChatPreview({ author, lastMessage, users, chatId }) {
    const { userData } = useContext(AppContext);
  
    return (
        <NavLink to={`/chats/${chatId}`}>
            <div style={{ padding: '10px', border: '1px solid black', margin: '10px' }}>
                {
                    users
                        .filter((user) => user !== userData.username)
                        .join(', ')
                }
                {
                    author ?
                        (<p className='user-chats-last-message'>{author  === userData.username ? (<span>You</span>) : author }: {lastMessage}</p>) : (
                            <p>Empty Chat</p>
                        )
                }
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