import { Client } from 'tmi.js'; // Import the tmi.js client
import {connectToTwitch} from '..src/twitch';

jest.mock('tmi.js', () => {
    // Create a mock implementation of the tmi.js client
    return {
        Client: jest.fn().mockImplementation(() => {
            return {
                connect: jest.fn(), // Mock the connect function
            };
        }),
    };
});

test('connects to Twitch', async () => {
    const client = new Client(); // Create a new client instance
    await connectToTwitch(client); // Call the function to connect to Twitch

    // Verify that the client's connect function was called
    expect(client.connect).toHaveBeenCalled();
});
