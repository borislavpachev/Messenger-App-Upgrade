import logo from '../../constants/logo.png';
import "./WelcomeView.css"
export default function WelcomeView () {
    return (
        <div className="welcome">
            <img src={logo} alt="Logo" />
            <h1 className="welcome-title">Welcome to Connectify</h1>
            <p className="welcome-subtitle">We're glad to have you here.</p>            
        </div>
    )
}
