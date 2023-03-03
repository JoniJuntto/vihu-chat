import { WebcastPushConnection } from "tiktok-live-connector";

import { sendToClient } from "./index";

const connectToTiktok = async (tiktokUsername: string) => {
  let client = new WebcastPushConnection(tiktokUsername);
  let state = null;

  try {
    state = await client.connect();
    console.info(`Connected to roomId ${state.roomId}`);
  } catch (err) {
    return undefined;
  }

  client.on("chat", (data) => {
    sendToClient("tiktok", state.roomId, {
      type: "chat",
      message: data.comment,
      sender: data.uniqueId,
      followRole: data.followRole,
      followInfo: data.followInfo.followerCount,
    });
  });
  
  return { client: client, roomId: state.roomId };
};

export { connectToTiktok };
