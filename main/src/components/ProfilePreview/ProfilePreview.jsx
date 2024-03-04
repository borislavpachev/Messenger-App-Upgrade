import { useContext } from "react"
import { AppContext } from "../../context/AppContext"
import PropTypes from 'prop-types';
import './ProfilePreview.css'
import { CgProfile } from "react-icons/cg";
import { MdFileUpload } from "react-icons/md";
import { MdVerified } from "react-icons/md";

export default function ProfilePreview({ photoURL, setProfilePhoto, uploadPhoto, photo, fileName, setFileName, removePhoto }) {
    const { user, userData } = useContext(AppContext);

    const handleInputChange = (e) => {
        if (e.target.files[0]) {
            setProfilePhoto(e.target.files[0])
            setFileName(e.target.files[0].name);
        }
    }

    return (
        <div className="profile-preview">
            <div >
                {(!photoURL) ?
                    <CgProfile className="profile-avatar-icon" /> :
                    <img alt="avatar" className='profile-avatar' src={photoURL} />
                }
                <div>
                    <label className="photo-upload-label" htmlFor="profile-photo-upload">
                        Choose file<span>{fileName ? (`: ${fileName}`) : null}</span></label>
                    <input type="file" accept="image/*"
                        id="profile-photo-upload" onChange={handleInputChange} />
                    <div>
                        <button className="btn btn-danger" onClick={removePhoto}>x</button>
                    </div>
                    <h3 className="user-profile-name">{userData.username} {user.emailVerified ? <MdVerified className="verified-user" /> : null}</h3>
                    <p><strong> <em>{userData.firstName} {userData.lastName} </em></strong></p>
                    <p>Member since: <strong>{new Date(userData.createdOn).toLocaleDateString('bg-BG')}</strong></p>
                    <button className="photo-upload-button"
                        disabled={(!photo)}
                        onClick={uploadPhoto}><MdFileUpload />Upload</button>
                </div>
            </div>
        </div>
    )
}

ProfilePreview.propTypes = {
    photoURL: PropTypes.string,
    setProfilePhoto: PropTypes.func,
    uploadPhoto: PropTypes.func,
    photo: PropTypes.any,
    fileName: PropTypes.string,
    setFileName: PropTypes.func,
    removePhoto: PropTypes.func,
}