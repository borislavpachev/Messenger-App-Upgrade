import { useCallback, useContext, useEffect, useState } from 'react';
import DailyIframe from '@daily-co/daily-js';
import { useParams } from 'react-router-dom';
import { AppContext } from '../../context/AppContext'
import { getVideoRoomParticipants, leaveRoom } from '../../services/video.service';

export default function VideoRoom() {
    const { userData } = useContext(AppContext);
    const { chatId } = useParams();

    const fullName = userData ? `${userData.firstName} ${userData.lastName}` : 'Guest';

    const deleteCall = useCallback(async () => {
        try {
            await leaveRoom(chatId);
        } catch (error) {
            console.error(error.message);
        }
    }, [chatId]);

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
            deleteCall().then(() => {
                console.log('Deleted from database');
            }).catch(error => {
                console.error('Error deleting from database:', error);
            });

            window.location.href = `http://127.0.0.1:5173/main/chats/${chatId}`;

        });

        return () => {
            callFrame.off('participant-joined');
            callFrame.destroy();
        };

    }, [chatId, fullName, deleteCall]);

    return (
        <>
            <div id="daily-container"></div>;
        </>
    )
}
