import { useContext, useState } from "react";
import Button from "../../Button/Button";
import { AppContext } from "../../../context/AppContext";

export default function ChatInput() {
    const { userData } = useContext(AppContext);
    const [message, setMessage] = useState('');

    const sendMessage = async () => {

    }

    const handleChange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <div>
            <form onSubmit={e => e.preventDefault()}>
                <input type="text" name="message" id="message" value={message}
                    onChange={handleChange} />
                <Button type='submit'>send</Button>
            </form>
        </div>
    )
}