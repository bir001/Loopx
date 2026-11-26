// Feature: left drawer (themes, menu, history)
const THEMES={ocean:['Ocean','#0b86bf','#2db6e5','#06415f','#cfeaf5'],royal:['Royal Blue','#1d4ed8','#5b8cff','#142a73','#dbe4fb'],midnight:['Midnight','#3b82f6','#7c9cff','#0b1220','#090e18',1],indigo:['Indigo','#4338ca','#8b7bff','#241a6b','#e0defa'],emerald:['Emerald','#0f8a4b','#34d399','#063f27','#d6f0e3'],rose:['Rose','#be1e5a','#fb7aa6','#5e0f2f','#fadde8']};
const Sidebar={
 theme(k){const t=THEMES[k]||THEMES.ocean,s=document.documentElement.style;s.setProperty('--a',t[1]);s.setProperty('--a2',t[2]);s.setProperty('--h1',t[3]);s.setProperty('--bg',t[4]);document.body.classList.toggle('dark',!!t[5]);Store.d.theme=k;Store.save()},
 render(){
  $('themes').innerHTML=Object.entries(THEMES).map(([k,t])=>`<button class="th${Store.d.theme===k?' on':''}" data-k="${k}"><i style="background:linear-gradient(135deg,${t[3]},${t[2]})"></i>${t[0]}</button>`).join('');
  document.querySelectorAll('.th').forEach(b=>b.onclick=()=>{this.theme(b.dataset.k);this.render()});
  const h=$('history');h.innerHTML='';
  [...Store.d.chats].sort((a,b)=>b.ts-a.ts).slice(0,40).forEach(c=>{const li=document.createElement('li');if(c.id===Store.d.activeChat)li.className='on';
   li.innerHTML=`<span>${esc(c.title)}<small>${esc((Store.app(c.appId)||{}).name||'')}</small></span><b title="Delete">✕</b>`;
   li.onclick=()=>{Store.d.activeChat=c.id;Store.d.activeApp=c.appId;Store.save();Main.go('chat');Main.closeAll()};
   li.querySelector('b').onclick=e=>{e.stopPropagation();if(!confirm('Delete this chat?'))return;Store.d.chats=Store.d.chats.filter(k=>k.id!==c.id);if(Store.d.activeChat===c.id)Store.d.activeChat=null;Store.save();Main.refresh()};
   h.appendChild(li)})}};
const Sheet={open(id){const o=Store.d.outs.find(x=>x.id===id);if(!o)return;$('sheetTitle').textContent=o.title;Dash.show(o.data);document.body.classList.add('openR')},close(){document.body.classList.remove('openR')}};
