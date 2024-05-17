import './TeamBarItem.css';
import PropTypes from 'prop-types';

export default function TeamBarItem({ children, onClick, className }) {
  return (
    <div
      className={`teambar-item bg-primary d-flex flex-column text-white
      justify-content-center border border-warning align-items-center 
    rounded position-relative mx-auto my-2 p-3 ${className}`}
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
};
