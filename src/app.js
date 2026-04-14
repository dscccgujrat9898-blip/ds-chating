 codex/develop-chat-app-with-audio/video-call-features-07w4ft
const socket = new WebSocket(`ws://${location.host}`);

const saved = JSON.parse(localStorage.getItem('appState') || '{}');
const state = {
  me: saved.me || null,
  friends: [],
  requests: [],
  groups: [],
  activeChat: null,
  activeChatType: 'direct',
  directMessages: saved.directMessages || {},
  groupMessages: saved.groupMessages || {},
  files: saved.files || [],
  history: saved.history || [],
  settings: saved.settings || {
    theme: 'theme-classic',
    fontSize: 16,
    lockEnabled: false,
    lockPin: '',
    dp: '',
    status: ''
  },
  pc: null,
  localStream: null

const socket = new WebSocket('ws://localhost:3000');
const state = {
  me: JSON.parse(localStorage.getItem('me') || 'null'),
  users: [],
  requests: [],
  activePeer: null,
  pc: null,
  localStream: null,
  dataChannel: null,
  chats: JSON.parse(localStorage.getItem('chats') || '{}')
 main
};

const el = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
  password: document.getElementById('password'),
  registerBtn: document.getElementById('registerBtn'),
  forgotBtn: document.getElementById('forgotBtn'),
  selfId: document.getElementById('selfId'),
  accessLink: document.getElementById('accessLink'),
  findEmail: document.getElementById('findEmail'),
  findBtn: document.getElementById('findBtn'),
  requestsList: document.getElementById('requestsList'),
  friendsList: document.getElementById('friendsList'),
  groupsList: document.getElementById('groupsList'),
  groupName: document.getElementById('groupName'),
  groupMembers: document.getElementById('groupMembers'),
  createGroupBtn: document.getElementById('createGroupBtn'),
  peerInfo: document.getElementById('peerInfo'),
  statusLine: document.getElementById('statusLine'),
  tabs: Array.from(document.querySelectorAll('.tab-btn')),
  tabContents: Array.from(document.querySelectorAll('.tab-content')),
  chatList: document.getElementById('chatList'),
  chatInput: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn'),
  deleteCurrentChatBtn: document.getElementById('deleteCurrentChatBtn'),
  deleteAllChatsBtn: document.getElementById('deleteAllChatsBtn'),
  audioBtn: document.getElementById('audioBtn'),
  videoBtn: document.getElementById('videoBtn'),
  endCallBtn: document.getElementById('endCallBtn'),
  callPanel: document.getElementById('callPanel'),
  localVideo: document.getElementById('localVideo'),
  remoteVideo: document.getElementById('remoteVideo'),
  screenBtn: document.getElementById('screenBtn'),
  fileInput: document.getElementById('fileInput'),
  filesList: document.getElementById('filesList'),
  historyList: document.getElementById('historyList'),
  historyStats: document.getElementById('historyStats'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  dpInput: document.getElementById('dpInput'),
  statusInput: document.getElementById('statusInput'),
  saveProfileBtn: document.getElementById('saveProfileBtn'),
  lockPin: document.getElementById('lockPin'),
  appLockToggle: document.getElementById('appLockToggle'),
  themeSelect: document.getElementById('themeSelect'),
  fontSize: document.getElementById('fontSize'),
  backupName: document.getElementById('backupName'),
  backupBtn: document.getElementById('backupBtn'),
  restoreBtn: document.getElementById('restoreBtn'),
  backupStatus: document.getElementById('backupStatus')
};

function persist() {
  localStorage.setItem('appState', JSON.stringify({
    me: state.me,
    directMessages: state.directMessages,
    groupMessages: state.groupMessages,
    files: state.files,
    history: state.history,
    settings: state.settings
  }));
}

function applyTheme() {
  document.body.className = state.settings.theme;
  document.documentElement.style.setProperty('--font-size', `${state.settings.fontSize}px`);
}

function tabTo(tabId) {
  el.tabs.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabId));
  el.tabContents.forEach((c) => c.classList.toggle('active', c.id === tabId));
}

function addHistory(type, text) {
  state.history.unshift({ type, text, at: Date.now() });
  if (state.history.length > 500) state.history.pop();
  persist();
  renderHistory();
}

function renderHistory() {
  el.historyList.innerHTML = '';
  const counts = { chat: 0, call: 0, file: 0, group: 0 };

  state.history.forEach((h) => {
    counts[h.type] = (counts[h.type] || 0) + 1;
    const li = document.createElement('li');
    li.textContent = `[${new Date(h.at).toLocaleString()}] ${h.type}: ${h.text}`;
    el.historyList.appendChild(li);
  });

  el.historyStats.textContent = `Total: ${state.history.length} | Chat: ${counts.chat} | Call: ${counts.call} | Group: ${counts.group} | File: ${counts.file}`;
}

function renderFriends() {
  el.friendsList.innerHTML = '';
  state.friends.forEach((f) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${f.name}</strong><br/><small>${f.email}</small><br/><small>${f.status || 'No status'}</small>`;

    const openBtn = document.createElement('button');
    openBtn.className = 'small-btn';
    openBtn.textContent = 'Open Chat';
    openBtn.onclick = () => {
      state.activeChatType = 'direct';
      state.activeChat = f.id;
      el.peerInfo.textContent = `Chat: ${f.name}`;
      el.statusLine.textContent = f.status || '';
      send('direct:history', { withUserId: f.id });
      tabTo('chatTab');
    };

    li.appendChild(openBtn);
    el.friendsList.appendChild(li);
  });

  registerBtn: document.getElementById('registerBtn'),
  selfId: document.getElementById('selfId'),
  usersList: document.getElementById('usersList'),
  requestsList: document.getElementById('requestsList'),
  peerInfo: document.getElementById('peerInfo'),
  connectRtcBtn: document.getElementById('connectRtcBtn'),
  audioBtn: document.getElementById('audioBtn'),
  videoBtn: document.getElementById('videoBtn'),
  screenBtn: document.getElementById('screenBtn'),
  localVideo: document.getElementById('localVideo'),
  remoteVideo: document.getElementById('remoteVideo'),
  chatList: document.getElementById('chatList'),
  chatInput: document.getElementById('chatInput'),
  sendBtn: document.getElementById('sendBtn'),
  fileInput: document.getElementById('fileInput'),
  backupBtn: document.getElementById('backupBtn'),
  restoreBtn: document.getElementById('restoreBtn'),
  backupName: document.getElementById('backupName'),
  backupStatus: document.getElementById('backupStatus')
};

function uid() {
  return crypto.randomUUID();
}

function send(type, payload) {
  socket.send(JSON.stringify({ type, payload }));
}

function persist() {
  localStorage.setItem('me', JSON.stringify(state.me));
  localStorage.setItem('chats', JSON.stringify(state.chats));
}

function renderUsers() {
  el.usersList.innerHTML = '';
  state.users
    .filter((u) => !state.me || u.id !== state.me.id)
    .forEach((u) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${u.name}</strong><br/><small>${u.email}</small><br/><small>${u.online ? 'Online' : 'Offline'}</small>`;

      const reqBtn = document.createElement('button');
      reqBtn.className = 'small-btn';
      reqBtn.textContent = 'Send Request';
      reqBtn.onclick = () => {
        state.activePeer = u;
        el.peerInfo.textContent = `Selected: ${u.name}`;
        send('request:connect', { toUserId: u.id });
      };

      li.appendChild(reqBtn);
      el.usersList.appendChild(li);
    });
 main
}

function renderRequests() {
  el.requestsList.innerHTML = '';
  state.requests.forEach((r) => {
    const li = document.createElement('li');
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
    li.innerHTML = `<strong>${r.fromName}</strong><br/><small>${r.fromEmail}</small>`;

    li.innerHTML = `${r.fromName}<br/><small>${r.email}</small>`;
 main

    const accept = document.createElement('button');
    accept.className = 'small-btn';
    accept.textContent = 'Accept';
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
    accept.onclick = () => send('request:decision', { fromUserId: r.fromUserId, accepted: true });

    accept.onclick = () => {
      send('request:decision', { fromUserId: r.fromUserId, accepted: true });
      state.activePeer = state.users.find((u) => u.id === r.fromUserId);
      el.peerInfo.textContent = `Connected request: ${state.activePeer?.name || r.fromName}`;
      state.requests = state.requests.filter((x) => x.fromUserId !== r.fromUserId);
      renderRequests();
    };
 main

    const reject = document.createElement('button');
    reject.className = 'small-btn';
    reject.textContent = 'Reject';
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
    reject.onclick = () => send('request:decision', { fromUserId: r.fromUserId, accepted: false });

    reject.onclick = () => {
      send('request:decision', { fromUserId: r.fromUserId, accepted: false });
      state.requests = state.requests.filter((x) => x.fromUserId !== r.fromUserId);
      renderRequests();
    };
 main

    li.appendChild(accept);
    li.appendChild(reject);
    el.requestsList.appendChild(li);
  });
}

codex/develop-chat-app-with-audio/video-call-features-07w4ft
function renderGroups() {
  el.groupsList.innerHTML = '';
  state.groups.forEach((g) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${g.name}</strong><br/><small>${g.id}</small>`;

    const openBtn = document.createElement('button');
    openBtn.className = 'small-btn';
    openBtn.textContent = 'Open Group';
    openBtn.onclick = () => {
      state.activeChatType = 'group';
      state.activeChat = g.id;
      el.peerInfo.textContent = `Group: ${g.name}`;
      el.statusLine.textContent = `Members: ${g.memberIds.length}`;
      send('group:history', { groupId: g.id });
      tabTo('chatTab');
    };

    li.appendChild(openBtn);
    el.groupsList.appendChild(li);
  });
}

function listForActiveChat() {
  if (!state.activeChat) return [];
  if (state.activeChatType === 'group') {
    return state.groupMessages[state.activeChat] || [];
  }
  return state.directMessages[state.activeChat] || [];
}

function renderChat() {
  el.chatList.innerHTML = '';
  const list = listForActiveChat();

  list.forEach((m, idx) => {
    const li = document.createElement('li');
    const mine = m.fromUserId === state.me?.id;
    li.textContent = `${mine ? 'Me' : m.fromName || 'Friend'}: ${m.text}`;

    const del = document.createElement('button');
    del.className = 'small-btn';
    del.textContent = 'Delete';
    del.onclick = () => deleteSingleMessage(idx);

    li.appendChild(del);
    el.chatList.appendChild(li);
  });

  el.chatList.scrollTop = el.chatList.scrollHeight;
}

function deleteSingleMessage(index) {
  if (!state.activeChat) return;
  const key = state.activeChat;
  if (state.activeChatType === 'group') {
    const list = state.groupMessages[key] || [];
    list.splice(index, 1);
    state.groupMessages[key] = list;
  } else {
    const list = state.directMessages[key] || [];
    list.splice(index, 1);
    state.directMessages[key] = list;
  }
  persist();
  renderChat();
}

function upsertDirectMessage(message) {
  const friendId = message.fromUserId === state.me.id ? message.toUserId : message.fromUserId;
  const list = state.directMessages[friendId] || [];
  const from = state.friends.find((f) => f.id === message.fromUserId);
  list.push({ ...message, fromName: from?.name || 'User' });
  state.directMessages[friendId] = list;
}

function renderFiles() {
  el.filesList.innerHTML = '';
  state.files.forEach((f, idx) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="${f.dataUrl}" download="${f.name}">${f.name}</a>`;
    const del = document.createElement('button');
    del.className = 'small-btn';
    del.textContent = 'Delete File';
    del.onclick = () => {
      state.files.splice(idx, 1);
      persist();
      renderFiles();
    };
    li.appendChild(del);
    el.filesList.appendChild(li);
  });
}

function renderCallPanel() {
  if (state.localStream || el.remoteVideo.srcObject) {
    el.callPanel.classList.remove('hidden');
  } else {
    el.callPanel.classList.add('hidden');
  }
=======
function renderChat() {
  const peerId = state.activePeer?.id;
  const list = (peerId && state.chats[peerId]) || [];
  el.chatList.innerHTML = '';
  list.forEach((m) => {
    const li = document.createElement('li');
    li.textContent = `${m.from}: ${m.text}`;
    el.chatList.appendChild(li);
  });
}

function addChat(from, text) {
  if (!state.activePeer) return;
  const peerId = state.activePeer.id;
  if (!state.chats[peerId]) state.chats[peerId] = [];
  state.chats[peerId].push({ from, text, at: Date.now() });
  persist();
  renderChat();
  autoBackup();
}

function attachDataChannel(channel) {
  state.dataChannel = channel;
  channel.onmessage = (event) => {
    if (typeof event.data === 'string') {
      const msg = JSON.parse(event.data);
      if (msg.type === 'chat') addChat(state.activePeer?.name || 'Peer', msg.text);
      if (msg.type === 'file') {
        const a = document.createElement('a');
        a.href = msg.dataUrl;
        a.download = msg.fileName;
        a.textContent = `Download ${msg.fileName}`;
        const li = document.createElement('li');
        li.appendChild(a);
        el.chatList.appendChild(li);
      }
    }
  };
 main
}

async function ensurePeerConnection(isOfferer = false) {
  if (state.pc) return state.pc;

 codex/develop-chat-app-with-audio/video-call-features-07w4ft
  state.pc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });

  state.pc.onicecandidate = (event) => {
    if (event.candidate && state.activeChatType === 'direct' && state.activeChat) {
      send('rtc:signal', { toUserId: state.activeChat, signal: { candidate: event.candidate } });

  state.pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  state.pc.onicecandidate = (event) => {
    if (event.candidate && state.activePeer) {
      send('rtc:signal', { toUserId: state.activePeer.id, signal: { candidate: event.candidate } });
 main
    }
  };

  state.pc.ontrack = (event) => {
    el.remoteVideo.srcObject = event.streams[0];
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
    renderCallPanel();
  };

  if (isOfferer) {
    state.pc.createDataChannel('noop');

  };

  if (isOfferer) {
    const channel = state.pc.createDataChannel('chat-data');
    attachDataChannel(channel);
  } else {
    state.pc.ondatachannel = (event) => attachDataChannel(event.channel);
 main
  }

  return state.pc;
}

 codex/develop-chat-app-with-audio/video-call-features-07w4ft
async function startCall(mode) {
  if (state.activeChatType !== 'direct' || !state.activeChat) {
    alert('Please open friend chat first for call');
    return;
  }

  const pc = await ensurePeerConnection(true);
  state.localStream = mode === 'screen'
    ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    : await navigator.mediaDevices.getUserMedia({ audio: true, video: mode === 'video' });

  state.localStream.getTracks().forEach((track) => pc.addTrack(track, state.localStream));
  el.localVideo.srcObject = state.localStream;
  renderCallPanel();

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  send('rtc:signal', { toUserId: state.activeChat, signal: { sdp: pc.localDescription } });
  addHistory('call', `${mode} call started with ${state.activeChat}`);
}

function endCall() {
  if (state.localStream) state.localStream.getTracks().forEach((t) => t.stop());
  if (state.pc) state.pc.close();
  state.localStream = null;
  state.pc = null;
  el.localVideo.srcObject = null;
  el.remoteVideo.srcObject = null;
  renderCallPanel();
  addHistory('call', 'Call ended');
}

async function onSignal(fromUserId, signal) {

async function startCall(kind = 'audio') {
  if (!state.activePeer) return alert('Select and connect a peer first');
  const pc = await ensurePeerConnection(true);

  const constraints =
    kind === 'video' ? { audio: true, video: true } :
    kind === 'screen' ? { audio: true, video: true } :
    { audio: true, video: false };

  state.localStream = kind === 'screen'
    ? await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
    : await navigator.mediaDevices.getUserMedia(constraints);

  state.localStream.getTracks().forEach((track) => pc.addTrack(track, state.localStream));
  el.localVideo.srcObject = state.localStream;

  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  send('rtc:signal', { toUserId: state.activePeer.id, signal: { sdp: pc.localDescription } });
}

async function onSignal(fromUserId, signal) {
  state.activePeer = state.users.find((u) => u.id === fromUserId) || state.activePeer;
  if (state.activePeer) {
    el.peerInfo.textContent = `Peer: ${state.activePeer.name}`;
    renderChat();
  }

 main
  const pc = await ensurePeerConnection(false);

  if (signal.sdp) {
    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    if (signal.sdp.type === 'offer') {
      state.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      state.localStream.getTracks().forEach((track) => pc.addTrack(track, state.localStream));
      el.localVideo.srcObject = state.localStream;
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
      renderCallPanel();

 main

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      send('rtc:signal', { toUserId: fromUserId, signal: { sdp: pc.localDescription } });
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
      addHistory('call', `Incoming call from ${fromUserId}`);

main
    }
  }

  if (signal.candidate) {
    await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
  }
}

async function autoBackup() {
  if (!window.desktopAPI || !state.me?.email) return;
 codex/develop-chat-app-with-audio/video-call-features-07w4ft
  const payload = {
    ...JSON.parse(localStorage.getItem('appState') || '{}'),
    ts: Date.now()
  };


  const payload = { me: state.me, chats: state.chats, ts: Date.now() };
 main
  const result = await window.desktopAPI.saveBackup({
    email: state.me.email,
    payload,
    customName: el.backupName.value.trim() || undefined
  });
  if (result.ok) el.backupStatus.textContent = `Backup: ${result.filePath}`;
}

 codex/develop-chat-app-with-audio/video-call-features-07w4ft
function send(type, payload) {
  socket.send(JSON.stringify({ type, payload }));
}

el.tabs.forEach((btn) => {
  btn.onclick = () => tabTo(btn.dataset.tab);
});

el.registerBtn.onclick = () => {
  const name = el.name.value.trim();
  const email = el.email.value.trim().toLowerCase();
  const password = el.password.value.trim();
  if (!name || !email || !password) return alert('Name/email/password required');

  if (state.settings.lockEnabled && state.settings.lockPin) {
    const entered = prompt('App is locked. Enter PIN');
    if (entered !== state.settings.lockPin) return alert('Invalid PIN');
  }

  state.me = { id: crypto.randomUUID(), name, email };
  send('auth:register', { ...state.me, password });
};

el.forgotBtn.onclick = () => {
  const email = el.email.value.trim();
  if (!email) return alert('Enter email first');
  alert(`Password reset link sent to ${email} (demo mode)`);
};

el.findBtn.onclick = () => {
  const queryEmail = el.findEmail.value.trim().toLowerCase();
  if (!queryEmail) return;
  send('user:lookup', { queryEmail });
};

el.createGroupBtn.onclick = () => {
  const name = el.groupName.value.trim();
  const memberIds = el.groupMembers.value.split(',').map((s) => s.trim()).filter(Boolean);
  if (!name) return;
  send('group:create', { name, memberIds });
};

el.sendBtn.onclick = () => {
  const text = el.chatInput.value.trim();
  if (!text || !state.activeChat) return;

  if (state.activeChatType === 'group') {
    send('group:message', { groupId: state.activeChat, text });
  } else {
    send('direct:message', { toUserId: state.activeChat, text });
  }

  el.chatInput.value = '';
};

el.deleteCurrentChatBtn.onclick = () => {
  if (!state.activeChat) return;
  if (state.activeChatType === 'group') delete state.groupMessages[state.activeChat];
  else delete state.directMessages[state.activeChat];
  persist();
  renderChat();
};

el.deleteAllChatsBtn.onclick = () => {
  state.directMessages = {};
  state.groupMessages = {};
  persist();
  renderChat();
};

el.audioBtn.onclick = () => startCall('audio');
el.videoBtn.onclick = () => startCall('video');
el.screenBtn.onclick = () => startCall('screen');
el.endCallBtn.onclick = endCall;

el.fileInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.files.unshift({ name: file.name, dataUrl: reader.result, at: Date.now() });
    addHistory('file', `File shared: ${file.name}`);
    persist();
    renderFiles();

el.registerBtn.onclick = () => {
  const name = el.name.value.trim();
  const email = el.email.value.trim();
  if (!name || !email) return alert('Name + Email required');
  const existing = state.me && state.me.email === email ? state.me.id : uid();
  state.me = { id: existing, name, email };
  send('auth:register', state.me);
  persist();
};

el.connectRtcBtn.onclick = () => {
  if (!state.activePeer) return alert('Select peer from users and send request first');
  alert('Now use Audio/Video/Screen button to start.');
};

el.audioBtn.onclick = () => startCall('audio');
el.videoBtn.onclick = () => startCall('video');
el.screenBtn.onclick = () => startCall('screen');

el.sendBtn.onclick = () => {
  const text = el.chatInput.value.trim();
  if (!text || !state.dataChannel || state.dataChannel.readyState !== 'open') return;
  state.dataChannel.send(JSON.stringify({ type: 'chat', text }));
  addChat('Me', text);
  el.chatInput.value = '';
};

el.fileInput.onchange = (e) => {
  const file = e.target.files[0];
  if (!file || !state.dataChannel || state.dataChannel.readyState !== 'open') return;
  const reader = new FileReader();
  reader.onload = () => {
    state.dataChannel.send(JSON.stringify({ type: 'file', fileName: file.name, dataUrl: reader.result }));
    addChat('Me', `Sent file: ${file.name}`);
 main
  };
  reader.readAsDataURL(file);
};

 codex/develop-chat-app-with-audio/video-call-features-07w4ft
el.clearHistoryBtn.onclick = () => {
  state.history = [];
  persist();
  renderHistory();
};

el.saveProfileBtn.onclick = () => {
  state.settings.dp = el.dpInput.value.trim();
  state.settings.status = el.statusInput.value.trim();
  send('profile:update', { dp: state.settings.dp, status: state.settings.status });
  persist();
};

el.appLockToggle.onchange = () => {
  state.settings.lockEnabled = el.appLockToggle.checked;
  state.settings.lockPin = el.lockPin.value.trim();
  persist();
};

el.themeSelect.onchange = () => {
  state.settings.theme = el.themeSelect.value;
  applyTheme();
  persist();
};

el.fontSize.oninput = () => {
  state.settings.fontSize = Number(el.fontSize.value);
  applyTheme();
  persist();
};


 main
el.backupBtn.onclick = autoBackup;
el.restoreBtn.onclick = async () => {
  if (!window.desktopAPI) return;
  const result = await window.desktopAPI.restoreBackup();
  if (!result.ok) return;
 codex/develop-chat-app-with-audio/video-call-features-07w4ft

  const payload = result.payload || {};
  localStorage.setItem('appState', JSON.stringify(payload));
  location.reload();
};

socket.onopen = async () => {
  try {
    const res = await fetch('/meta');
    const meta = await res.json();
    el.accessLink.textContent = meta.urls[0]
      ? `Mobile link: ${meta.urls[0]}`
      : 'Use same Wi-Fi and open host-ip:3000';
  } catch {
    el.accessLink.textContent = 'Use same Wi-Fi and open host-ip:3000';
  }
};

socket.onmessage = async (event) => {
  const { type, payload } = JSON.parse(event.data);

  if (type === 'auth:ok') {
    state.me.id = payload.id;
    el.selfId.textContent = `ID: ${payload.id}`;
    persist();
  }

  if (type === 'auth:error') {
    alert(payload.message);
  }

  if (type === 'dashboard') {
    state.friends = payload.friends || [];
    state.requests = payload.requests || [];
    state.groups = payload.groups || [];
    renderFriends();
    renderRequests();
    renderGroups();
  }

  if (type === 'user:lookup:result') {
    if (!payload.found) {
      alert('User not found');
      return;
    }
    send('request:connect', { toUserId: payload.user.id });
    alert(`Request sent to ${payload.user.name}`);
  }

  if (type === 'request:result') {
    alert(payload.accepted ? 'Request accepted' : 'Request rejected');
  }

  if (type === 'direct:message') {
    upsertDirectMessage(payload.message);
    persist();
    if (state.activeChatType === 'direct') renderChat();
    addHistory('chat', payload.message.text);
  }

  if (type === 'direct:history') {
    const list = payload.messages || [];
    state.directMessages[payload.withUserId] = list.map((m) => ({ ...m, fromName: 'User' }));
    persist();
    renderChat();
  }

  if (type === 'group:message') {
    const list = state.groupMessages[payload.groupId] || [];
    list.push({ ...payload.message, fromName: 'Member' });
    state.groupMessages[payload.groupId] = list;
    persist();
    if (state.activeChatType === 'group' && state.activeChat === payload.groupId) renderChat();
    addHistory('group', payload.message.text);
  }

  if (type === 'group:history') {
    state.groupMessages[payload.groupId] = payload.messages || [];
    persist();
    renderChat();

  state.me = result.payload.me || state.me;
  state.chats = result.payload.chats || {};
  persist();
  renderChat();
  el.backupStatus.textContent = `Restored: ${result.filePath}`;
};

socket.onopen = () => {
  if (state.me) send('auth:register', state.me);
};

socket.onmessage = async (event) => {
  const msg = JSON.parse(event.data);
  const { type, payload } = msg;

  if (type === 'auth:ok') {
    el.selfId.textContent = `ID: ${payload.id}`;
    state.requests = payload.pendingRequests || [];
    renderRequests();
  }

  if (type === 'users:list') {
    state.users = payload.users;
    renderUsers();
  }

  if (type === 'request:incoming') {
    state.requests.push(payload);
    renderRequests();
  }

  if (type === 'request:result') {
    if (payload.accepted) {
      state.activePeer = state.users.find((u) => u.id === payload.userId) || null;
      el.peerInfo.textContent = `Request accepted: ${state.activePeer?.name || payload.userId}`;
      renderChat();
    }
 main
  }

  if (type === 'rtc:signal') {
    await onSignal(payload.fromUserId, payload.signal);
  }
};

 codex/develop-chat-app-with-audio/video-call-features-07w4ft
window.addEventListener('beforeunload', () => {
  endCall();
  persist();
});

el.themeSelect.value = state.settings.theme;
el.fontSize.value = state.settings.fontSize;
el.appLockToggle.checked = state.settings.lockEnabled;
el.lockPin.value = state.settings.lockPin || '';
el.dpInput.value = state.settings.dp || '';
el.statusInput.value = state.settings.status || '';
applyTheme();
renderHistory();
renderFiles();
renderChat();

window.addEventListener('beforeunload', persist);
 main
