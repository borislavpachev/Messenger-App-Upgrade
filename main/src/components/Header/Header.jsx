import 'bootstrap/dist/css/bootstrap.min.css';
import { useContext, useState } from 'react';
import GeneralSearch from '../GeneralSearch/GeneralSearch';
import Status from '../Status/Status';
import Button from '../Button/Button';
import ProfilePreview from '../ProfilePreview/ProfilePreview';
import { AppContext } from '../../context/AppContext';
import PropTypes from 'prop-types';
import './Header.css';

export default function Header({ toggleTheme }) {
  const { theme } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleUserProfileClick = () => {
    setIsModalOpen(true);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    if (darkMode) {
      toggleTheme('dark');
    } else {
      toggleTheme('primary-subtle');
    }
  };

  return (
    <header
      className="bg-light d-flex justify-content-between align-items-center
    w-100 custom-shadow"
    >
      <GeneralSearch />
      <div className="d-flex m-2 gap-2 align-items-center">
        <div
          className="form-check form-switch m-2 py-2 rounded
        align-items-center  justify-content-center"
        >
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="theme-switch"
            onChange={handleThemeToggle}
          />
          <label className="form-check-label" htmlFor="theme-switch">
            {theme === 'primary-subtle' ? 'Light' : 'Dark'}
          </label>
        </div>
        <Status>Status</Status>
        <div style={{ position: 'relative' }}>
          <Button className="btn btn-primary" onClick={handleUserProfileClick}>
            UserProfile
          </Button>
          {isModalOpen && (
            <div
              className="user-modal bg-warning-subtle rounded mt-4"
            >
              <Button
                className="btn btn-danger m-3"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
              <ProfilePreview />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

Header.propTypes = {
  toggleTheme: PropTypes.func,
};
