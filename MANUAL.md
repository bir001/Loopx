# LoopX – Start Karne ka Pura Manual

LoopX ek chat-style app hai. Tum message bhejte ho, wo tumhare **n8n** automation ko jata hai, aur jawab + dashboard wapas app me aata hai.

- **Left panel:** history, themes, menu
- **Beech me:** chat (jo bhejna hai wahan likho)
- **Right panel:** n8n ka output dashboard

---

## Part 1: n8n taiyar karo (computer par)

1. n8n kholo: `http://localhost:5678`
2. **Workflows → Import from file** → `loopx-starter-workflow.json` chuno.
3. Workflow me **Webhook** node kholo. **Production URL** copy karo. Aisa dikhega: `http://localhost:5678/webhook/loopx`
4. Upar kone me workflow ko **Active** karo (toggle on).
5. Computer ka **Wi-Fi IP** nikalo:
   - Windows: Command Prompt me `ipconfig` → "IPv4 Address" (jaise `192.168.1.20`)
   - Mac/Linux: `ifconfig` ya Settings → Wi-Fi
6. Windows Firewall me **port 5678** allow karo (nahi to phone se connect nahi hoga).

Phone ke liye URL ban gaya: `http://192.168.1.20:5678/webhook/loopx`

> Dhyan: phone aur computer **ek hi Wi-Fi** par hone chahiye. Computer on rehna chahiye.

---

## Part 2: GitHub par app daalo (phone se)

1. `loopx.zip` ko phone ke Files app me **Extract** karo. Ek `loopx` folder banega.
2. GitHub me naya repository banao (jaise `loopx`).
3. **Add file → Upload files** → folder ke **saare files select** karo → **Commit changes**.
4. **Ek baar ka kaam:** APK banane ki file. **Add file → Create new file** dabao. Naam me likho:
   `.github/workflows/build-apk.yml`
   (slash likhte hi folder ban jate hain). Folder me jo `build-apk.yml` hai uska poora text copy karke paste karo. Commit karo.
5. (Optional, website ke liye) **Settings → Pages → Branch: main → Save**. Site ka link wahan dikhega.

---

## Part 3: APK download aur install

1. Repo ka **Actions** tab kholo. "Build LoopX APK" chal raha hoga (3-5 minute).
2. Hara tick aane par us run ko kholo. Neeche **Artifacts → LoopX-apk** dabao. Download hoga.
3. Zip kholo. Andar `app-debug.apk` milegi.
4. APK par tap karo → "Install unknown apps" allow karo → Install.

---

## Part 4: App me n8n jodo

1. LoopX kholo → neeche **Flows** tab.
2. **+ Connect** dabao.
3. Name likho (jaise "Lead follow-up"), webhook URL paste karo (Part 1 ka phone wala URL). Token optional hai.
4. **Save** → phir **Test** dabao. Hara dot aur "Connected" aaye to sab theek.
5. Beech ke **+** button se **New Chat** kholo aur message bhejo.

Jitne chaho utne automations jodo. Har ek ke liye alag webhook URL.

---

## Part 5: n8n ka jawab kaise bheje

Respond to Webhook node me ye JSON bhejo:

```json
{
  "reply": "Chat me ye text dikhega",
  "dashboard": {
    "title": "Aaj ka report",
    "cards": [{ "label": "Sales", "value": "12" }],
    "table": [{ "item": "A", "qty": 3 }]
  }
}
```

- `reply` chat me aata hai, `dashboard` right panel me khulta hai.
- Dashboard me `cards`, `table`, `text` ya poora `html` de sakte ho (sab optional).
- Webhook ko ye milta hai: `message`, `chatId`, `appId`, `history`.

---

## Part 6: App ke features

| Kya | Kahan |
|---|---|
| Theme badalna (6 theme) | Left drawer (☰) |
| Purani chat kholna / delete | Left drawer → History |
| Purane outputs | Outputs tab |
| Voice se likhna | Chat me mic button |
| Jawab copy karna | Jawab ke neeche Copy |
| Data ka backup | Drawer → Backup → Export / Import |

---

## Update kaise karein

1. Jo file badli hai wahi GitHub me upload karo (same naam, replace ho jayegi).
2. Commit hote hi APK dobara ban jayegi (Actions tab). Naya APK install karo, purana data bana rahega.

## Dikkat aaye to

| Problem | Karo |
|---|---|
| "Cannot reach..." | Phone/computer ek Wi-Fi par? IP sahi? Firewall port 5678 open? |
| Error 404 | Workflow **Active** karo. Test URL (`webhook-test`) mat use karo, Production URL lo |
| Error 403 / CORS | Webhook node → Options → Allowed Origins → `*` |
| Jawab aa raha par dashboard nahi | JSON me `dashboard` key hai? Valid JSON hai? |
| Mic nahi dikh raha | Is phone ka browser/WebView voice support nahi karta, baaki app chalega |
| Data gaya | Drawer → Backup → Import se purani backup file lo |
