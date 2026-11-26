// Start-up: router + events
const Main={
 go(s,guide){document.querySelectorAll('.screen').forEach(e=>e.classList.toggle('on',e.id==='s-'+s));document.querySelectorAll('#nav [data-go]').forEach(b=>b.classList.toggle('on',b.dataset.go===s&&!b.classList.contains('fab')));
  document.body.dataset.s=s;this.refresh();this.closeAll();if(s==='flows'&&guide)$('guide').scrollIntoView()},
 closeAll(){document.body.classList.remove('openL','openR')},
 pill(){const a=Store.app();$('pill').innerHTML=`<i class="dot ${a.ok===true?'ok':a.ok===false?'bad':''}"></i>${esc(a.name)}`},
 refresh(){Sidebar.render();Home.render();Flows.render();Outs.render();Chat.render();this.pill();this.bind()},
 bind(){document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>{if(b.dataset.new){Store.d.activeChat=null;Store.save()}this.go(b.dataset.go,b.dataset.guide)})},
 init(){Store.load();Sidebar.theme(Store.d.theme);
  document.querySelectorAll('[data-ico]').forEach(e=>e.innerHTML=ico(e.dataset.ico));
  $('btnMenu').onclick=()=>document.body.classList.add('openL');$('btnOut').onclick=()=>{const o=Store.d.outs[0];o?Sheet.open(o.id):toast('No output yet')};
  $('closeL').onclick=$('scrim').onclick=()=>this.closeAll();$('closeR').onclick=()=>Sheet.close();
  $('send').onclick=()=>Chat.send();$('chatApp').onchange=e=>{Store.d.activeApp=e.target.value;Store.save();this.pill()};
  $('input').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&innerWidth>900){e.preventDefault();Chat.send()}});
  $('input').addEventListener('input',e=>{e.target.style.height='auto';e.target.style.height=Math.min(e.target.scrollHeight,150)+'px'});
  $('dlg').addEventListener('close',()=>{});$('fSave').onclick=e=>{if(!Flows.save())e.preventDefault()};
  this.go('home');
  if('serviceWorker' in navigator&&!window.Capacitor&&location.protocol.startsWith('http'))navigator.serviceWorker.register('sw.js').catch(()=>{})}};
Main.init();
