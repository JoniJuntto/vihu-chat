import { Box, Button, Link, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import youtube from "~/assets/youtube.png";
import tiktok from "~/assets/tiktok.png";
import twitch from "~/assets/twitch.png";

import Logo from "~/assets/logo";
import TransparencySlider from "~/components/TransparencySlider";

type message = {
  message: string;
  sender: string;
  source: string;
};

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

function Chat() {
  const [messages, setMessages] = useState<message[]>([]);
  const [channels, setChannels] = useState<Record<string, string>>({
    tiktok: "",
    twitch: "",
    youtube: "",
  });
  const [connectPressed, setConnectPressed] = useState<boolean>(false);
  const [transparency, setTransparency] = useState(50);

  useEffect(() => {
    const channelsString = localStorage.getItem("channels");

    if (channelsString) {
      const channels = JSON.parse(channelsString);

      setChannels(channels);
    }

    socket.on("chat", (data: any) => {
      console.log(data);
      setMessages((messages) => {
        if (messages.length < 6) {
          return [...messages, data];
        } else {
          return [...messages.slice(1), data];
        }
      });
    });

    return () => {
      socket.off("chat");
    };
  }, []);

  const connectBot = async () => {
    localStorage.setItem("channels", JSON.stringify(channels));

    try {
      socket.emit("register", channels);
      setConnectPressed(true);
    } catch (error) {
      console.log(error);
    }
  };

  const renderSwitch = (param: string) => {
    switch (param) {
      case "tiktok":
        return <img src={tiktok} style={{ width: 30, height: 30 }} />;
      case "twitch":
        return <img src={twitch} style={{ width: 30, height: 30 }} />;
      case "youtube":
        return <img src={youtube} style={{ width: 30, height: 30 }} />;
      default:
        return <img src={tiktok} style={{ width: 30, height: 30 }} />;
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: `rgba(38, 38, 42, ${transparency})`,
        borderRadius: "0 0 0 2rem",
        height: "100%",
        display: "flex",
        padding: "2rem",
      }}
    >
      {!connectPressed ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box display={"flex"} justifyContent="center" width={"100%"}>
            <Logo />
          </Box>
          <TransparencySlider setTransparency={setTransparency} />
          <Box textAlign={"start"} margin="0 0 2rem 0">
            <Typography variant="h5">Enter your channel names</Typography>
            <Typography variant="body2">
              Please enter at least one channel name/id
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              margin: "1rem 0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <TextField
                label="TikTok channel name"
                value={channels.tiktok}
                InputLabelProps={{ shrink: true }}
                placeholder="tiktok"
                fullWidth
                onChange={(e) =>
                  setChannels((prev) => ({ ...prev, tiktok: e.target.value.toLowerCase() }))
                }
              />
              <Typography variant="body2">
                For the URL https://www.tiktok.com/@tiktok the channel ID is
                tiktok
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <TextField
                label="Twitch channel name"
                value={channels.twitch}
                placeholder="twitch"
                InputLabelProps={{ shrink: true }}
                fullWidth
                onChange={(e) =>
                  setChannels((prev) => ({ ...prev, twitch: e.target.value.toLowerCase() }))
                }
              />
              <Typography variant="body2">
                For the URL https://www.twitch.tv/twitch the channel ID is
                twitch
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.5rem",
              }}
            >
              <TextField
                label="Youtube channel ID"
                value={channels.youtube}
                placeholder="UlvG2-lrZTJD3DELBsJo9flO"
                InputLabelProps={{ shrink: true }}
                fullWidth
                onChange={(e) =>
                  setChannels((prev) => ({ ...prev, youtube: e.target.value }))
                }
              />
              <Typography variant="body2">
                Youtube channel ID can be found from
                <Link
                  sx={{ margin: "0 0 0 0.5rem" }}
                  target="_blank"
                  href="https://www.youtube.com/account_advanced"
                >
                  here
                </Link>
              </Typography>
            </Box>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={connectBot}
            sx={{
              margin: "auto 0 2rem 0",
            }}
            disabled={Object.keys(channels).every(
              (key: string) => !channels[key]
            )}
          >
            Start the screen
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            overflow: "hidden",
          }}
        >
          <Logo />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
            }}
          >
            {messages.map((message, index) => {
              return (
                <Box
                  key={index + message.sender + message.message}
                  style={{
                    display: "flex",
                    gap: "0.25rem",
                  }}
                >
                  <Box
                    sx={{
                      margin: "0.5rem 0 0 0",
                    }}
                  >
                    {renderSwitch(message.source)}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      textAlign: "start",
                      gap: "0.25rem",
                    }}
                  >
                    <Typography
                      variant="body1"
                      component="span"
                      style={{
                        fontWeight: "bold",
                        color:
                          message.source === "tiktok"
                            ? "#ff0050"
                            : message.source === "twitch"
                            ? "#9146ff"
                            : "#ff0000",
                      }}
                    >
                      {message.sender}
                    </Typography>
                    <Typography variant="body2" component="span">
                      {message.message}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default Chat;
