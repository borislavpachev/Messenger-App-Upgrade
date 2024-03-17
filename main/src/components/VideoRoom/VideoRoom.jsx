import { useContext, useEffect } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext'

export default function VideoRoom() {
    const { userData } = useContext(AppContext);
    const { chatId } = useParams();

    const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'Guest';

    useEffect(() => {
        const callFrame = DailyIframe.createFrame({
            iframeStyle: {
                position: 'fixed',
                top: '0px',
                left: '0px',
                width: '100%',
                height: '100%'
            },
            showLeaveButton: true,
        });

        callFrame.join({ url: `https://collab-messenger.daily.co/${chatId}`, userName: fullName });

        callFrame.on('left-meeting', () => {

            window.location.href = `http://127.0.0.1:5173/main/chats/${chatId}`;
        });

        return () => {
            callFrame.off('participant-joined');
            callFrame.off('participant-left');
            callFrame.destroy();
        };

    }, [chatId, fullName]);

    return (<div id="daily-container"></div>);
}
