/* 
sendToClient message data = 
{
    message: String, // MESSAGE TO BE SENT TO CLIENT
    sender: String, // NAME OF SENDER
    source: String, // SOURCE OF MESSAGE (TWITCH, TIKTOK, ETC.)
    isEvent: Boolean, // IS THIS AN EVENT MESSAGE?
    followRole: String, //ROLE OF FOLLOWER
    followInfo: Object // INFO ABOUT FOLLOWER
}
*/

const sendToClient = (message, sender, source, isEvent, followRole, followInfo, wsServer) => {
    const data = JSON.stringify({ message, sender, source, isEvent, followRole, followInfo });
    wsServer.clients.forEach(client => client.send(data));
}

const sendTotalLikesToClient = (totalLikeCount) => {
    const data = JSON.stringify({ totalLikeCount, isTotalLikeCount: true });
    wsServer.clients.forEach(client => client.send(data));
}

const sendTopFans = (viewerCount) => {
    const data = JSON.stringify({ viewerCount, isViewerCount: true });
    wsServer.clients.forEach(client => client.send(data));
}

const sendTwitchViewers = (viewers) => {
    const data = JSON.stringify({ viewers, isTwitchViewers: true });
    wsServer.clients.forEach(client => client.send(data));
}

export { sendToClient, sendTotalLikesToClient, sendTopFans, sendTwitchViewers };