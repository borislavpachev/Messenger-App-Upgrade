import { useContext, useState } from "react"
import PropTypes from 'prop-types'
import { getUserByUsername } from "../../../services/users.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import { checkChatRoomExistence, createChatRoom } from "../../../services/chats.service";
import { AppContext } from "../../../context/AppContext";
import Button from '../../Button/Button'
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import './CreateChatRoom.css'

export default function CreateChatRoom({ onCreate }) {
    const { userData } = useContext(AppContext);
    const [chatUsers, setChatUsers] = useState([]);
    const [chatUser, setChatUser] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleClick = async () => {

        try {
            if (chatUser.length === 0) {
                toast.error('No user added');
                return
            }
            const addedUser = await getUserByUsername(chatUser);
            if (!addedUser.exists()) {
                toast.error('User does not exists!');
            } else if (addedUser.val().username === userData.username) {
                toast.error('You are already a participant !');
            } else if (addedUser.exists() && addedUser.val().username !== userData.username) {
                setChatUsers([...chatUsers, addedUser.val()]);
            }
            setChatUser('');
        } catch (error) {
            toast.error(error.code);
        }
    }

    const handleChange = (e) => {
        setChatUser(e.target.value);
    }

    const removeUser = (id) => {
    
    }


    const createChat = async () => {
        const usersUsernames = chatUsers.map((user) => user.username);

        try {
            const chatParticipants = [...usersUsernames, userData.username];
            const check = await checkChatRoomExistence(chatParticipants);

            if (check) {
                toast.error('Chat already exists');
                setChatUsers([]);
                return
            } else {
                await createChatRoom(chatParticipants);
                setShowModal(false);
                toast.success('Chat created successfully');
                await onCreate();
                setChatUsers([]);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }
    return (
        <>
            <Button className="create-chat-room" onClick={() => setShowModal(true)}>+</Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton >
                    <Modal.Title>Create chat room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="create-chat-users">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input type="text" name="user" id="user" value={chatUser} onChange={handleChange} />
                            <Button type="submit" onClick={handleClick} className="create-chat-button">add user</Button>
                        </form>
                        <div className="create-chat-added">
                            {
                                chatUsers.map((user) => (
                                    <>
                                        <SimpleProfilePreview key={user.uid}
                                            username={user.username} />
                                    </>
                                ))
                            }
                        </div>
                        <Button onClick={createChat} className="create-chat-button">create</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

CreateChatRoom.propTypes = {
    onCreate: PropTypes.func,
}