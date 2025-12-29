import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    socket.on("join-class", (room) => {
      socket.join(room);
    });
  });

  return io;
};
