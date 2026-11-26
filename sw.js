// Offline shell cache (PWA). n8n calls ko cache nahi karta.
const C='loopx-v5',F=['./','index.html','style.css','util.js','storage.js','workflow.js','n8n.js','dashboard.js','chat.js','sidebar.js','voice.js','wizard.js','splash.js','backup.js','screens.js','main.js','logo.png','icon-192.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(C).then(c=>c.addAll(F))));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin)return;
 e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)))});
