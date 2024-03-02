import PropTypes from 'prop-types';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';

export default function ChatPreview({ users, chatId }) {
    const { userData } = useContext(AppContext);

    return (
        <NavLink to={`/chats/${chatId}`}>
            <p style={{padding: '10px', border: '2px solid black'}}>Chat with:
                {
                    users
                        .filter((user) => user !== userData.username)
                        .join(', ')
                }</p>
        </NavLink>
    )
}

ChatPreview.propTypes = {
    users: PropTypes.array,
    chatId: PropTypes.string,
}