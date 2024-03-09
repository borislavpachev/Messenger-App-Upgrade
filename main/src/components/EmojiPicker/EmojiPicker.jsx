import Picker from 'emoji-picker-react';
import PropTypes from 'prop-types';


export default function EmojiPicker({ onEmojiSelect }) {
    return (
        <div className='emoji-picker'>
            <Picker onEmojiClick={onEmojiSelect} />
        </div>
    )
}

EmojiPicker.propTypes = {
    onEmojiSelect: PropTypes.func,
}