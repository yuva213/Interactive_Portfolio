const { createServer } = require("http");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

const PORT = process.env.PORT || 3001;

// Health check for generic HTTP requests
const httpServer = createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("🚀 Portfolio Realtime Socket Server is Running!\nCheck /socket.io for socket connectivity.\n");
});

const io = new Server(httpServer, {
  cors: {
    origin: ["https://interactive-portfolio-ruddy.vercel.app", "http://localhost:3000", "https://interactive-portfolio-seven.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  allowEIO3: true,
});

// In-memory store
const users = new Map(); // socketId -> user object
const messages = []; // persisted messages

function broadcastUsers() {
  const userList = Array.from(users.values());
  io.emit("users-updated", userList);
}

function getRandomColor() {
  const colors = [
    "#ef4444", "#f97316", "#eab308", "#22c55e",
    "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
    "#60a5fa", "#34d399", "#f472b6", "#fb923c",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

function getRandomAvatar() {
  const avatars = ["bear", "cat", "dog", "fox", "lion", "owl", "panda", "tiger", "wolf", "rabbit"];
  return avatars[Math.floor(Math.random() * avatars.length)];
}

function getRandomName() {
  const adjectives = ["Happy", "Brave", "Swift", "Clever", "Kind"];
  const nouns = ["Panda", "Tiger", "Eagle", "Wolf", "Fox"];
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}`;
}

io.on("connection", (socket) => {
  const { sessionId: existingSessionId } = socket.handshake.auth || {};
  
  // Assign session ID (reuse if provided, else create new)
  const sessionId = existingSessionId || randomUUID();

  // Emit session back to client
  socket.emit("session", { sessionId });

  // Create user
  const user = {
    id: sessionId,
    socketId: socket.id,
    name: getRandomName(),
    avatar: getRandomAvatar(),
    color: getRandomColor(),
    isOnline: "true",
    posX: 0,
    posY: 0,
    location: "India",
    flag: "🇮🇳",
    lastSeen: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  users.set(socket.id, user);
  broadcastUsers();

  // Send existing messages to the newly connected user
  socket.emit("msgs-receive-init", messages);

  console.log(`✅ User connected: ${user.name} [${socket.id}] (session: ${sessionId.slice(0, 8)}...)`);

  // --- Handle cursor movement ---
  socket.on("cursor-change", (data) => {
    const u = users.get(socket.id);
    if (u) {
      u.posX = data.pos.x;
      u.posY = data.pos.y;
    }
    socket.broadcast.emit("cursor-changed", {
      socketId: socket.id,
      pos: data.pos,
    });
  });

  // --- Handle message send ---
  socket.on("msg-send", (data) => {
    const u = users.get(socket.id);
    if (!u) return;

    const msg = {
      id: randomUUID(),
      sessionId: u.id,
      flag: u.flag,
      country: u.location,
      username: u.name,
      avatar: u.avatar,
      color: u.color,
      content: data.content,
      createdAt: new Date().toISOString(),
    };

    messages.push(msg);
    io.emit("msg-receive", msg);
  });

  // --- Handle disconnect ---
  socket.on("disconnect", () => {
    const u = users.get(socket.id);
    if (u) {
      console.log(`❌ User disconnected: ${u.name} [${socket.id}]`);
      users.delete(socket.id);
      broadcastUsers();
    }
  });
});

// --- Start Server ---
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Socket.io server running at http://0.0.0.0:${PORT}`);
});
