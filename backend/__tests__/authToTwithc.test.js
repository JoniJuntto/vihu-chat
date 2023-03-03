import {authToTwitch} from '../src/twitch'
test('authenticates with the Twitch API', async () => {
    const result = await authToTwitch(); // Call the function to authenticate
    expect(result).toBeDefined(); // Verify that the result is defined
    expect(result.access_token).toBeDefined(); // Verify that the access token is defined
});