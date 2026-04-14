const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;

app.use(express.static('src'));

const users = new Map();
const requests = new Map();

function getPublicUsers() {
  return Array.from(users.entries()).map(([id, user]) => ({
    id,
    name: user.name,
    email: user.email,
    online: user.socket.readyState === 1
  }));
}

function send(socket, type, payload = {}) {
  if (socket.readyState === 1) {
    socket.send(JSON.stringify({ type, payload }));
  }
}

function broadcastUsers() {
  const allUsers = getPublicUsers();
  for (const { socket } of users.values()) {
    send(socket, 'users:list', { users: allUsers });
  }
}

wss.on('connection', (socket) => {
  let currentUserId = null;

  socket.on('message', (raw) => {
    let msg;
    try {
      msg = JSON.parse(raw.toString());
    } catch {
      return;
    }

    const { type, payload } = msg;

    if (type === 'auth:register') {
      const { id, name, email } = payload;
      if (!id || !name || !email) return;

      users.set(id, { id, name, email, socket });
      currentUserId = id;
      if (!requests.has(id)) requests.set(id, []);
      send(socket, 'auth:ok', { id, pendingRequests: requests.get(id) });
      broadcastUsers();
      return;
    }

    if (!currentUserId) return;

    if (type === 'request:connect') {
      const { toUserId } = payload;
      const fromUser = users.get(currentUserId);
      if (!users.has(toUserId) || toUserId === currentUserId) return;

      const queue = requests.get(toUserId) || [];
      queue.push({ fromUserId: currentUserId, fromName: fromUser.name, email: fromUser.email, at: Date.now() });
      requests.set(toUserId, queue);

      const toSocket = users.get(toUserId).socket;
      send(toSocket, 'request:incoming', { fromUserId: currentUserId, fromName: fromUser.name, email: fromUser.email });
      return;
    }

    if (type === 'request:decision') {
      const { fromUserId, accepted } = payload;
      const myQueue = requests.get(currentUserId) || [];
      requests.set(currentUserId, myQueue.filter((r) => r.fromUserId !== fromUserId));

      if (users.has(fromUserId)) {
        send(users.get(fromUserId).socket, 'request:result', { userId: currentUserId, accepted });
      }
      return;
    }

    if (type === 'rtc:signal') {
      const { toUserId, signal } = payload;
      if (!users.has(toUserId)) return;
      send(users.get(toUserId).socket, 'rtc:signal', { fromUserId: currentUserId, signal });
    }
  });

  socket.on('close', () => {
    if (currentUserId && users.has(currentUserId)) {
      users.delete(currentUserId);
      broadcastUsers();
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
