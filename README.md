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

```bash
npm install
npm start
```

## Build Windows EXE

```bash
npm run build:win
```

## Mobile to mobile testing

1. App host machine and mobiles same Wi-Fi pe rakho.
2. App me left panel me dikhne wala `Mobile link` open karo mobile browser me.
3. Dono devices alag email se login karke request/friend/chat/call test karo.

> Note: GitHub se direct static link par signaling server ke bina live chat/call possible nahi hota. Isliye real-time features ke liye running Node server required hai.
