import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { leaveChat, listenToChat } from "../../../services/chats.service";
import RenameChat from "../RenameChat/RenameChat";
import Button from "../../Button/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";
import './ChatHeader.css'
import { createVideoRoom, getVideoRoomParticipants, joinRoom } from "../../../services/video.service";

export default function ChatHeader({ chatId }) {
    const { userData } = useContext(AppContext);
    const [chatInfo, setChatInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [videoJoined, setVideoJoined] = useState([]);

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
            setVideoJoined(newJoined)
        });

        return () => unsubscribe;
    }, [chatId]);

    const leaveThisChat = async () => {
        const participant = userData.username;
        try {
            const leaveCompleted = await leaveChat(chatId, participant);
            if (leaveCompleted) {
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
                            (!chatInfo?.participants ?
                                (null) :
                                (chatInfo?.participants
                                    .filter((user) => user !== userData.username)
                                    .join(' '))
                            )
                    }
                </div>
                <div>
                    <Button className="btn btn-info m-2" onClick={() => setShowModal(true)}>Rename</Button>
                    <RenameChat id={chatId} show={showModal} setShow={setShowModal} />
                    <Button className="btn btn-danger m-2" onClick={leaveThisChat}> Leave chat</Button>
                    {(videoJoined.length) ?
                        <Button className="btn btn-primary m-2" onClick={handleJoinVideo}>Join</Button> :
                        <Button className="btn btn-primary m-2" onClick={handleJoinVideo}>Video</Button>
                    }
                </div>
            </header>)
    )
}

ChatHeader.propTypes = {
    chatId: PropTypes.string,
}
