import { sendToClient } from "index";
import { LiveChat } from "youtube-chat";

const connectToYoutube = async (channelId: string) => {
  const client = new LiveChat({ channelId: channelId });

  const ok = await client.start();

  if (!ok) {
    console.log("Failed to start, check emitted error");
    throw new Error("Failed to connect to youtube");
  }

  client.on("chat", (chatItem) => {
    try {
      if (chatItem.message[0]["text"] === undefined) {
        return;
      }

      sendToClient("youtube", channelId, {
        type: "chat",
        message: chatItem.message[0]["text"],
        sender: chatItem.author.name,
        followRole: "1",
        followInfo: "1",
      });
    } catch (error) {
      console.log(error);
    }
  });

  client.on("error", (err) => {
    console.log("youtube error", err);
  });

  return client;
};

export { connectToYoutube };
