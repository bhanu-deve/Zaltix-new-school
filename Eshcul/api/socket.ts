import { io } from "socket.io-client";

export const socket = io("http://20.204.205.244:3000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});


// import { API_URL } from "./config";
// import { io } from "socket.io-client";

// export const socket = io(API_URL, {
//   transports: ["websocket"],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });
