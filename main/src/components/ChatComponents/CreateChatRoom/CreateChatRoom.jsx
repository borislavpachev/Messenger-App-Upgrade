import { useContext, useState } from "react"
import { getUserByUsername } from "../../../services/users.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import { checkChatRoomExistence, createChatRoom } from "../../../services/chats.service";
import { AppContext } from "../../../context/AppContext";
import Button from '../../Button/Button'
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import './CreateChatRoom.css'

export default function CreateChatRoom() {
    const { userData } = useContext(AppContext);
    const [chatUsers, setChatUsers] = useState([]);
    const [chatUser, setChatUser] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleClick = async () => {
        if (chatUser.length === 0) {
            toast.error('No user added');
            return
        }

        try {
            const addedUser = await getUserByUsername(chatUser);

            if (!addedUser.exists()) {
                toast.error('User does not exists!');
            } else if (addedUser.val().username === userData.username) {
                toast.error('You are already a participant!');
            } else {
                const userExists = chatUsers.some(user => user.username === addedUser.val().username);
                if (userExists) {
                    toast.error('User is already added !');
                } else {
                    setChatUsers([...chatUsers, addedUser.val()]);
                }
            }
            setChatUser('');
        } catch (error) {
            console.error(error.message);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        setChatUsers([]);
    }

    const handleChange = (e) => {
        setChatUser(e.target.value);
    }

    const removeUser = (userToRemove) => {
        const users = chatUsers.filter((user) => user.username !== userToRemove);
        setChatUsers(users);
    }

    const createChat = async () => {
        const usersUsernames = chatUsers.map((user) => user.username);

        try {
            const chatParticipants = [...usersUsernames, userData.username];
            if (chatParticipants.length === 1) {
                return
            }
            const check = await checkChatRoomExistence(chatParticipants);

            if (check) {
                toast.error('Chat already exists');
                setChatUsers([]);
                closeModal();
                return
            } else {
                await createChatRoom(chatParticipants);
                toast.success('Chat created successfully');
                closeModal();
                setChatUsers([]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <>
            <Button className="create-chat-room" onClick={() => setShowModal(true)}>+</Button>
            <Modal show={showModal} onHide={closeModal}>
                <Modal.Header closeButton >
                    <Modal.Title>Create chat</Modal.Title>
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
                                        <SimpleProfilePreview key={user.uid} username={user.username} />
                                        <Button onClick={() => removeUser(user.username)}>X</Button >
                                    </>
                                ))
                            }
                        </div>
                        <Button onClick={createChat} className="create-chat-button">Create chat</Button>
                    </div>
                </Modal.Body>
            </Modal >
        </>
    )
}
