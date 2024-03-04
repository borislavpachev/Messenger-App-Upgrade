import { useState } from "react";
import PropTypes from 'prop-types';
import { Modal } from "react-bootstrap";
import Button from '../../Button/Button'
import { updateChatTitle } from "../../../services/chats.service";

export default function RenameChat({ id, show, setShow, rename}) {
    const [chatName, setChatName] = useState('');

    const handleClick = async () => {
        await updateChatTitle(id, chatName);
        rename();

        setShow(false);
    }

    const clearTitle = async () => {
        await updateChatTitle(id, '');
        rename();

        setShow(false);
    }

    const handleChange = (e) => {
        setChatName(e.target.value);
    }



    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header>
                <Modal.Title>Rename chat room</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <form onSubmit={(e) => e.preventDefault()}>
                        <input type="text" name="chat" id="chat" value={chatName} onChange={handleChange} />
                        <Button type="submit" onClick={handleClick}>rename</Button>
                        <Button type="submit" onClick={clearTitle}>clear</Button>
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
}