import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { createUser, getUserByUsername } from '../../services/users.service';
import { registerUser } from '../../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import toast from 'react-hot-toast';

export default function CreateAccount() {
  const { setAppState } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    photoURL: '',
    status: 'offline',
  });
  const navigate = useNavigate();

  const updateForm = (prop) => (e) => {
    setForm({ ...form, [prop]: e.target.value });
  };

  const createUserProfile = async () => {
    const {
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      photoURL,
      status,
    } = form;

    if (username.length === 0) {
      toast.error('Username cannot be empty');
      return;
    } else if (email.length === 0) {
      toast.error('Email cannot be empty');
      return;
    } else if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    } else if (firstName.length < 4 || firstName.length > 32) {
      toast.error('First name must be between 4 and 32 characters');
      return;
    } else if (lastName.length < 4 || lastName.length > 32) {
      toast.error('Last name must be between 4 and 32 characters');
      return;
    } else {
      try {
        const user = await getUserByUsername(username);
        if (user.exists()) {
          toast.error('Username already exists');
          return;
        }

        const userCredentials = await registerUser(email, password);

        await createUser(
          username,
          firstName,
          lastName,
          email,
          userCredentials.user.uid,
          phoneNumber,
          photoURL,
          status
        );

        setAppState({ user, userData: null });
        navigate('/main');
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  return (
    <div
      className="container w-25 text-white bg-dark p-4 mt-5 rounded
    justify-content-center align-items-center"
    >
      <h1 className="text-center mb-3">Create Account</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form-group mb-2 ">
          <label className="form-label" htmlFor="username">
            Username:{' '}
          </label>
          <input
            autoComplete="off"
            className="form-control"
            type="text"
            name="username"
            id="username"
            value={form.username}
            onChange={updateForm('username')}
            placeholder="Username"
          />
        </div>
        <div className="form-group mb-2 ">
          <label className="form-label" htmlFor="email">
            Your e-mail:{' '}
          </label>
          <input
            autoComplete="off"
            className="form-control"
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={updateForm('email')}
            placeholder="E-mail"

          />
        </div>
        <div className="form-group mb-2">
          <label className="form-label" htmlFor="password">
            Password:{' '}
          </label>
          <input
            autoComplete="off"
            className="form-control"
            type={showPassword ? 'text' : 'password'}
            name="password"
            id="password"
            value={form.password}
            onChange={updateForm('password')}
            placeholder="Password"
          />
          <span className="password-span">
            <FontAwesomeIcon
              onClick={() => setShowPassword(!showPassword)}
              icon={showPassword ? faEye : faEyeSlash}
            />
          </span>
        </div>
        <div className="form-group mb-2 ">
          <label className="form-label" htmlFor="first-name">
            First Name:{' '}
          </label>
          <input
            autoComplete="off"
            className="form-control"
            type="text"
            name="first-name"
            id="first-name"
            value={form.firstName}
            onChange={updateForm('firstName')}
            placeholder="First name"
          />
        </div>
        <div className="form-group mb-2 ">
          <label className="form-label" htmlFor="last-name">
            Last Name:{' '}
          </label>
          <input
            autoComplete="off"
            className="form-control"
            type="text"
            name="last-name"
            id="last-name"
            value={form.lastName}
            onChange={updateForm('lastName')}
            placeholder="Last name"
          />
        </div>
        <div className="d-flex align-items-center justify-content-center">
          <button
            type="submit"
            className="btn btn-primary mb-2 m-3 py-3 align-self-center"
            onClick={createUserProfile}
          >
            Create account
          </button>
        </div>
      </form>
    </div>
  );
}
