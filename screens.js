// Feature: Home, Automations (connect guide) and Outputs screens
const Home={render(){
  const d=Store.d,day=new Date().toDateString(),today=d.log.filter(l=>new Date(l.ts).toDateString()===day).length,last=d.log[d.log.length-1];
  $('s-home').innerHTML=`<h1>Welcome back</h1><p class="mut">Your automations at a glance</p>
  <div class="hero"><img src="logo.png" alt=""><small>Runs today</small><strong>${today}</strong>
   <div class="chips"><span>${d.apps.length} automations</span><span>${d.outs.length} outputs</span><span>Last run: ${last?(last.ok?'OK':'Failed'):'none yet'}</span></div></div>
  <div class="tiles"><button data-go="chat" data-new="1"><i>${ico('plus')}</i>New Chat</button><button data-go="flows"><i>${ico('flow')}</i>Automations</button><button data-go="outs"><i>${ico('out')}</i>Outputs</button><button data-go="flows" data-guide="1"><i>${ico('check')}</i>Setup guide</button></div>
  <div class="card"><h3>Recent chats</h3>${[...d.chats].sort((a,b)=>b.ts-a.ts).slice(0,5).map(c=>`<div class="row" data-chat="${c.id}"><span class="dt">${fmt(c.ts)}</span><span class="grow">${esc(c.title)}<small>${esc((Store.app(c.appId)||{}).name||'')}</small></span></div>`).join('')||'<p class="mut">No chats yet. Tap New Chat to start.</p>'}</div>`;
  document.querySelectorAll('[data-chat]').forEach(r=>r.onclick=()=>{d.activeChat=r.dataset.chat;d.activeApp=Store.chat().appId;Store.save();Main.go('chat')})}};
const Flows={
 render(){const d=Store.d;
  $('s-flows').innerHTML=`<div class="rowh"><h1>Automations</h1><button class="primary sm" id="addFlow">+ Connect</button></div>
  ${d.apps.map(a=>`<div class="card app${a.id===d.activeApp?' act':''}"><div class="rowh"><b><i class="dot ${a.ok===true?'ok':a.ok===false?'bad':''}"></i>${esc(a.name)}</b><span class="mut">${a.id===d.activeApp?'Selected':''}</span></div>
   <code>${esc(a.webhook)}</code><div class="btns"><button data-t="${a.id}">Test</button><button data-u="${a.id}">Use</button><button data-e="${a.id}">Edit</button><button data-x="${a.id}">Delete</button></div></div>`).join('')}
  <div class="card" id="guide"><h3>Connect n8n in 4 steps</h3><ol>
   <li>Download the starter workflow and import it in n8n (Workflows, then Import from file).</li>
   <li>Open the Webhook node and copy the <b>Production URL</b>. Switch the workflow to <b>Active</b>.</li>
   <li>On your phone, replace <code>localhost</code> with your computer's Wi-Fi IP, for example <code>http://192.168.1.20:5678/webhook/loopx</code>.</li>
   <li>Tap Connect, paste the URL, then press Test.</li></ol>
   <button class="primary" id="dlWf">${ico('dl')} Download starter workflow</button>
   <p class="mut">Replies: send JSON like <code>{"reply":"text","dashboard":{"title":"Report","cards":[{"label":"Sales","value":"12"}],"table":[{"a":1}]}}</code></p></div>`;
  $('addFlow').onclick=()=>this.edit();$('dlWf').onclick=()=>Starter.download();
  const q=(a,f)=>document.querySelectorAll(`[data-${a}]`).forEach(b=>b.onclick=()=>f(b.dataset[a]));
  q('t',id=>this.test(id));q('u',id=>{d.activeApp=id;Store.save();Main.refresh();toast('Selected')});q('e',id=>this.edit(id));
  q('x',id=>{if(d.apps.length<2)return toast('Keep at least one automation');if(!confirm('Delete this automation?'))return;d.apps=d.apps.filter(a=>a.id!==id);if(d.activeApp===id)d.activeApp=d.apps[0].id;Store.save();Main.refresh()})},
 edit(id){const a=id?Store.app(id):{name:'',webhook:'',token:''};$('fName').value=a.name;$('fUrl').value=a.webhook;$('fTok').value=a.token||'';
  $('dlg').dataset.id=id||'';$('dlg').showModal()},
 save(){const id=$('dlg').dataset.id,name=$('fName').value.trim(),url=$('fUrl').value.trim();if(!name||!/^https?:\/\//.test(url)){toast('Enter a name and a URL starting with http');return false}
  if(id){Object.assign(Store.app(id),{name,webhook:url,token:$('fTok').value.trim(),ok:null})}
  else{const a={id:Store.uid(),name,webhook:url,token:$('fTok').value.trim(),ok:null};Store.d.apps.push(a);Store.d.activeApp=a.id}
  Store.save();Main.refresh();return true},
 async test(id){const a=Store.app(id);toast('Testing…');
  try{await N8N.send(a,{id:'test',msgs:[]},'ping',{test:true});a.ok=true;toast('Connected: n8n replied')}
  catch(e){a.ok=false;toast(e.message.slice(0,90))}Store.save();Main.refresh()}};
const Outs={render(){$('s-outs').innerHTML=`<h1>Outputs</h1><p class="mut">Everything your automations sent back</p>`+(Store.d.outs.map(o=>`<div class="card row" data-o="${o.id}"><span class="dt">${fmt(o.ts)}</span><span class="grow">${esc(o.title)}<small>${esc(o.app)}</small></span></div>`).join('')||'<div class="card"><p class="mut">No outputs yet. Return a "dashboard" from n8n and it will appear here.</p></div>');
  document.querySelectorAll('[data-o]').forEach(r=>r.onclick=()=>Sheet.open(r.dataset.o))}};
