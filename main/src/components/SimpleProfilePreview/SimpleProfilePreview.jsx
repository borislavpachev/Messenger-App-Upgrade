import { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getUserDataByUsername } from "../../services/users.service";
import { CgProfile } from "react-icons/cg";
import './SimpleProfilePreview.css';

export default function SimpleProfilePreview({ username }) {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getUserDataByUsername(username).then(setCurrentUser)
    }, []);

    return (
        <>
            {
                currentUser ?
                    (
                        <div className="rounded bg-primary mx-1 p-2">
                                    {(!currentUser.photoURL) ?
                                        <CgProfile className="rounded-circle custom-img" />
                                        :
                                        <img alt="avatar-mini" className="rounded-circle custom-img " src={currentUser.photoURL} />
                                    }
                                    <span>{currentUser.firstName} {currentUser.lastName}</span>
                                </div>
                    ) : null
            }
        </>
    )
}

SimpleProfilePreview.propTypes = {
    username: PropTypes.string,
}