import PropTypes from 'prop-types';
import { AppContext } from "../../../context/AppContext"
import { useContext } from 'react';

export default function ChatPreview({ users }) {
    const { userData } = useContext(AppContext);

    return (
        <div className="container-sm bg-primary-outline">
            <p>Chat with:</p>
            <p>{
                users
                    .filter((user) => user !== userData.username)
                    .join(', ')
            }</p>
        </div>
    )
}

ChatPreview.propTypes = {
    users: PropTypes.array
}