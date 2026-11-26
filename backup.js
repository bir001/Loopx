// Feature: export / import all app data (apps, chats, outputs, theme)
const Backup={init(){
 $('bkExp').onclick=()=>saveFile('loopx-backup.json',JSON.stringify(Store.d));
 $('bkImp').onclick=()=>$('bkFile').click();
 $('bkFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;
  try{const d=JSON.parse(await f.text());if(!Array.isArray(d.apps)||!d.apps.length)throw 0;Store.d=Object.assign(Store.d,d);Store.save();Sidebar.theme(Store.d.theme);Main.refresh();toast('Backup restored')}
  catch(x){toast('Not a valid LoopX backup file')}e.target.value=''}}};
