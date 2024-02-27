import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { updatePhotoURL, uploadProfilePicture } from "../../services/users.service";
import ProfilePreview from '../../components/ProfilePreview/ProfilePreview'

export default function UserProfile() {

    const { user, userData } = useContext(AppContext);
    const [photoURL, setPhotoURL] = useState('');
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [fileName, setFileName] = useState('');


    useEffect(() => {
        if (user && user.photoURL) {
            setPhotoURL(user.photoURL)
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
            toast.error(error.code);
        }
    };

    return (
        <div>
            <ProfilePreview photoURL={photoURL} setProfilePhoto={setProfilePhoto}
                uploadPhoto={uploadPhoto} photo={profilePhoto}
                fileName={fileName} setFileName={setFileName} />
        </div>
    )
}