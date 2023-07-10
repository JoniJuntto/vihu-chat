import { Server } from "socket.io";
import { connectToTiktok } from "./tiktok";
import { connectToTwitch } from "./twitch";
import { connectToYoutube } from "./youtube";
import { createServer } from "http";

const connectors = {
  twitch: connectToTwitch,
  tiktok: connectToTiktok,
  youtube: connectToYoutube,
};

interface Client {
  disconnect: () => Promise<void> | void;
  stop?: () => void;
}

interface ServerEntry {
  client: Client;
  clients: Set<string>;
}

const servers = {
  twitch: {} as Record<string, ServerEntry>,
  tiktok: {} as Record<string, ServerEntry>,
  youtube: {} as Record<string, ServerEntry>,
};

type ChannelData = {
  twitch: string;
  tiktok: string;
  youtube: string;
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

  socket.on("register", async (data: ChannelData) => {
    socket.data = {
      twitch: data.twitch,
      tiktok: data.tiktok,
      youtube: data.youtube,
    };

    const errors: Record<string, string> = {
      twitch: "",
      tiktok: "",
      youtube: "",
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
              clients: new Set([socket.id]),
            };
          } else {
            servers[source][channel] = {
              ...servers[source][channel],
              clients: new Set([
                ...servers[source][channel].clients,
                socket.id,
              ]),
            };
          }
        }
      } catch (err) {
        // console.error(
        //   `Failed to connect to ${source} with nickname ${socket.data[source]}`,
        //   err
        // );
        console.error("err", err);
        errors[source] = typeof err === "string" ? err : err.message;
      }
    }

    if (errors.twitch || errors.tiktok || errors.youtube) {
      io.to(socket.id).emit("errors", errors);
    } else {
      io.to(socket.id).emit("success", {
        message: "Successfully connected to all sources",
      });
    }
  });

  socket.on("disconnect", async () => {
    console.log("Client disconnected with id ", socket.id);

    for (const source of Object.keys(socket.data)) {
      for (const channel in servers[source]) {
        const clientsArray = Array.from(
          servers[source][channel].clients
        ) as string[];
        const filtered: string[] = clientsArray.filter(
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
          servers[source][channel].clients = new Set(filtered);
        }
      }
    }
  });
});

interface Message {
  type:
    | "chat"
    | "follow"
    | "host"
    | "raid"
    | "sub"
    | "subgift"
    | "like"
    | "join"
    | "success"
    | "errors";
  message: string;
  sender: string;
  followRole: string;
  followInfo: string;
}

export const sendToClient = (
  source: "tiktok" | "twitch" | "youtube",
  channel: string,
  data: Message
) => {
  console.log("Sending message to client", source, channel, data);
  const clients = servers[source][channel]?.clients;

  try {
    clients.forEach((client: string) =>
      io.to(client).emit(data.type, { ...data, source })
    );
    console.log("Message emitted successfully");
  } catch (error) {
    console.error("Failed to emit message", error);
  }
};
