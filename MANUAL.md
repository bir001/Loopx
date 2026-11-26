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

1. Repo ke **Actions** tab me "Build LoopX APK" chalega (3-5 minute). Hara tick aane ka intezar karo.
2. Repo ke main page par **Releases** (right side ya "Code" tab ke neeche) kholo → **LoopX latest APK**.
3. **loopx.apk** par tap karo, download hoga. (Wahi file har nayi build par update hoti hai.)
4. APK par tap karo → "Install unknown apps" allow karo → Install.

Agar run par **lal cross** aaye: run kholo, lal step ka naam aur screenshot mujhe bhejo.

---

## Part 4: App me n8n jodo (guided setup)

1. LoopX kholo → neeche **Flows** tab → **Start guided setup** dabao.
2. **Step 1:** starter workflow n8n me import karke **Active** karo (upar Part 1).
3. **Step 2:** computer ka IP likho (Windows: Win+R → `cmd` → `ipconfig` → IPv4 Address). Phone ke Chrome me `http://IP:5678` khol kar check karo, n8n ka page khule to IP sahi hai.
4. **Step 3:** **Test** dabao. Hara box aaye to **Save**. Red box aaye to usme likha hai kya theek karna hai.
5. Save ke baad seedha chat khul jati hai, message bhejo.

> Browser (github.io) se `http://IP` nahi chalega. Wahan sirf https tunnel URL chalta hai. Phone ke liye APK app use karo.

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

---

## APK kahan milti hai (important)
Repo me `android` ya `src` folder nahi dikhega, ye normal hai. Wo GitHub apne server par banata hai.
Actions tab → upar wali run (hara tick) kholo → bilkul neeche **Artifacts** → **LoopX-apk** dabao → zip download → andar `app-debug.apk`.
