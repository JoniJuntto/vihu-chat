import { WebcastPushConnection } from "tiktok-live-connector";
import { sendToClient } from "./index";

const connectToTiktok = async (tiktokUsername: string) => {
  let client = new WebcastPushConnection(tiktokUsername);

  try {
    await client.connect();
  } catch (err) {
    if (
      err.message ===
      "Failed to retrieve room_id from page source. User might be offline."
    ) {
      throw "User not found";
    } else {
      throw "User is not in live";
    }
  }

  client.on("chat", (data) => {
    sendToClient("tiktok", tiktokUsername, {
      type: "chat",
      message: data.comment,
      sender: data.uniqueId,
      followRole: data.followRole,
      followInfo: data.followInfo.followerCount,
    });
  });

  return client;
};

export { connectToTiktok };
