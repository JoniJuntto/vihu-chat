import { sendToClient } from "index";
import { LiveChat } from "youtube-chat"


const connectToYoutube = async (channelId: string) => {
    console.log("Connecting to Youtube, " + channelId)
    const liveChat = new LiveChat({ channelId: channelId })
    liveChat.on("chat", (chatItem) => {
        try {
            if(chatItem.message[0]["text"] === undefined){
                return;
            }
            sendToClient("youtube", channelId, {
                type: "chat",
                message: chatItem.message[0]["text"],
                sender: chatItem.author.name,
                followRole: "1",
                followInfo: "1",
                });
        } catch (error) {
            console.log(error)
        }

    })
    liveChat.on("error", (err) => {
        console.log(err)
      })
    const ok = await liveChat.start()
    if (!ok) {
        console.log("Failed to start, check emitted error")
    }
    return {
        client: liveChat,
        roomId: channelId,
    };
}

export { connectToYoutube };