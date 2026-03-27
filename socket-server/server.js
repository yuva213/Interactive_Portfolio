const { createServer } = require("http");
const { Server } = require("socket.io");
const { randomUUID } = require("crypto");

const PORT = 3001;

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Socket.io server is running\n");
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
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
    name: localStorage_getItem(sessionId, "name") || getRandomName(),
    avatar: localStorage_getItem(sessionId, "avatar") || getRandomAvatar(),
    color: localStorage_getItem(sessionId, "color") || getRandomColor(),
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
  console.log(`   Total online: ${users.size}`);

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

  // --- Handle typing ---
  socket.on("typing-send", (data) => {
    const u = users.get(socket.id);
    socket.broadcast.emit("typing-receive", {
      socketId: socket.id,
      username: u?.name || data.username || "Anonymous",
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

    // Broadcast to ALL clients (including sender)
    io.emit("msg-receive", msg);

    console.log(`💬 [${u.name}]: ${data.content}`);
  });

  // --- Handle profile update ---
  socket.on("update-user", (data) => {
    const u = users.get(socket.id);
    if (!u) return;

    if (data.username) u.name = data.username;
    if (data.avatar) u.avatar = data.avatar;
    if (data.color) u.color = data.color;

    broadcastUsers();
    console.log(`✏️  Profile updated: ${u.name}`);
  });

  // --- Handle disconnect ---
  socket.on("disconnect", () => {
    const u = users.get(socket.id);
    console.log(`❌ User disconnected: ${u?.name || "Unknown"} [${socket.id}]`);
    users.delete(socket.id);
    broadcastUsers();
    console.log(`   Total online: ${users.size}`);
  });
});

// Helper to simulate per-session storage on server side (just use defaults)
function localStorage_getItem(sessionId, key) {
  return null; // server doesn't persist user prefs between sessions
}

httpServer.listen(PORT, () => {
  console.log(`🚀 Socket.io server running at http://localhost:${PORT}`);
  console.log(`   CORS: all origins allowed`);
});
