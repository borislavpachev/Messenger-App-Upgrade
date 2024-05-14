import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import Button from '../../Button/Button';
import { getChatById, updateChatTitle } from '../../../services/chats.service';
import './RenameChat.css';

export default function RenameChat({ id, show, setShow }) {
  const [chatTitle, setChatTitle] = useState('');

  useEffect(() => {
    getChatById(id)
      .then((chat) => setChatTitle(chat.chatTitle))
      .catch(console.error);
  }, [id]);

  const handleClick = async () => {
    try {
      if (chatTitle.trim() === '') {
        return;
      }
      await updateChatTitle(id, chatTitle);
    } catch (error) {
      console.error(error.code);
    }

    setShow(false);
  };

  const clearTitle = async () => {
    await updateChatTitle(id, '');
    setChatTitle('');
    setShow(false);
  };

  const handleChange = (e) => {
    setChatTitle(e.target.value);
  };

  return (
    <Modal show={show} onHide={() => setShow(false)}>
      <Modal.Header>
        <Modal.Title>Rename chat room</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="create-chat-users">
          <form onSubmit={(e) => e.preventDefault()}>
            <div className="rename-chat-wrapper">
              <input
                type="text"
                name="chat"
                id="chat"
                value={chatTitle}
                onChange={handleChange}
                placeholder="Rename chat"
              />
              <div>
                <Button
                  className="btn btn-primary px-3 py-3 m-1"
                  type="submit"
                  onClick={handleClick}
                >
                  Rename
                </Button>
                <Button
                  className="btn btn-primary px-3 py-3 m-1"
                  onClick={clearTitle}
                >
                  Clear name
                </Button>
              </div>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
}

RenameChat.propTypes = {
  id: PropTypes.string,
  show: PropTypes.bool,
  setShow: PropTypes.func,
  rename: PropTypes.func,
  chatInfo: PropTypes.any,
};
