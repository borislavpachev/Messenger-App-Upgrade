import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBomb } from '@fortawesome/free-solid-svg-icons';

export default function ErrorPage() {
  return (
    <div
      className="container rounded .bg-secondary-subtle
      align-items-center text-black bg-light
    justify-content-center px-3 py-4 text-center mt-5"
    >
      <h1 className="align-self-center mb-5">Ooops! Page not found!</h1>
      <FontAwesomeIcon icon={faBomb} size='5x'/>
    </div>
  );
}
