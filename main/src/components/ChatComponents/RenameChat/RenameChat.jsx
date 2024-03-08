import { useState } from "react";
import PropTypes from 'prop-types';
import { Modal } from "react-bootstrap";
import Button from '../../Button/Button'
import { updateChatTitle } from "../../../services/chats.service";
import toast from "react-hot-toast";

export default function RenameChat({ id, show, setShow, rename }) {
    const [chatTitle, setChatTitle] = useState('');

    const handleClick = async () => {
        
        try {
            await updateChatTitle(id, chatTitle);
        } catch (error) {
            toast.error(error.code);
        }
        rename();
        setChatTitle('');
        setShow(false);
    }

    const clearTitle = async () => {
        await updateChatTitle(id, '');
        rename();
        setChatTitle('');
        setShow(false);
    }

    const handleChange = (e) => {
        setChatTitle(e.target.value);
    }

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header>
                <Modal.Title>Rename chat room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="create-chat-users">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="text" name="chat" id="chat" value={chatTitle} onChange={handleChange} />
                        <Button className="btn btn-primary m-2" type="submit" onClick={handleClick}>rename</Button>
                        <Button className="btn btn-primary" onClick={clearTitle}>clear</Button>
                    </form>
                </div>
            </Modal.Body>
        </Modal>
    )
}


RenameChat.propTypes = {
    id: PropTypes.string,
    show: PropTypes.bool,
    setShow: PropTypes.func,
    rename: PropTypes.func,
    chatInfo: PropTypes.any,
}