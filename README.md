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

```bash
npm install
npm start
```

## Build Windows EXE

```bash
npm run build:win
```

Output artifact typically:

- `dist/DS Chating 1.0.0.exe` (portable)

## Backup behavior

- Chat/profile data local machine par rahta hai.
- Backup button se JSON file banegi.
- Email ko filename me use kiya jata hai (safe format).
- Optional custom backup filename input available.
- Restore button se JSON backup import ho sakta hai.
