import {
    useContext,
    useEffect,
    useState
} from "react";
import PropTypes from 'prop-types';
import { leaveChat, listenToChat } from "../../../services/chats.service";
import RenameChat from "../RenameChat/RenameChat";
import Button from "../../Button/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import {
    createVideoRoom,
    getVideoRoomParticipants,
    joinRoom
} from "../../../services/video.service";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPersonWalkingArrowRight, faVideo, faPencil } from '@fortawesome/free-solid-svg-icons';
import { Modal } from "react-bootstrap";
import './ChatHeader.css'

export default function ChatHeader({ chatId }) {
    const { userData } = useContext(AppContext);
    const [chatInfo, setChatInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [videoJoined, setVideoJoined] = useState([]);
    const [showLeaveModal, setShowLeaveModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {

        const unsubscribe = listenToChat(chatId, (newChatInfo) => {
            setChatInfo(newChatInfo)
        });

        return () => unsubscribe();

    }, [chatId]);


    useEffect(() => {
        const roomId = chatId;

        const unsubscribe = getVideoRoomParticipants(roomId, (newJoined) => {
            setVideoJoined(newJoined);
        });

        return () => unsubscribe;
    }, [chatId]);

    const leaveThisChat = async () => {
        const participant = userData.username;
        try {
            const leaveCompleted = await leaveChat(chatId, participant);

            if (leaveCompleted) {
                handleLeave();
                toast.success('You left this chat!');
                navigate('/main/chats');
            }
        } catch (error) {
            console.error(error.code);
        }
    }

    const handleJoinVideo = async () => {
        await createVideoRoom(chatId, chatInfo.participants);

        navigate(`/main/chats/video/${chatId}`);
        await joinRoom(chatId, userData.username);

    }

    const handleLeave = () => {
        setShowLeaveModal(true);
    }

    const title = chatInfo?.chatTitle;

    return (
        (!chatId) ?
            (<div></div>)
            :
            (<header className="chat-header">
                <div>
                    {
                        title ?
                            (<span>{title}</span>) :
                            (<span>{!chatInfo?.participants ?
                                (null) :
                                (chatInfo?.participants
                                    .filter((user) => user !== userData.username)
                                    .join(' '))}
                            </span>
                            )
                    }
                </div>
                <div className="chat-header-buttons">
                    <Button className="chat-header-button"
                        onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPencil} />
                    </Button>
                    <RenameChat id={chatId} show={showModal} setShow={setShowModal} />
                    {(videoJoined.length) ?
                        <Button className="chat-header-button video-call-start" onClick={handleJoinVideo}>
                            <div className="video-btn-wrapper">
                                <span>Join</span>
                                <FontAwesomeIcon icon={faVideo} />
                            </div>
                        </Button>
                        :
                        <Button className="chat-header-button video-call-start" onClick={handleJoinVideo}>
                            <FontAwesomeIcon icon={faVideo} />
                        </Button>
                    }
                    <Button
                        className="chat-header-button leave-chat"
                        onClick={handleLeave}>
                        <FontAwesomeIcon icon={faPersonWalkingArrowRight} />
                    </Button>
                    <Modal show={showLeaveModal}
                        onHide={() => setShowLeaveModal(false)}>
                        <Modal.Body>
                            <div className='delete-message-modal'>
                                <h4>Are you sure you want to leave this chat?</h4>
                                <Button className='send-message' onClick={leaveThisChat}>Yes</Button>
                                <Button className='send-message' onClick={() => setShowLeaveModal(false)}>No</Button>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            </header>)

    )
}

ChatHeader.propTypes = {
    chatId: PropTypes.string,
}
