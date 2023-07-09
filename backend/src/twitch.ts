import { sendToClient } from "./index";
import { client as twitchClient } from "tmi.js";

const connectToTwitch = async (channelName: string) => {
  const client = new twitchClient({
    options: { debug: false },
    connection: {
      secure: true,
      reconnect: true,
    },
  });

  await client.connect();

  try {
    await client.join(channelName);
  } catch {
    throw "Channel not found";
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

  return client;
};

export { connectToTwitch };
