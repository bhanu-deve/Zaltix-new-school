import { Server } from "socket.io";
import BusLocation from "./models/BusLocation.js"; // adjust path if needed

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" },
    transports: ["websocket"],
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    /* ================= NOTIFICATIONS ================= */
    socket.on("join-class", (room) => {
      socket.join(room);
    });

    /* ================= BUS TRACKING ================= */
    socket.on("join-bus", (busId) => {
      socket.join(`bus-${busId}`);
    });

    socket.on("bus-location", async ({ busId, latitude, longitude }) => {
      if (!busId || !latitude || !longitude) return;

      // Save latest location (dynamic)
      await BusLocation.findOneAndUpdate(
        { busId },
        { latitude, longitude, updatedAt: new Date() },
        { upsert: true }
      );

      // Broadcast to students
      io.to(`bus-${busId}`).emit("bus-location", {
        busId,
        latitude,
        longitude,
        updatedAt: new Date(),
      });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};
