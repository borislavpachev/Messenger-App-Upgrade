import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import './FileUpload.css'

export default function FileUpload({ file, fileName, fileChange, removeFile }) {

    return (
        <div className="uploader-wrapper">
            <label htmlFor="chat-file-upload" className="chat-file-label">
                <FontAwesomeIcon icon={faFileArrowUp} className='file-mini' />
                <span>{fileName ? (`${fileName}`) : null}</span></label>
            <input type="file" id="chat-file-upload" onChange={fileChange} />
            {(!file) ? null :
                <FontAwesomeIcon icon={faCircleXmark} onClick={removeFile}
                    className="remove-file" />
            }
        </div>
    )
}

FileUpload.propTypes = {
    file: PropTypes.any,
    fileName: PropTypes.string,
    fileChange: PropTypes.func,
    removeFile: PropTypes.func,
}