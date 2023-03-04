import { connectToTiktok } from "./tiktok";
import { connectToTwitch } from "./twitch";
import { connectToYoutube } from "./youtube";
import { createServer } from "http";
import { Server } from "socket.io";

const connectors = {
  twitch: connectToTwitch,
  tiktok: connectToTiktok,
  youtube: connectToYoutube,
};

const servers = {
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
    socket.data = {
      twitch: data.twitch,
      tiktok: data.tiktok,
      youtube: data.youtube,
    };

    for (const source of Object.keys(socket.data)) {
      try {
        if (socket.data[source]) {
          console.log(
            `Connecting to ${source} with nickname ${socket.data[source]}`
          );
          const channel = socket.data[source];

          if (!servers[source].hasOwnProperty(channel)) {
            const client = await connectors[source](channel);

            servers[source][channel] = {
              client: client,
              clients: [socket.id],
            };
          } else {
            servers[source][channel] = {
              ...servers[source][channel],
              clients: [...servers[source][channel].clients, socket.id],
            };
          }
        }
      } catch (err) {
        console.error(
          `Failed to connect to ${source} with nickname ${socket.data[source]}`,
          err
        );
        io.to(socket.id).emit("err", {
          error: `Failed to connect to ${source} with nickname ${socket.data[source]}`,
        });
      }
    }
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected with id ", socket.id);

    for (const source of Object.keys(socket.data)) {
      for (const channel in servers[source]) {
        const filtered: string[] = servers[source][channel].clients.filter(
          (id: string) => id !== socket.id
        );

        if (filtered.length === 0) {
          switch (source) {
            case "twitch":
              console.log(`Disconnecting from twitch ${channel}`);
              await servers.twitch[channel].client.disconnect();
              break;
            case "tiktok":
              console.log(`Disconnecting from tiktok ${channel}`);
              servers.tiktok[channel].client.disconnect();
              break;
            case "youtube":
              console.log(`Disconnecting from youtube ${channel}`);
              servers.youtube[channel].client.stop();
              break;
            default:
              break;
          }

          delete servers[source][channel];
        } else {
          servers[source][channel].clients = filtered;
        }
      }
    }
  });
});

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
  const clients = servers[source][channel]?.clients;

  console.log("Sending message to clients", data.message, clients);

  try {
    clients.forEach((client: any) =>
      io.to(client).emit(data.type, { ...data, source })
    );
  } catch (error) {
    console.error("Failed to emit message", error);
  }
};
