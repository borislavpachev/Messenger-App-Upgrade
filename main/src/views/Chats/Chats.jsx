import { useState } from "react"
import { getUserByUsername } from "../../services/users.service";
import SimpleProfilePreview from "../../components/SimpleProfilePreview/SimpleProfilePreview";
import { createChatRoom } from "../../services/messages.service";

export default function Chats() {
    const [users, setUsers] = useState([]);
    const [chatUser, setChatUser] = useState('');

    const handleClick = async () => {
        const addedUser = await getUserByUsername(chatUser);

        if (addedUser.exists()) {
            setUsers([...users, addedUser.val()]);
        }
        setChatUser('');
    }
    console.log(users);

    const createChat = async () => {
        await createChatRoom();
    }

    return (
        <div>
            <h1>Chats</h1>
            <div>
                <h3>create chat room</h3>
                <label htmlFor="user">Add User: </label>
                <input type="text" name="user" id="user" value={chatUser} onChange={(e) => setChatUser(e.target.value)} />
                <button type="submit" onClick={handleClick}>add user</button>
                <div>
                    {

                        users.map((user) => (<SimpleProfilePreview key={user.uid}
                            username={user.username} />))

                    }
                </div>
                <button onClick={createChat}>create</button>

            </div>
            <div className="bg-primary text-white w-100 p-3 h-100">

            </div>
            <input type="text" name="message" id="message" />
            <button>send</button>
        </div >
    )
}