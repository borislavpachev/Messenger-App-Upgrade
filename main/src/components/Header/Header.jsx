import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import GeneralSearch from '../GeneralSearch/GeneralSearch';
import './Header.css';
import Status from '../Status/Status';
import Button from '../Button/Button';
import ProfilePreview from '../ProfilePreview/ProfilePreview';

export default function Header() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleUserProfileClick = () => {
    setIsModalOpen(true);
  };

  return (
    <header
      className="bg-light d-flex justify-content-between align-items-center
    w-100 py-2 custom-shadow"
    >
      <GeneralSearch/>
      <div className="d-flex m-2 gap-2">
        <Status>Status</Status>
        <div style={{ position: 'relative' }}>
          <Button className="btn btn-primary" onClick={handleUserProfileClick}>
            UserProfile
          </Button>
          {isModalOpen && (
            <div className="user-modal bg-dark rounded m-2">
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
