import { connectToTiktok } from "./tiktok";
import { connectToTwitch } from "./twitch";
import { connectToYoutube } from "./youtube";
import { createServer } from "http";
import { Server } from "socket.io";

const clients = {
  twitch: {},
  tiktok: {},
  youtube: {},
};

const httpServer = createServer();
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: "*",
  },
});

httpServer.listen(8000);

httpServer.on("listening", () => {
  console.log("Server started successfully");
});

io.on("connection", (socket) => {
  console.log("Client connected with id ", socket.id);

  socket.on("register", async (data: any) => {
    const { twitchNickname, tiktokNickname, youtubeClientId } = data;
    try {
      const twitch = await connectToTwitch(twitchNickname);
      const tiktok = await connectToTiktok(tiktokNickname);
      const youtube = await connectToYoutube(youtubeClientId);

      if (twitch) {
        const twitchClients = clients.twitch[twitch.roomId];
        clients.twitch[twitch.roomId] = [
          ...(twitchClients ? twitchClients : []),
          socket.id,
        ];
      }
      if (tiktok) {
        const tiktokClients = clients.tiktok[tiktok.roomId];
        clients.tiktok[tiktok.roomId] = [
          ...(tiktokClients ? tiktokClients : []),
          socket.id,
        ];
      }
      if (youtube) {
        const youtubeClients = clients.youtube[youtube.roomId];
        clients.youtube[youtube.roomId] = [
          ...(youtubeClients ? youtubeClients : []),
          socket.id,
        ];
      }

      socket.on("disconnect", async () => {
        console.log("Client disconnected with id ", socket.id);
        for (const source in clients) {
          for (const channel in clients[source]) {
            const filtered: string[] = clients[source][channel].filter(
              (id: string) => id !== socket.id
            );

            if (filtered.length === 0) {
              delete clients[source][channel];
              switch (source) {
                case "twitch":
                  console.log(`Disconnecting from twitch ${channel}`);
                  await twitch.client.disconnect();
                  break;
                case "tiktok":
                  console.log(`Disconnecting from tiktok ${channel}`);
                  tiktok.client.disconnect();
                  break;
                case "youtube":
                  console.log(`Disconnecting from youtube ${channel}`);
                  youtube.client.stop();
                  break;
                default:
                  break;
              }
            } else {
              clients[source][channel] = filtered;
            }
          }
        }
      });
    } catch (err) {
      io.to(socket.id).emit("err", {
        error: "twitch or tiktok connection failed",
      });
    }
  });
});

const getClientByChannelName = (source: string, channel: string) => {
  return clients[source][channel];
};

interface Message {
  type: "chat";
  message: string;
  sender: string;
  followRole: string;
  followInfo: string;
}

export const sendToClient = (
  source: string,
  channel: string,
  data: Message
) => {
  const clients = getClientByChannelName(source, channel);
  try {
    clients.forEach((client: any) =>
      io.to(client).emit(data.type, { ...data, source })
    );
  } catch (error) {}
};
