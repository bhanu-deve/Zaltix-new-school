import { io } from "socket.io-client";

export const socket = io("http://192.168.29.241:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
