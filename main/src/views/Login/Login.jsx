import { useContext, useEffect, useState } from "react";
import { loginUser } from "../../services/auth.service";
import { AppContext } from "../../context/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import "./Login.css"

export default function Login() {
    const { user, setAppState } = useContext(AppContext);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (user) {
            navigate(location.state?.from.pathname || '/')
        }
    }, [user]);

    const updateForm = prop => e => {
        setForm({ ...form, [prop]: e.target.value });
    }

    const login = async () => {
        if (form.email.length === 0) {
            toast.error('Email cannot be empty');
        } else if (form.password.length < 6) {
            toast.error('Password must be at least 6 characters');
        } else {

            try {
                const userCredentials = await loginUser(form.email, form.password);
                setAppState({ user: userCredentials.user, userData: null });
            } catch (error) {
                if (error.message.includes('auth/')) {
                    toast.error('Username or password do not match.');
                } else {
                    toast.error('Something went wrong! Please try again.');
                }
            }
        }
    }

    return (
        <div className="background-wrapper">
            <div className="login">
                <h1 className="login-header">User Login</h1>
                <form onSubmit={e => e.preventDefault()}>
                    <div className="form-group mb-2 ">
                        <label htmlFor="email" className="form-label">Your e-mail: </label>
                        <input autoComplete="off" className="form-control" type="email" name="email" id="email" value={form.email}
                            onChange={updateForm('email')} />
                    </div>
                    <div className="form-group mb-1">
                        <label htmlFor="password" className="form-label">Password: </label>
                        <input autoComplete="off" className="form-control"
                            type={showPassword ? 'text' : 'password'} name="password" id="password"
                            value={form.password}
                            onChange={updateForm('password')}
                        />
                        <span className="password-span"><FontAwesomeIcon
                            onClick={() => setShowPassword(!showPassword)}
                            icon={showPassword ? faEye : faEyeSlash} />
                        </span>
                    </div>
                    <Link className='forgot-password' to='/forgot-password'>Forgot password?</Link>
                    <button type="submit" onClick={login} className="login-button">Login</button>
                    <br />
                    <p className="mb-2">Don`t have an account ?<Link className="sign-up" to='/create-account'> Sign up</Link></p>
                </form>
            </div >
        </div>
    )
}