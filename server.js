const express = require('express');
const http = require('http');
codex/develop-chat-app-with-audio/video-call-features-b2q8v7
const os = require('os');
const { randomUUID } = require('crypto');

 main
const { WebSocketServer } = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
 codex/develop-chat-app-with-audio/video-call-features-b2q8v7
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.static('src'));

app.get('/meta', (_req, res) => {
  const urls = [];
  const ifaces = os.networkInterfaces();

  Object.values(ifaces).forEach((list) => {
    (list || []).forEach((it) => {
      if (it.family === 'IPv4' && !it.internal) {
        urls.push(`http://${it.address}:${PORT}`);
      }
    });
  });

  res.json({ port: PORT, urls });
});

const users = new Map();
const emailToUserId = new Map();
const requests = new Map();
const groups = new Map();
const directMessages = new Map();

function send(socket, type, payload = {}) {
  if (socket && socket.readyState === 1) {
    socket.send(JSON.stringify({ type, payload }));
  }
}

function getProfile(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    status: user.status || '',
    dp: user.dp || ''
  };
}

function pushDashboard(userId) {
  const user = users.get(userId);
  if (!user) return;

  const friends = Array.from(user.contacts || [])
    .map((id) => users.get(id))
    .filter(Boolean)
    .map(getProfile);

  const myRequests = requests.get(userId) || [];

  const myGroups = Array.from(groups.values())
    .filter((g) => g.memberIds.includes(userId))
    .map((g) => ({ id: g.id, name: g.name, memberIds: g.memberIds }));

  send(user.socket, 'dashboard', { friends, requests: myRequests, groups: myGroups });
}

function pushDashboardForBoth(a, b) {
  pushDashboard(a);
  pushDashboard(b);
}


function pairKey(a, b) {
  return [a, b].sort().join(':');
}




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

 main
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
 codex/develop-chat-app-with-audio/video-call-features-b2q8v7
      const { id, name, email, password } = payload;
      if (!id || !name || !email || !password) return;

      let uid = id;
      const known = emailToUserId.get(email);
      if (known) uid = known;

      const existing = users.get(uid);
      if (existing && existing.password !== password) {
        send(socket, 'auth:error', { message: 'Invalid password for this email.' });
        return;
      }

      const nextUser = existing || {
        id: uid,
        name,
        email,
        password,
        status: '',
        dp: '',
        contacts: new Set()
      };

      nextUser.name = name;
      nextUser.socket = socket;
      users.set(uid, nextUser);
      emailToUserId.set(email, uid);
      currentUserId = uid;

      if (!requests.has(uid)) requests.set(uid, []);
      send(socket, 'auth:ok', { id: uid, email, name });
      pushDashboard(uid);

      const { id, name, email } = payload;
      if (!id || !name || !email) return;

      users.set(id, { id, name, email, socket });
      currentUserId = id;
      if (!requests.has(id)) requests.set(id, []);
      send(socket, 'auth:ok', { id, pendingRequests: requests.get(id) });
      broadcastUsers();
 main
      return;
    }

    if (!currentUserId) return;

codex/develop-chat-app-with-audio/video-call-features-b2q8v7
    if (type === 'user:lookup') {
      const email = (payload.queryEmail || '').trim().toLowerCase();
      const foundUserId = emailToUserId.get(email);
      if (!foundUserId || foundUserId === currentUserId) {
        send(socket, 'user:lookup:result', { found: false });
        return;
      }

      const foundUser = users.get(foundUserId);
      if (!foundUser) {
        send(socket, 'user:lookup:result', { found: false });
        return;
      }

      send(socket, 'user:lookup:result', { found: true, user: getProfile(foundUser) });
      return;
    }

    if (type === 'request:connect') {
      const { toUserId } = payload;
      const fromUser = users.get(currentUserId);
      const toUser = users.get(toUserId);
      if (!fromUser || !toUser || toUserId === currentUserId) return;
      if (fromUser.contacts.has(toUserId)) return;

      const queue = requests.get(toUserId) || [];
      if (!queue.some((r) => r.fromUserId === currentUserId)) {
        queue.push({
          fromUserId: currentUserId,
          fromName: fromUser.name,
          fromEmail: fromUser.email,
          fromDp: fromUser.dp,
          at: Date.now()
        });
      }
      requests.set(toUserId, queue);
      pushDashboard(toUserId);
      send(socket, 'request:sent', { toUserId });

    if (type === 'request:connect') {
      const { toUserId } = payload;
      const fromUser = users.get(currentUserId);
      if (!users.has(toUserId) || toUserId === currentUserId) return;

      const queue = requests.get(toUserId) || [];
      queue.push({ fromUserId: currentUserId, fromName: fromUser.name, email: fromUser.email, at: Date.now() });
      requests.set(toUserId, queue);

      const toSocket = users.get(toUserId).socket;
      send(toSocket, 'request:incoming', { fromUserId: currentUserId, fromName: fromUser.name, email: fromUser.email });
main
      return;
    }

    if (type === 'request:decision') {
      const { fromUserId, accepted } = payload;
      const myQueue = requests.get(currentUserId) || [];
      requests.set(currentUserId, myQueue.filter((r) => r.fromUserId !== fromUserId));

 codex/develop-chat-app-with-audio/video-call-features-b2q8v7
      if (accepted) {
        const me = users.get(currentUserId);
        const other = users.get(fromUserId);
        if (me && other) {
          me.contacts.add(fromUserId);
          other.contacts.add(currentUserId);
          pushDashboardForBoth(currentUserId, fromUserId);
        }
      } else {
        pushDashboard(currentUserId);
      }

      const fromUser = users.get(fromUserId);
      if (fromUser) {
        send(fromUser.socket, 'request:result', { userId: currentUserId, accepted });

      if (users.has(fromUserId)) {
        send(users.get(fromUserId).socket, 'request:result', { userId: currentUserId, accepted });
 main
      }
      return;
    }

 codex/develop-chat-app-with-audio/video-call-features-b2q8v7
    if (type === 'direct:message') {
      const { toUserId, text } = payload;
      const from = users.get(currentUserId);
      const to = users.get(toUserId);
      if (!from || !to || !from.contacts.has(toUserId)) return;

      const message = { fromUserId: currentUserId, toUserId, text, at: Date.now() };
      const key = pairKey(currentUserId, toUserId);
      const list = directMessages.get(key) || [];
      list.push(message);
      directMessages.set(key, list);

      send(from.socket, 'direct:message', { message });
      send(to.socket, 'direct:message', { message });
      return;
    }

    if (type === 'direct:history') {
      const otherId = payload.withUserId;
      const user = users.get(currentUserId);
      if (!user || !user.contacts.has(otherId)) return;
      const key = pairKey(currentUserId, otherId);
      send(socket, 'direct:history', { withUserId: otherId, messages: directMessages.get(key) || [] });
      return;
    }

    if (type === 'profile:update') {
      const user = users.get(currentUserId);
      if (!user) return;
      user.status = payload.status || '';
      user.dp = payload.dp || '';
      pushDashboard(currentUserId);
      (user.contacts || []).forEach((friendId) => pushDashboard(friendId));
      return;
    }

    if (type === 'group:create') {
      const user = users.get(currentUserId);
      if (!user) return;

      const memberIds = Array.from(new Set([currentUserId, ...(payload.memberIds || [])]))
        .filter((id) => user.contacts.has(id) || id === currentUserId);

      const group = {
        id: randomUUID(),
        name: payload.name || 'New Group',
        memberIds,
        messages: []
      };
      groups.set(group.id, group);
      memberIds.forEach((id) => pushDashboard(id));
      return;
    }

    if (type === 'group:message') {
      const { groupId, text } = payload;
      const group = groups.get(groupId);
      if (!group || !group.memberIds.includes(currentUserId)) return;

      const message = { fromUserId: currentUserId, text, at: Date.now() };
      group.messages.push(message);

      group.memberIds.forEach((id) => {
        const u = users.get(id);
        if (u) send(u.socket, 'group:message', { groupId, message });
      });
      return;
    }

    if (type === 'group:history') {
      const group = groups.get(payload.groupId);
      if (!group || !group.memberIds.includes(currentUserId)) return;
      send(socket, 'group:history', { groupId: group.id, messages: group.messages });
      return;
    }

    if (type === 'rtc:signal') {
      const { toUserId, signal } = payload;
      const toUser = users.get(toUserId);
      if (!toUser) return;
      send(toUser.socket, 'rtc:signal', { fromUserId: currentUserId, signal });

    if (type === 'rtc:signal') {
      const { toUserId, signal } = payload;
      if (!users.has(toUserId)) return;
      send(users.get(toUserId).socket, 'rtc:signal', { fromUserId: currentUserId, signal });
 main
    }
  });

  socket.on('close', () => {
    if (currentUserId && users.has(currentUserId)) {
 codex/develop-chat-app-with-audio/video-call-features-b2q8v7
      const user = users.get(currentUserId);
      user.socket = null;
      (user.contacts || []).forEach((id) => pushDashboard(id));
    }
  });
});

server.listen(PORT, HOST, () => {

      users.delete(currentUserId);
      broadcastUsers();
    }
  });
});

server.listen(PORT, () => {
 main
  console.log(`Server running at http://localhost:${PORT}`);
});
