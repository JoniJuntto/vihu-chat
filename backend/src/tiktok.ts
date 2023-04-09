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
    console.log("chat");
    sendToClient("tiktok", tiktokUsername, {
      type: "chat",
      message: data.comment,
      sender: data.nickname,
      followRole: data.followRole,
      followInfo: data.followInfo.followerCount,
    });
  });

  client.on("like", (data) => {
    try {
      console.log(
        `${data.uniqueId} sent ${data.likeCount} likes, total likes: ${data.totalLikeCount}`
      );
      sendToClient("tiktok", tiktokUsername, {
        type: "like",
        message: "New like!",
        sender: data.nickname,
        followRole: data.followRole,
        followInfo: data.followInfo.followerCount,
      });
    } catch (e) {
      console.log(e);
    }
  });
  client.on("member", (data) => {
    console.log(`${data.uniqueId} joins the stream!`);
  });

  client.on("roomUser", (data) => {
    console.log(`Viewer Count: ${data.viewerCount}`);
  });

  client.on("social", (data) => {
    sendToClient("tiktok", tiktokUsername, {
      type: "follow",
      message: "New follower!",
      sender: data.nickname,
      followRole: data.followRole,
      followInfo: data.followInfo.followerCount,
    });
  });

  client.on("gift", (data) => {
    if (data.giftType === 1 && !data.repeatEnd) {
      // Streak in progress => show only temporary
      console.log(
        `${data.uniqueId} is sending gift ${data.giftName} x${data.repeatCount}`
      );
    } else {
      console.log(
        `${data.uniqueId} has sent gift ${data.giftName} x${data.repeatCount}`
      );
    }
  });

  return client;
};

export { connectToTiktok };
