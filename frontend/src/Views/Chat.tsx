import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  CircularProgress,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import { useCallback, useEffect, useRef, useState } from "react";

import { LoadingButton } from "@mui/lab";
import Logo from "~/assets/logo";
import ProgressCircle from "~/components/ProgressCircle";
import TransparencySlider from "~/components/TransparencySlider";
import { io } from "socket.io-client";
import tiktok from "~/assets/tiktok.png";
import twitch from "~/assets/twitch.png";
import youtube from "~/assets/youtube.png";

type message = {
  message: string;
  sender: string;
  source: string;
};

const socket = io(import.meta.env.VITE_SOCKET_URL as string);

function Chat() {
  const [messages, setMessages] = useState<message[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({
    tiktok: "",
    twitch: "",
    youtube: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [followCount, setFollowCount] = useState(0);
  const [latestFollow, setLatestFollow] = useState("");
  const [channels, setChannels] = useState<Record<string, string>>({
    tiktok: "",
    twitch: "",
    youtube: "",
  });
  const [transparency, setTransparency] = useState(50);
  const [connected, setConnected] = useState<boolean>(false);
  const [likes, setLikes] = useState(0);
  const [latestLike, setLatestLike] = useState("");
  const [showFollowers, setShowFollowers] = useState(false);
  const [showLikes, setShowLikes] = useState(false);
  const [followGoal, setFollowGoal] = useState<number>(1);
  const [likesGoal, setLikesGoal] = useState<number>(1);

  const followProgress = (followCount / followGoal) * 100;
  const likeProgress = (likes / likesGoal) * 100;
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const channelsString = localStorage.getItem("channels");
    if (channelsString) {
      try {
        const channels = JSON.parse(channelsString);
        setChannels(channels);
      } catch (error) {
        console.log(error);
      }
    }

    socket.on("chat", (data: any) => {
      setMessages((messages) => {
        if (messages.length < 6) {
          return [...messages, data];
        } else {
          return [...messages.slice(1), data];
        }
      });
    });
    socket.on("follow", (data: any) => {
      setFollowCount((count) => count + 1);
      setLatestFollow(data.sender);
      toast.success(`${data.sender} Just followed`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    });

    socket.on("like", (data: any) => {
      console.log(data);
      setLikes((count) => count + 1);
      setLatestLike(data.sender);
      toast.success(`${data.sender} just liked!`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: likeProgress,
        theme: "dark",
      });
    });

    socket.on("errors", (data: any) => {
      setErrors(data);
      setLoading(false);
    });

    socket.on("success", () => {
      setErrors({
        tiktok: "",
        twitch: "",
        youtube: "",
      });
      setLoading(false);
      setConnected(true);
    });

    return () => {
      socket.off("chat");
      socket.off("follow");
      socket.off("like");
    };
  }, []);

  const connectBot = useCallback(async () => {
    localStorage.setItem("channels", JSON.stringify(channels));

    try {
      socket.emit("register", channels);
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
  }, [channels]);

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

  const handleChange = (value: string, type: string) => {
    if (type === "likes") {
      setShowLikes(true);
      setLikesGoal(parseInt(value));
    } else {
      setShowFollowers(true);
      setFollowGoal(parseInt(value));
    }
  };

  const createToast = () => {
    toast.success("Hello", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  return (
    <Box
      sx={{
        backgroundColor: `rgba(38, 38, 42, ${transparency})`,
        borderRadius: "0 0 0 2rem",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        padding: "2rem",
        minWidth: 500,
        overflow: "auto",
      }}
      ref={chatBoxRef}
    >
      {!connected ? (
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
          <Box>
            <Typography variant="h5" textAlign="center">
              Turn on widgets
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Box
                sx={{ flexDirection: "column", marginRight: 5, marginTop: 5 }}
              >
                <Typography variant="body2" textAlign="center">
                  Followers
                </Typography>
                <TextField
                  label="Goal"
                  type="number"
                  sx={{ width: 100, marginTop: 3 }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: "0.8rem" },
                  }}
                  onChange={(e) => handleChange(e.target.value, "followers")}
                />
              </Box>
              <Box
                sx={{ flexDirection: "column", marginLeft: 5, marginTop: 5 }}
              >
                <Typography variant="body2" textAlign="center">
                  Likes
                </Typography>
                <TextField
                  label="Goal"
                  type="number"
                  sx={{ width: 100, marginTop: 3 }}
                  InputLabelProps={{
                    shrink: true,
                    sx: { fontSize: "0.8rem" },
                  }}
                  onChange={(e) => handleChange(e.target.value, "likes")}
                />
              </Box>
            </Box>
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
                error={errors.tiktok !== ""}
                helperText={errors.tiktok}
                fullWidth
                onChange={(e) =>
                  setChannels((prev) => ({
                    ...prev,
                    tiktok: e.target.value.toLowerCase(),
                  }))
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
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <TextField
                label="Twitch channel name"
                value={channels.twitch}
                placeholder="twitch"
                InputLabelProps={{ shrink: true }}
                error={errors.twitch !== ""}
                helperText={errors.twitch}
                fullWidth
                onChange={(e) =>
                  setChannels((prev) => ({
                    ...prev,
                    twitch: e.target.value.toLowerCase(),
                  }))
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
                error={errors.youtube !== ""}
                helperText={errors.youtube}
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
          <LoadingButton
            variant="contained"
            fullWidth
            loading={loading}
            onClick={connectBot}
            loadingIndicator={
              <CircularProgress
                size={24}
                sx={{
                  color: "white",
                }}
              />
            }
            sx={{
              margin: "auto 0 2rem 0",
              color: "white",
            }}
            disabled={Object.keys(channels).every(
              (key: string) => !channels[key]
            )}
          >
            Start the screen
          </LoadingButton>
        </Box>
      ) : (
        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              {showLikes && (
                <ProgressCircle
                  latest={latestLike}
                  progress={likeProgress}
                  type="Like"
                />
              )}
            </div>

            <div>
              {showFollowers && (
                <ProgressCircle
                  latest={latestFollow}
                  progress={followProgress}
                  type="Follow"
                />
              )}
            </div>
          </div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
              wordBreak: "break-all",
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
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        theme="dark"
        limit={3}
        style={{ width: "40%" }}
      />
    </Box>
  );
}

export default Chat;
