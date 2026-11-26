// Feature: guided 3-step connect wizard (n8n) with plain-English fixes
const Wizard={s:1,mode:'ip',ip:'',port:'5678',path:'loopx',full:'',name:'My Automation',res:null,
 url(){return this.mode==='url'?this.full.trim():'http://'+this.ip.trim()+':'+(this.port.trim()||'5678')+'/webhook/'+(this.path.trim()||'loopx')},
 open(){this.s=1;this.res=null;$('wiz').showModal();this.render()},
 isLoc:u=>/localhost|127\.0\.0\.1/.test(u),
 blocked(u){return location.protocol==='https:'&&!window.Capacitor&&u.startsWith('http:')&&!Wizard.isLoc(u)},
 hint(e,url){const m=String(e.message||e);
  if(/Cannot reach/.test(m)){
   if(this.isLoc(url))return 'localhost means "this phone" here, so n8n cannot be found. Replace localhost with your computer\'s Wi-Fi IP.';
   if(this.blocked(url))return 'Browsers block http addresses on an https site. Use the LoopX APK app, or an https tunnel URL (Cloudflare Tunnel or ngrok).';
   return 'Cannot reach your computer. Check: 1) phone and computer are on the same Wi-Fi, 2) n8n is running, 3) the IP is right (open http://IP:5678 in the phone browser, the n8n page should load), 4) Windows Firewall allows port 5678.'}
  if(/ 404/.test(m))return 'n8n answered, but this webhook is not live. Turn the workflow Active and use the Production URL (webhook, not webhook-test).';
  if(/ 40[13]/.test(m))return 'n8n refused the request. Check the webhook Authentication setting, and set Allowed Origins to * in the Webhook node.';
  if(/ 5\d\d/.test(m))return 'The workflow ran but failed. In n8n open Executions to see which node is red.';
  if(/Timed out/.test(m))return 'n8n did not reply in time. The workflow must end with a Respond to Webhook node.';
  return m},
 prev(){const u=this.url(),p=$('wPrev');if(p)p.textContent=u;const w=$('wWarn');if(w)w.textContent=this.isLoc(u)?'localhost is the phone itself. Use the computer\'s IP.':''},
 async test(){const url=this.url();this.res={w:1};this.render();
  try{if(this.blocked(url))throw new Error('Cannot reach');
   const r=await N8N.send({name:'t',webhook:url,token:''},{id:'test',msgs:[]},'ping',{test:true});this.res={ok:1,t:String(r.reply).slice(0,120)}}
  catch(e){this.res={ok:0,t:this.hint(e,url)}}this.render()},
 save(){const d=Store.d,url=this.url();
  d.apps=d.apps.filter(a=>!(a.id==='a1'&&a.ok==null&&/localhost/.test(a.webhook)));
  const a={id:Store.uid(),name:this.name.trim()||'My Automation',webhook:url,token:'',ok:true};d.apps.push(a);d.activeApp=a.id;d.activeChat=null;Store.save();
  $('wiz').close();Main.refresh();Main.go('chat');toast('Connected. Send your first message!')},
 render(){const s=this.s,on=(id,f)=>{const e=$(id);if(e)e.onclick=f};
  let h='<div class="dots">'+[1,2,3].map(i=>`<i class="${i<=s?'on':''}"></i>`).join('')+'</div>';
  if(s===1)h+=`<h3>Step 1 of 3: Put the workflow in n8n</h3><ol class="wsteps"><li>Get the file <code>loopx-starter-workflow.json</code>. Tap the button below, or download it from your GitHub repo on the computer.</li><li>On the computer open n8n, then Workflows, then <b>Import from file</b>, and pick that file.</li><li>Turn the <b>Active</b> switch ON (top right of the workflow).</li></ol><button id="wDl">Get starter workflow</button><div class="btns"><button id="wX">Close</button><button class="primary" id="wN">Done, next</button></div>`;
  if(s===2){h+=`<h3>Step 2 of 3: Your computer's address</h3><div class="seg"><button id="mIp" class="${this.mode==='ip'?'on':''}">Same Wi-Fi</button><button id="mUrl" class="${this.mode==='url'?'on':''}">Paste full URL</button></div>`;
   h+=this.mode==='ip'?`<ol class="wsteps"><li><b>Windows:</b> press Win + R, type <code>cmd</code>, press Enter, type <code>ipconfig</code>. Copy the number next to <b>IPv4 Address</b>.<br><b>Mac:</b> System Settings, Wi-Fi, Details, IP address.</li><li>Type it below.</li></ol><label>Computer IP<input id="wIp" inputmode="decimal" placeholder="192.168.1.20" value="${esc(this.ip)}"></label><label>Port<input id="wPort" inputmode="numeric" value="${esc(this.port)}"></label><label>Webhook path<input id="wPath" value="${esc(this.path)}"></label><p class="mut">Quick check: open <code>http://YOUR-IP:5678</code> in your phone's Chrome. If the n8n page opens, the address is right.</p>`
    :`<label>Full webhook URL<input id="wFull" inputmode="url" placeholder="https://xxxx.trycloudflare.com/webhook/loopx" value="${esc(this.full)}"></label><p class="mut">Use this for a Cloudflare Tunnel or ngrok address. It works from anywhere and in the browser too.</p>`;
   h+=`<div class="prev" id="wPrev"></div><div class="warn" id="wWarn"></div><div class="btns"><button id="wB">Back</button><button class="primary" id="wN">Next</button></div>`}
  if(s===3){const r=this.res;
   h+=`<h3>Step 3 of 3: Test and save</h3><div class="prev">${esc(this.url())}</div><label>Name this automation<input id="wName" value="${esc(this.name)}"></label>`+
   (r?(r.w?'<div class="res">Testing…</div>':`<div class="res ${r.ok?'ok':'bad'}">${r.ok?'Connected. n8n replied: '+esc(r.t):esc(r.t)}</div>`):'<p class="mut">Press Test. n8n must show the workflow as Active.</p>')+
   `<div class="btns"><button id="wB">Back</button><button id="wT">Test</button><button class="primary" id="wS" ${r&&r.ok?'':'disabled'}>Save</button></div>`}
  $('wizBody').innerHTML=h;
  on('wDl',()=>Starter.download());on('wX',()=>$('wiz').close());on('wB',()=>{this.s--;this.render()});
  on('mIp',()=>{this.mode='ip';this.render()});on('mUrl',()=>{this.mode='url';this.render()});
  on('wN',()=>{if(s===2){const u=this.url();
    if(this.mode==='ip'&&(!this.ip.trim()||this.isLoc(this.ip)))return toast('Enter your computer\'s IP, not localhost');
    if(this.mode==='url'&&!/^https?:\/\/.+/.test(u))return toast('URL must start with http or https')}
   this.s++;this.res=null;this.render()});
  on('wT',()=>this.test());on('wS',()=>this.save());
  [['wIp','ip'],['wPort','port'],['wPath','path'],['wFull','full'],['wName','name']].forEach(([id,k])=>{const e=$(id);if(e)e.oninput=ev=>{this[k]=ev.target.value;this.prev()}});
  this.prev()}};
