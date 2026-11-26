// Feature: centre chat (input -> n8n -> reply + output)
const Chat={
 render(){const c=Store.chat(),box=$('msgs');box.innerHTML='';
  const sel=$('chatApp');sel.innerHTML=Store.d.apps.map(a=>`<option value="${a.id}">${esc(a.name)}</option>`).join('');sel.value=Store.d.activeApp;
  if(!c||!c.msgs.length){box.innerHTML='<div class="empty"><img src="icon-192.png" alt=""><b>What should your automation do?</b><span>Replies show here. Dashboards open in the output panel.</span><div class="sugs"><button class="sug">Hello</button><button class="sug">Run my automation</button><button class="sug">Show today\'s report</button></div></div>';box.querySelectorAll('.sug').forEach(b=>b.onclick=()=>{$('input').value=b.textContent;$('input').focus()})}
  else c.msgs.forEach(m=>this.bubble(m));
  box.scrollTop=box.scrollHeight},
 bubble(m){const d=document.createElement('div');d.className='m '+(m.role==='me'?'me':'bot')+(m.err?' err':'');d.textContent=m.text;
  if(m.out){const b=document.createElement('button');b.className='chip';b.textContent='View output';b.onclick=()=>Sheet.open(m.out);d.append(document.createElement('br'),b)}
  if(m.role!=='me'&&!m.err&&m.text!=='Working…'){const c=document.createElement('button');c.className='chip';c.textContent='Copy';c.onclick=()=>navigator.clipboard.writeText(m.text).then(()=>toast('Copied'));d.append(' ',c)}
  $('msgs').appendChild(d);d.scrollIntoView({block:'end'});return d},
 async send(){const inp=$('input'),text=inp.value.trim();if(!text)return;
  const app=Store.app(),c=Store.chat()||Store.newChat();c.appId=app.id;
  if(!c.msgs.length){c.title=text.slice(0,40);$('msgs').innerHTML=''}
  const me={role:'me',text};c.msgs.push(me);c.ts=Date.now();this.bubble(me);inp.value='';inp.style.height='auto';Store.save();Sidebar.render();
  const w=this.bubble({role:'bot',text:'Working…'});w.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';let ok=true,bot;
  try{const r=await N8N.send(app,c,text);bot={role:'bot',text:r.reply};
   if(r.dash){const o={id:Store.uid(),ts:Date.now(),app:app.name,title:(r.dash&&r.dash.title)||c.title,data:r.dash};Store.d.outs.unshift(o);Store.d.outs=Store.d.outs.slice(0,60);bot.out=o.id;Sheet.open(o.id)}
   app.ok=true}
  catch(e){ok=false;app.ok=false;bot={role:'bot',err:1,text:e.message+'\nCheck: workflow is Active, webhook URL is correct, and the phone can reach your computer (use its Wi-Fi IP, not localhost).'}}
  Store.d.log.push({ts:Date.now(),ok});Store.d.log=Store.d.log.slice(-200);c.msgs.push(bot);Store.save();w.remove();this.bubble(bot);Main.pill()}};
