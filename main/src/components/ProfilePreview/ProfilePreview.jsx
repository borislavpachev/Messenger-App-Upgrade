import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import { CgProfile } from 'react-icons/cg';
import { MdFileUpload } from 'react-icons/md';
import { MdVerified } from 'react-icons/md';
import {
  updatePhotoURL,
  uploadProfilePicture,
} from '../../services/users.service';
import toast from 'react-hot-toast';
import { NavLink } from 'react-router-dom';
import { updateProfile } from 'firebase/auth';
import './ProfilePreview.css';

export default function ProfilePreview() {
  const { user, userData } = useContext(AppContext);
  const [photoURL, setPhotoURL] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (user && user.photoURL) {
      setPhotoURL(user.photoURL);
    }
  }, [user]);

  const uploadPhoto = async () => {
    try {
      const res = await uploadProfilePicture(profilePhoto, user);
      setPhotoURL(res);
      await updatePhotoURL(userData.username, res);
      setFileName('');
      toast.success('Profile photo added successfully.');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const removeProfilePhoto = async () => {
    await updateProfile(user, { photoURL: '' });
    setProfilePhoto(null);
    setPhotoURL('');
    setFileName('');
  };

  const handleInputChange = (e) => {
    if (e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  return (
    <div className="text-white bg-dark text-center">
      {!photoURL ? (
        <CgProfile className="profile-avatar-icon my-3" />
      ) : (
        <img alt="avatar" className="profile-avatar" src={photoURL} />
      )}
      <div className="mt-4 text-center">
        <label className="btn btn-primary" htmlFor="profile-photo-upload">
          Choose file<span>{fileName ? `: ${fileName}` : null}</span>
        </label>
        <input
          type="file"
          accept="image/*"
          id="profile-photo-upload"
          onChange={handleInputChange}
        />
        {!photoURL ? null : (
          <FontAwesomeIcon
            icon={faCircleXmark}
            onClick={removeProfilePhoto}
            className="remove-profile-photo"
          />
        )}
        <h3 className="m-2">
          {userData.username}{' '}
          {user.emailVerified ? <MdVerified className="verified-user" /> : null}
        </h3>
        <p>
          <strong>
            {' '}
            <em className="m-2">
              {userData.firstName} {userData.lastName}{' '}
            </em>
          </strong>
        </p>
        <p className="m-2">
          Member since:{' '}
          <strong>
            {new Date(userData.createdOn).toLocaleDateString('bg-BG')}
          </strong>
        </p>
        <button
          className="btn btn-primary px-5 py-3 m-2"
          disabled={!profilePhoto}
          onClick={uploadPhoto}
        >
          <MdFileUpload />
          Upload
        </button>
        <div>
          <NavLink to="/update-profile">
            <p className="fs-5 text-decoration-underline mt-2">
              Update Profile
            </p>
          </NavLink>
        </div>
      </div>
    </div>
  );
}

ProfilePreview.propTypes = {
  photoURL: PropTypes.string,
  setProfilePhoto: PropTypes.func,
  uploadPhoto: PropTypes.func,
  photo: PropTypes.any,
  fileName: PropTypes.string,
  setFileName: PropTypes.func,
  removePhoto: PropTypes.func,
};
