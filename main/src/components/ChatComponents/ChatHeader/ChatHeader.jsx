import { useContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { getChatById, leaveChat, listenToChat } from "../../../services/chats.service";
import RenameChat from "../RenameChat/RenameChat";
import Button from "../../Button/Button";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../../context/AppContext";

export default function ChatHeader({ chatId, onChatEvent }) {
    const { userData } = useContext(AppContext)
    const [chatInfo, setChatInfo] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const cleanup = listenToChat(chatId, setChatInfo);

        return cleanup;

    }, [chatId]);


    useEffect(() => {
        getChatById(chatId)
            .then(setChatInfo)
            .catch(console.error);
    }, [chatId]);

    const onRename = async () => {
        getChatById(chatId)
            .then(setChatInfo)
            .catch(console.error);
    }

    const leaveThisChat = async () => {
        const participant = userData.username;
        try {
            const leaveCompleted = await leaveChat(chatId, participant);
            if (leaveCompleted) {
                toast.success('You left this chat!');
                // Updates the user chats where the user is participant
                onChatEvent();
                navigate('/chats');
            }
        } catch (error) {
            console.error(error.code);
        }
    }

    const title = chatInfo?.chatTitle;


    return (
        !chatId ?
            (<div></div>)
            :
            (<header className="container bg-light flex-row" style={{ padding: '10px' }}>
                {
                    title ?
                        (title) :
                        (!chatInfo?.participants ?
                            (null) :
                            (chatInfo?.participants
                                .filter((user) => user !== userData.username)
                                .join(' '))
                        )
                }
                <Button className="btn btn-info m-2" onClick={() => setShowModal(true)}>Rename</Button>
                <RenameChat id={chatId} show={showModal} setShow={setShowModal}
                    rename={onRename} />
                <Button className="btn btn-danger" onClick={leaveThisChat}> Leave chat</Button>
            </header>)
    )
}

ChatHeader.propTypes = {
    chatId: PropTypes.string,
    onChatEvent: PropTypes.func,
}
