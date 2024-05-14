import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons';
import { NavLink } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <>
      <div
        className="rounded .bg-secondary-subtle
      align-items-center text-black text-center bg-light
    justify-content-center px-3 py-4 text-center mt-5"
      >
        <h1 className="align-self-center mb-5">Ooops! Page not found!</h1>
        <FontAwesomeIcon icon={faBomb} size="5x" />
        <div className="m-3">
          <NavLink to="/main" className="fs-4">
            Home page
          </NavLink>
        </div>
      </div>
    </>
  );
}
