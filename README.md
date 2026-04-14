# DS Chating (Desktop EXE MVP)

Ye project WhatsApp-jaisa **desktop-first** chatting app ka improved MVP hai (Electron + Node.js), jisme:

- ID create/login (name + email)
- Sab users list me visible
- Connect request send/accept/reject
- P2P chat
- Audio call / Video call
- File transfer (data channel)
- Screen share
- Local storage (profile + chats via localStorage)
- Backup / restore (Documents/DS-Chating-Backups)
- RustDesk-style settings panel (auto-accept + remote-control mode signal)
- Windows portable `.exe` build support

## UI improvements

- Message area bada aur smooth scrolling.
- Top controls icons-only kiye gaye (`🔗 📞 🎥 🖥️ 📎`).
- Video/audio panel hidden rahta hai, call start hote hi dikhta hai.
- Mobile-friendly behavior improve kiya gaya.
- App sidebar me same Wi-Fi par mobile access link display hota hai.

> Note: RustDesk-jaisa full remote Windows control ke liye OS-level native module chahiye hota hai. Is MVP me remote-assist workflow ke liye settings, screen share aur control-event channel placeholder diya gaya hai.

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

- Chat/profile/settings data local machine par rahta hai.
- Backup button se JSON file banegi.
- Email ko filename me use kiya jata hai (safe format).
- Optional custom backup filename input available.
- Restore button se JSON backup import ho sakta hai.
