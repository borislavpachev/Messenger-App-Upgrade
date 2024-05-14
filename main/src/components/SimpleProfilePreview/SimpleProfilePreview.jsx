import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getUserDataByUsername } from '../../services/users.service';
import { CgProfile } from 'react-icons/cg';
import './SimpleProfilePreview.css';

export default function SimpleProfilePreview({ username, date }) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUserDataByUsername(username).then(setCurrentUser).catch(console.error);
  }, [username]);

  return (
    <>
      {currentUser ? (
        <div className="simple-profile-view">
          {!currentUser.photoURL ? (
            <CgProfile className="rounded-circle custom-simple-img" />
          ) : (
            <img
              alt="avatar-mini"
              className="rounded-circle custom-simple-img "
              src={currentUser.photoURL}
            />
          )}
          <span>
            {currentUser.firstName} {currentUser.lastName} {date}
          </span>
        </div>
      ) : null}
    </>
  );
}

SimpleProfilePreview.propTypes = {
  username: PropTypes.string,
  date: PropTypes.any,
};
