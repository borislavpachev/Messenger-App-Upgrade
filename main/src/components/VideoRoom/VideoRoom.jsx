import { useEffect } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useParams } from 'react-router-dom';


export default function VideoRoom() {

    const { chatId } = useParams();

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
        callFrame.join({ url: `https://collab-messenger.daily.co/${chatId}` });

        callFrame.on('left-meeting', () => {
            // Redirect to your default link
            window.location.href = `http://127.0.0.1:5173/main/chats/${chatId}`;
        });

        // Cleanup: remove event listener when component unmounts
        return () => {
            callFrame.destroy();
        };



    }, [chatId]);

    return (<div id="daily-container"></div>);
}
