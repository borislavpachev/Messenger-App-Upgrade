import { useContext, useState, useEffect } from "react"
import { getAllUsers } from "../../../services/users.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import { checkChatRoomExistence, createChatRoom } from "../../../services/chats.service";
import { AppContext } from "../../../context/AppContext";
import Button from '../../Button/Button'
import toast from "react-hot-toast";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserMinus, faComments } from '@fortawesome/free-solid-svg-icons';
import { createDailyRoom } from '../../../services/video.service'
import './CreateChatRoom.css'

export default function CreateChatRoom() {
    const { userData } = useContext(AppContext);
    const [chatUsers, setChatUsers] = useState([]);
    const [chatUser, setChatUser] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [newChatRoomId, setNewChatRoomId] = useState('');

    useEffect(() => {
        getAllUsers()
            .then(users => {
                setAllUsers(users);

                const withoutCurrentUser = users
                    .filter((user) => user.username !== userData.username);
                setSearchResults(withoutCurrentUser);
            }).catch(console.error);

    }, [showModal, userData.username]);

    const handleClick = async (addedUser) => {

        const changeUsersList = searchResults.filter((user) => user.username !== addedUser.username);
        setSearchResults(changeUsersList);

        try {
            const userExists = chatUsers.some(user => user.username === addedUser.username);
            if (userExists) {
                toast.error('User is already added !');
            } else {
                setChatUsers([...chatUsers, addedUser]);
            }
            setChatUser('');

        } catch (error) {
            console.error(error.message);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        setSearchResults([]);
        setChatUsers([]);
    }

    const handleSearch = (searchParam) => {
        const results = allUsers
            .filter((user) => user.username.startsWith(searchParam) && user.username !== userData.username);
        setSearchResults(results);
    }

    const handleChange = (e) => {
        setChatUser(e.target.value);
        handleSearch(e.target.value);
    }

    const removeUser = async (userToRemove) => {
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
                const chatId = await createChatRoom(chatParticipants);
                setNewChatRoomId(chatId);

                toast.success('Chat created successfully');
                closeModal();
                setChatUsers([]);
            }
        } catch (error) {
            console.error(error.message);
        }
    }

// To not create chat rooms in the API 
    // useEffect(() => {
    //     if (newChatRoomId !== '') {

    //         createDailyRoom(newChatRoomId)
    //             .then(roomData => {
    //                 console.log('Room created successfully:', roomData);
    //                 setNewChatRoomId('');
    //                 // Save room data to Firebase Realtime Database or handle as needed
    //             })
    //             .catch(error => {
    //                 console.error('Failed to create room:', error);
    //             });
    //     }
    // }, [newChatRoomId]);



    return (
        <div className="create-chat-container">
            <Button className="create-chat-room" onClick={() => setShowModal(true)}>
                Start a chat <FontAwesomeIcon icon={faComments} className="ms-2" /></Button>
            <Modal show={showModal} onHide={closeModal} size="lg">
                <Modal.Header closeButton >
                    <Modal.Title>Create chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="modal-body">
                        <div className="create-chat-users">
                            <form onSubmit={(e) => e.preventDefault()}>
                                <input type="search" name="user" id="user" value={chatUser} onChange={handleChange} />
                            </form>
                        </div>
                        <div className="create-chat-content">
                            <div className="search-users-results">
                                {
                                    searchResults ?
                                        searchResults.map((user) => {
                                            return <div key={user.uid} className="single-search">
                                                <SimpleProfilePreview username={user.username} />
                                                <FontAwesomeIcon
                                                    className='btn btn-primary add-icon'
                                                    icon={faUserPlus}
                                                    onClick={() => handleClick(user)} />
                                            </div>
                                        }) : (null)
                                }
                            </div>
                            <div className="create-chat-added">
                                {
                                    chatUsers.map((user) => {
                                        return <div key={user.uid} className="single-added">
                                            <SimpleProfilePreview username={user.username} />
                                            <FontAwesomeIcon
                                                className="btn btn-primary remove-icon"
                                                icon={faUserMinus}
                                                onClick={() => removeUser(user.username)} />
                                        </div>
                                    })
                                }
                            </div>
                        </div>
                        <Button
                            className="create-chat-button"
                            onClick={createChat}
                            disabled={!chatUsers.length}
                        >Create chat</Button>
                    </div>
                </Modal.Body>
            </Modal >
        </div>
    )
}
