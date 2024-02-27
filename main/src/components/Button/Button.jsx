import PropTypes from 'prop-types';

/**
 * 
 * @param {{ children: any, onClick: function, className: string, disabled: boolean }} props 
 * @returns 
 */
export default function Button({ children = null, onClick = () => {}, className = '', disabled = false }) {

  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};