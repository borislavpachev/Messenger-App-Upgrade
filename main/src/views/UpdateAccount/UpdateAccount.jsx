import { useContext, useState } from 'react';
import { AppContext } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './UpdateAccount.css';
import { updateUser } from '../../services/users.service';
import { updateEmail, updatePassword } from 'firebase/auth';
import { logoutUser } from '../../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

export default function UpdateAccount() {
  const { user, userData, setAppState } = useContext(AppContext);
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [form, setForm] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phoneNumber: userData.phoneNumber,
    password: '',
    confirmPassword: '',
  });
  const navigate = useNavigate();

  const updateForm = (prop) => (e) => {
    setForm({ ...form, [prop]: e.target.value });
  };

  const updateUserProfile = async () => {
    try {
      if (
        form.confirmPassword.length &&
        form.password === form.confirmPassword
      ) {
        await updatePassword(user, form.confirmPassword);
        const interval = setInterval(() => {
          toast.success('Password has been changed successfully!');
        }, 200);
        setTimeout(() => {
          clearInterval(interval);
        }, 400);
        await logoutUser();
      }
      form.email !== userData.email
        ? await updateEmail(user, form.email)
        : null;
      await updateUser(
        userData.username,
        form.firstName,
        form.lastName,
        form.email,
        userData.uid,
        form.phoneNumber
      );
      setAppState({ user: null, userData: null });
      await logoutUser();
      const interval = setInterval(() => {
        toast.success('Account updated successfully!');
      }, 100);
      setTimeout(() => {
        clearInterval(interval);
      }, 300);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div
        className="container align-items-center justify-content-center
      rounded bg-dark text-white p-4 mt-3 w-25"
      >
        <h2 className="mb-3 text-center">Update Account</h2>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group mb-2 ">
            <label className="form-label" htmlFor="username">
              Username:{' '}
            </label>
            <input
              readOnly
              disabled
              autoComplete="off"
              className="form-control"
              type="text"
              name="username"
              id="username"
              value={userData.username}
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
            />
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
            />
          </div>

          <div className="form-group mb-2 ">
            <label className="form-label" htmlFor="phone-number">
              Phone Number:{' '}
            </label>
            <input
              autoComplete="off"
              className="form-control"
              type="text"
              name="phone"
              id="phone-number"
              value={form.phoneNumber}
              onChange={updateForm('phoneNumber')}
            />
          </div>

          <hr className="hr-line" />
          <div className="form-group mb-2 ">
            <label className="form-label" htmlFor="password1">
              New password:{' '}
            </label>
            <div className="input-group">
              <input
                autoComplete="off"
                className="form-control"
                type={showPassword.password ? 'text' : 'password'}
                name="password"
                id="password1"
                value={form.password}
                onChange={updateForm('password')}
                placeholder="Password"
              />
              <span
                className="input-group-text"
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    password: !showPassword.password,
                  })
                }
              >
                <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
              </span>
            </div>
            
          </div>
          <div className="form-group mb-2 ">
            <label className="form-label" htmlFor="confirm-password">
              Confirm password:{' '}
            </label>
            <div className="input-group">
            <input
              autoComplete="off"
              className="form-control"
              type={showPassword.confirmPassword ? 'text' : 'password'}
              name="confirm-password"
              id="confirm-password"
              value={form.confirmPassword}
              onChange={updateForm('confirmPassword')}
              placeholder='Confirm Password'
            />
            <span className="input-group-text">
              <FontAwesomeIcon
                onClick={() =>
                  setShowPassword({
                    ...showPassword,
                    confirmPassword: !showPassword.confirmPassword,
                  })
                }
                icon={showPassword.confirmPassword ? faEye : faEyeSlash}
              />
            </span>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <button
              type="submit"
              className="btn btn-primary px-5 py-3 mt-2 justify-self-center"
              onClick={updateUserProfile}
            >
              Update account
            </button>
          </div>
        </form>{' '}
      </div>
    </div>
  );
}
