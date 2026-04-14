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
};

const el = {
  name: document.getElementById('name'),
  email: document.getElementById('email'),
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
}

function renderRequests() {
  el.requestsList.innerHTML = '';
  state.requests.forEach((r) => {
    const li = document.createElement('li');
    li.innerHTML = `${r.fromName}<br/><small>${r.email}</small>`;

    const accept = document.createElement('button');
    accept.className = 'small-btn';
    accept.textContent = 'Accept';
    accept.onclick = () => {
      send('request:decision', { fromUserId: r.fromUserId, accepted: true });
      state.activePeer = state.users.find((u) => u.id === r.fromUserId);
      el.peerInfo.textContent = `Connected request: ${state.activePeer?.name || r.fromName}`;
      state.requests = state.requests.filter((x) => x.fromUserId !== r.fromUserId);
      renderRequests();
    };

    const reject = document.createElement('button');
    reject.className = 'small-btn';
    reject.textContent = 'Reject';
    reject.onclick = () => {
      send('request:decision', { fromUserId: r.fromUserId, accepted: false });
      state.requests = state.requests.filter((x) => x.fromUserId !== r.fromUserId);
      renderRequests();
    };

    li.appendChild(accept);
    li.appendChild(reject);
    el.requestsList.appendChild(li);
  });
}

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
}

async function ensurePeerConnection(isOfferer = false) {
  if (state.pc) return state.pc;

  state.pc = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  state.pc.onicecandidate = (event) => {
    if (event.candidate && state.activePeer) {
      send('rtc:signal', { toUserId: state.activePeer.id, signal: { candidate: event.candidate } });
    }
  };

  state.pc.ontrack = (event) => {
    el.remoteVideo.srcObject = event.streams[0];
  };

  if (isOfferer) {
    const channel = state.pc.createDataChannel('chat-data');
    attachDataChannel(channel);
  } else {
    state.pc.ondatachannel = (event) => attachDataChannel(event.channel);
  }

  return state.pc;
}

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

  const pc = await ensurePeerConnection(false);

  if (signal.sdp) {
    await pc.setRemoteDescription(new RTCSessionDescription(signal.sdp));
    if (signal.sdp.type === 'offer') {
      state.localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      state.localStream.getTracks().forEach((track) => pc.addTrack(track, state.localStream));
      el.localVideo.srcObject = state.localStream;

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      send('rtc:signal', { toUserId: fromUserId, signal: { sdp: pc.localDescription } });
    }
  }

  if (signal.candidate) {
    await pc.addIceCandidate(new RTCIceCandidate(signal.candidate));
  }
}

async function autoBackup() {
  if (!window.desktopAPI || !state.me?.email) return;
  const payload = { me: state.me, chats: state.chats, ts: Date.now() };
  const result = await window.desktopAPI.saveBackup({
    email: state.me.email,
    payload,
    customName: el.backupName.value.trim() || undefined
  });
  if (result.ok) el.backupStatus.textContent = `Backup: ${result.filePath}`;
}

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
  };
  reader.readAsDataURL(file);
};

el.backupBtn.onclick = autoBackup;
el.restoreBtn.onclick = async () => {
  if (!window.desktopAPI) return;
  const result = await window.desktopAPI.restoreBackup();
  if (!result.ok) return;
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
  }

  if (type === 'rtc:signal') {
    await onSignal(payload.fromUserId, payload.signal);
  }
};

window.addEventListener('beforeunload', persist);
