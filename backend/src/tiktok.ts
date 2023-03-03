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

  client.on("gift", (data) => {
    sendToClient("tiktok", state.roomId, {
      type: "event",
      subtype: "gift",
      sender: data.uniqueId,
      followRole: data.followRole,
    });
  });

  client.on("like", (data) => {
    sendToClient("tiktok", state.roomId, {
      type: "event",
      subtype: "like",
      sender: data.uniqueId,
      followRole: data.followRole,
    });

    sendToClient("tiktok", state.roomId, {
      amount: data.totalLikeCount,
      type: "totalLikes",
    });
  });

  client.on("social", (data) => {
    sendToClient("tiktok", state.roomId, {
      type: "event",
      subtype: "follow",
      followRole: data.followRole,
      sender: data.uniqueId,
    });
  });

  client.on("member", (data) => {
    sendToClient("tiktok", state.roomId, {
      type: "event",
      subtype: "join",
      followRole: data.followRole,
      sender: data.uniqueId,
    });
  });

  client.on("roomUser", (data) => {
    sendToClient("tiktok", state.roomId, {
      type: "totalViewers",
      amount: data.viewerCount,
    });
  });

  return { client: client, roomId: state.roomId };
};

export { connectToTiktok };
