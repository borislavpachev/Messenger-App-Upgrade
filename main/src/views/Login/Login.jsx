import { useContext, useEffect, useState } from 'react';
import { loginUser } from '../../services/auth.service';
import { AppContext } from '../../context/AppContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';
import './Login.css'

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
      navigate(location.state?.from.pathname || '/main');
    }
  }, [user]);

  const updateForm = (prop) => (e) => {
    setForm({ ...form, [prop]: e.target.value });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      login();
    }
  };

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
  };

  return (
    <div
      className="background-wrapper w-100 h-100 align-items-center justify-content-center
    p-5"
    >
      <div
        className="container transparent-container justify-content-center 
        align-items-center w-25 rounded text-white px-4 py-4"
      >
        <h1 className="text-center mb-4">User Login</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group mb-3">
            <label htmlFor="email" className="form-label">
              Your e-mail:
            </label>
            <input
              autoComplete="off"
              className="form-control"
              type="email"
              name="email"
              id="email"
              value={form.email}
              onChange={updateForm('email')}
              placeholder="Email"
              onKeyDown={handleKeyPress}
            />
          </div>
          <div className="form-group mb-3">
            <label htmlFor="password" className="form-label">
              Password:{' '}
            </label>
            <div className="input-group">
              <input
                autoComplete="off"
                className="form-control"
                type={showPassword ? 'text' : 'password'}
                name="password"
                id="password"
                value={form.password}
                onChange={updateForm('password')}
                placeholder="Password"
                onKeyDown={handleKeyPress}
              />
              <span
                className="input-group-text"
                onClick={() => setShowPassword(!showPassword)}
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
          </div>
        </form>
        <div className="container d-flex flex-column">
          <Link
            className=" text-decoration-underline ms-auto"
            to="/forgot-password"
          >
            Forgot password?
          </Link>
          <button
            type="submit"
            onClick={login}
            className="btn btn-primary m-3 py-2"
          >
            Login
          </button>

          <p className="m-1">
            Don`t have an account ?
            <Link
              className="text-decoration-underline m-1"
              to="/create-account"
            >
              {' '}
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
