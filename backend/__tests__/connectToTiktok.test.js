import { WebcastPushConnection } from 'tiktok-live-connector'; // Import the TikTok live connector
import {connectToTikTok } from '../src/tiktok';

jest.mock('tiktok-live-connector', () => {
    // Create a mock implementation of the TikTok live connector
    return {
        WebcastPushConnection: jest.fn().mockImplementation(() => {
            return {
                connect: jest.fn().mockResolvedValue({
                    roomId: 123456, // Mock a successful connection
                }),
            };
        }),
    };
});

test('connects to TikTok', async () => {
    const tiktokLiveConnection = new WebcastPushConnection(); // Create a new connection instance
    const result = await connectToTikTok(tiktokLiveConnection); // Call the function to connect to TikTok

    // Verify that the connection's connect function was called
    expect(tiktokLiveConnection.connect).toHaveBeenCalled();

    // Verify that the result of the connect function was returned
    expect(result).toEqual({ roomId: 123456 });
});
