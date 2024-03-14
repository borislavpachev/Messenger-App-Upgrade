import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { AppContext } from "../../../context/AppContext";
import { deleteMessage, editMessage, removeMessageFile, setLastModified } from '../../../services/chats.service';
import Button from '../../Button/Button';
import { Modal } from "react-bootstrap";
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faTrashCan, faPencil } from '@fortawesome/free-solid-svg-icons';
import './ChatMessage.css';

export default function ChatMessage({ chatId, message }) {
    const { userData } = useContext(AppContext);
    const [inEditMode, setInEditMode] = useState(false);
    const [messageToEdit, setMessageToEdit] = useState(message.message);
    const [textareaHeight, setTextareaHeight] = useState(60);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
        setHovered(true);
    };

    const handleMouseLeave = () => {
        setHovered(false);
    };

    const makeLinkMessage = (message) => {
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return message.split(urlRegex).map((part, index) => {
            if (part.match(urlRegex)) {
                return <a key={index} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
            }
            return part;
        });
    };

    const handleChange = (e) => {
        setMessageToEdit(e.target.value);
    }

    const handleEdit = () => {
        setInEditMode(!inEditMode);
        setMessageToEdit(message.message);
    }

    const handleDelete = async () => {
        setShowDeleteModal(true);
    }

    const handleDeleteConfirm = async () => {
        try {
            await deleteMessage(chatId, message.id);
            await setLastModified(userData.username, chatId, 'Deleted message');
            toast.success('Message deleted.');
            setShowDeleteModal(false);
        } catch (error) {
            console.error(error.code);
        }
    }

    const editMessageContent = async () => {
        try {
            await editMessage(chatId, message, messageToEdit);
            await setLastModified(userData.username, chatId, messageToEdit)
            setInEditMode(!inEditMode);
        } catch (error) {
            console.error(error.code);
        }
    }

    const removeMessageImage = async () => {
        await removeMessageFile(chatId, message.id);
    }

    return (
        <div>
            {inEditMode ?
                (
                    <div className="edit-message">
                        {
                            message.fileURL !== '' ?
                                <div className='edit-message-file'>
                                    <img
                                        src={message.fileURL}
                                        alt="img"
                                        className='uploaded-message-img'

                                    />
                                    <FontAwesomeIcon icon={faCircleXmark} onClick={removeMessageImage}
                                        className="edit-remove-file-button" />
                                </div> : null
                        }
                        <textarea key={message.id} className="edit-chat-message"
                            value={messageToEdit} onChange={handleChange}
                            style={{ height: `${textareaHeight}px` }}
                            onInput={(e) => setTextareaHeight(e.target.scrollHeight)} />
                        <Button className='btn btn-outline-success m-2'
                            onClick={editMessageContent}>Save</Button>

                        <Button className='btn btn-outline-primary m-2'
                            onClick={handleEdit}>Cancel</Button>
                    </div>
                )
                :
                (<div className='my-message' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <div>
                        {
                            message.fileURL !== '' ?
                                <img
                                    src={message.fileURL}
                                    alt="img"
                                    className='uploaded-message-img'
                                /> : null
                        }
                    </div>
                    <span>{makeLinkMessage(message.message)}</span>
                    {hovered && userData.username === message.author ?
                        (<div className='edit-delete-buttons'>
                            <FontAwesomeIcon className='message-edit-btn'
                                onClick={handleEdit} icon={faPencil} />
                            <FontAwesomeIcon className='message-delete-btn'
                                onClick={handleDelete} icon={faTrashCan} />
                        </div>
                        )
                        :
                        (null)
                    }
                </div>
                )
            }

            <Modal show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}>
                <Modal.Body>
                    <div className='delete-message-modal'>
                        <h4>Do you want to delete this message?</h4>
                        <Button className='btn btn-primary ms-2' onClick={handleDeleteConfirm}>Yes</Button>
                        <Button className='btn btn-primary ms-2' onClick={() => setShowDeleteModal(false)}>No</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div >
    )
}

ChatMessage.propTypes = {
    chatId: PropTypes.string,
    message: PropTypes.object,
}