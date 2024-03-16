import {apiKey} from '../constants/daily.js'

export const createDailyRoom = async (chatId) => {
    const url = `https://api.daily.co/v1/rooms`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                privacy: 'public',
                name: `${chatId}`,
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create Daily.co room');
        }

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('Error creating Daily.co room:', error);
        throw error;
    }
};


