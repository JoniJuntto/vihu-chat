import { client as twitchClient } from "tmi.js";
import { sendToClient } from "./index";

const connectToTwitch = async (channelName: string) => {
  console.log("Connecting to Twitch, " + channelName);

  const client = new twitchClient({
    options: { debug: false },
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channelName],
  });

  try {
    await client.connect();
  } catch (error) {
    return undefined;
  }

  client.on("message", async (channel, tags, message, self) => {
    if (self) return;
    sendToClient("twitch", channel.substring(1), {
      type: "chat",
      message: message,
      sender: tags.username,
      followRole: "1",
      followInfo: "1",
    });
  });

  return {
    client: client,
    roomId: channelName,
  };
};

export { connectToTwitch };
