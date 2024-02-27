import { useState } from "react"
import { sendPasswordResetEmail } from "firebase/auth"
import { auth } from "../../config/firebase-config";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import './ForgotPassword.css';


export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {

        try {
            if (email) {
                await sendPasswordResetEmail(auth, email)
                toast.success('A reset link has been send to your email');
                navigate('/');
            } else {
                toast.error('The email field cannot be empty!')
            }
        } catch (error) {
            if (error.message.includes('not-found')) {
                toast.error('This email does not exist');
            } else {
                toast.error(error.code);
            }

        }
    }

    return (
        <div className="forgot-wrapper">
            <div className="forgot-psw">
                <h2 className="login-header">Forgot Password</h2>
                <form name='reset-password' onSubmit={e => e.preventDefault()}>
                    <div className="form-group mb-2 ">
                        <label className="form-label" htmlFor="email">Email: </label>
                        <input className="form-control" type="email" id="email" name="email"
                            value={email} onChange={(e) => setEmail(e.target.value)} />

                        <button className="login-button" onClick={handleSubmit} type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}