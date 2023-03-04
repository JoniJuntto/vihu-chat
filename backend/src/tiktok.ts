import { WebcastPushConnection } from "tiktok-live-connector";

import { sendToClient } from "./index";

const connectToTiktok = async (tiktokUsername: string) => {
  let client = new WebcastPushConnection(tiktokUsername);

  await client.connect();

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
