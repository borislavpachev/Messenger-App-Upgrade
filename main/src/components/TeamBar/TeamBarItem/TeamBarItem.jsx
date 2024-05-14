import './TeamBarItem.css';
import PropTypes from 'prop-types';


export default function TeamBarItem({ children, onClick, className }) {
  return (
    <div
      className={`element-container bg-primary opacity-100 d-flex flex-column 
      justify-content-center  align-self-center
        border border-warning align-items-center p-4 m-2 rounded position-relative ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

TeamBarItem.propTypes = {
    children: PropTypes.any,
    onClick: PropTypes.func,
    className: PropTypes.string,
}