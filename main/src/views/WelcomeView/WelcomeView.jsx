import logo from '../../constants/logo.png';
export default function WelcomeView() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center
        text-white w-100"
    >
      <img src={logo} alt="Logo" className="mb-auto" />
      <h1 className="text-secondary mt-auto">Welcome to Connectify</h1>
      <p>We`re glad to have you here.</p>
    </div>
  );
}
