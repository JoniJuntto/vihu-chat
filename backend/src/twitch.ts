import { client as twitchClient } from "tmi.js";
import { sendToClient } from "./index";

const connectToTwitch = async (channelName: string) => {
  const client = new twitchClient({
    options: { debug: false },
    connection: {
      secure: true,
      reconnect: true,
    },
    channels: [channelName],
  });

  await client.connect();

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

  return client;
};

export { connectToTwitch };
