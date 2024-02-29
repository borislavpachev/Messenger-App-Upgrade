import { useContext, useState } from "react"
import { getUserByUsername } from "../../../services/users.service";
import SimpleProfilePreview from "../../SimpleProfilePreview/SimpleProfilePreview";
import { createChatRoom } from "../../../services/messages.service";
import { AppContext } from "../../../context/AppContext";
import Button from '../../Button/Button'
import toast from "react-hot-toast";


export default function CreateChatRoom() {
    const { userData } = useContext(AppContext);
    const [chatUsers, setChatUsers] = useState([]);
    const [chatUser, setChatUser] = useState('');

    const handleClick = async () => {
        try {
            const addedUser = await getUserByUsername(chatUser);
            if (!addedUser.exists()) {
                toast.error('User does not exists!');
            } else if (addedUser.val().username === userData.username) {
                toast.error('You are already a participant !');
            } else if (addedUser.exists() && addedUser.val().username !== userData.username) {
                setChatUsers([ ...chatUsers, addedUser.val() ]);
            }
            setChatUser('');
        } catch (error) {
            toast.error(error.code);
        }
    }

    const handleChange = (e) => {
        setChatUser(e.target.value);
    }

    const createChat = async () => {
        const usersUsernames = chatUsers.map((user) => user.username);
        try {

            await createChatRoom([...usersUsernames, userData.username]);
            toast.success('Chat created successfully');
            setChatUsers([]);
        } catch (error) {
            toast.error(error.code);
        }
    }
    return (
        <div className="container bg-primary">
            <h3>create chat room</h3>
            <form onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="user">Add User: </label>
                <input type="text" name="user" id="user" value={chatUser} onChange={handleChange} />
                <Button type="submit" onClick={handleClick}>add user</Button>
            </form>
            <div className="d-flex">
                {
                    chatUsers.map((user) => (<SimpleProfilePreview key={user.uid}
                        username={user.username} />))
                }
            </div>
            <Button onClick={createChat}>create</Button>
        </div>
    )
}