import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID,
  key: "346be3adedc0a307d4e3",
  secret: process.env.PUSHER_SECRET,
  cluster: "ap4",
  useTLS: true,
});

export const pusherClient = new PusherClient("346be3adedc0a307d4e3", {
  cluster: "ap4",
});
