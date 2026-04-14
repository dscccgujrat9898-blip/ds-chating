codex/develop-chat-app-with-audio/video-call-features-hiiuqv
# DS Chating (Desktop + Mobile Friendly MVP)

Is update me app ko WhatsApp-like flow ke aur paas laya gaya hai:

- Public all-users list remove: ab sirf **friend list** dikhegi.
- Friend add by email + request accept/reject.
- Group create + group messaging.
- Profile DP URL + status update.
- Tabs based clean UI: Chat / Call / Share / History / Settings.
- Video panel default hidden; sirf call start hone par dikhta hai.
- Screen share call ke flow me separate tab se start ho sakta hai.
- Message/call/file history + delete one, delete chat, delete all.
- Theme system (5 styles) + font size control.
- App lock PIN + forgot password demo flow.
- Local device storage + backup/restore JSON.
- Mobile testing link helper (`/meta`) for same Wi-Fi usage.

## Run

# DS Chating (Desktop EXE MVP)

Ye project WhatsApp-jaisa **desktop-first** chatting app ka MVP hai (Electron + Node.js), jisme:

- ID create/login (name + email)
- Sab users list me visible
- Connect request send/accept/reject
- P2P chat
- Audio call / Video call
- File transfer (data channel)
- Screen share
- Local storage (profile + chats via localStorage)
- Backup / restore (Documents/DS-Chating-Backups)
- Windows portable `.exe` build support

> Note: RustDesk-jaisa full remote Windows control browser security aur OS-level automation ki wajah se alag native module demand karta hai. Is MVP me screen share aur live communication included hai.

## Run (development)
 main

```bash
npm install
npm start
```

## Build Windows EXE

```bash
npm run build:win
```

codex/develop-chat-app-with-audio/video-call-features-hiiuqv
## Mobile to mobile testing

1. App host machine and mobiles same Wi-Fi pe rakho.
2. App me left panel me dikhne wala `Mobile link` open karo mobile browser me.
3. Dono devices alag email se login karke request/friend/chat/call test karo.

> Note: GitHub se direct static link par signaling server ke bina live chat/call possible nahi hota. Isliye real-time features ke liye running Node server required hai.

## Troubleshooting (Windows)

Agar `npm start` par error aaye:

```text
SyntaxError: Unexpected token 'with'
```

to ye usually `server.js` file ke andar accidental extra text insert hone se hota hai (jaise repo/folder path ki line code ke beech me chipak jana).

### Fix steps

1. Ye command run karo:
   ```bash
   node --check server.js
   ```
2. Agar error aaye, `server.js` ke top lines check karo:
   ```bash
   type server.js
   ```
   Ensure first lines exactly `const express = require('express');`, `const http = require('http');`, etc.
3. Fresh copy ke liye repo dobara pull/clone karo.
4. Supported Node version use karo: `>=18 <23` (Node 25 avoid karo for Electron compatibility).

Output artifact typically:

- `dist/DS Chating 1.0.0.exe` (portable)

## Backup behavior

- Chat/profile data local machine par rahta hai.
- Backup button se JSON file banegi.
- Email ko filename me use kiya jata hai (safe format).
- Optional custom backup filename input available.
- Restore button se JSON backup import ho sakta hai.
 main
