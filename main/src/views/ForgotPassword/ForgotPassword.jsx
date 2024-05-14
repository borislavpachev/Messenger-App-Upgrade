import { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../config/firebase-config';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      if (email) {
        await sendPasswordResetEmail(auth, email);
        toast.success('A reset link has been send to your email');
        navigate('/');
      } else {
        toast.error('The email field cannot be empty!');
      }
    } catch (error) {
      if (error.message.includes('not-found')) {
        toast.error('This email does not exist');
      } else {
        toast.error(error.code);
      }
    }
  };

  return (
    <div
      className="background-wrapper w-100 h-100 align-items-center justify-content-center
    p-5"
    >
      <div
        className="transparent-container container justify-content-center align-items-center 
        rounded text-white p-5 w-25"
      >
        <h2 className="text-center">Forgot Password</h2>
        <form
          name="reset-password"
          className="mt-4"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="form-group d-flex flex-column">
            <label htmlFor="email2" className="form-label">
              Email Address:{' '}
            </label>
            <input
              className="form-control"
              type="email"
              id="email2"
              name="email2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-mail"
            />
            <button
              className="btn btn-primary px-5 py-3 mt-4 align-self-center"
              onClick={handleSubmit}
              type="submit"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
