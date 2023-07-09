import { LiveChat } from "youtube-chat";
import { sendToClient } from "index";

const connectToYoutube = async (channelId: string) => {
  const client = new LiveChat({ channelId: channelId });

  try {
    await client.start();
  } catch (err) {
    if (err.message === "Live Stream was not found") {
      throw "Stream is offline";
    } else {
      throw "Channel not found";
    }
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

  return client;
};

export { connectToYoutube };
