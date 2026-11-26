// Feature: saved data (apps, chats, outputs, theme)
const Store={key:'loopx.v2',d:null,
 uid:()=>Math.random().toString(36).slice(2,9),
 load(){let o=null;try{o=JSON.parse(localStorage.getItem(this.key)||localStorage.getItem('flowchat.v1'))}catch(e){}
  this.d=Object.assign({apps:[],chats:[],outs:[],log:[],theme:'ocean',activeApp:null,activeChat:null},o||{});
  if(!this.d.apps.length){this.d.apps.push({id:'a1',name:'My Automation',webhook:'http://localhost:5678/webhook/loopx',token:'',ok:null});this.d.activeApp='a1'}
  if(!this.app())this.d.activeApp=this.d.apps[0].id},
 save(){try{localStorage.setItem(this.key,JSON.stringify(this.d))}catch(e){}},
 app:(id)=>Store.d.apps.find(a=>a.id===(id||Store.d.activeApp)),
 chat:()=>Store.d.chats.find(c=>c.id===Store.d.activeChat),
 newChat(){const c={id:this.uid(),appId:this.d.activeApp,title:'New chat',msgs:[],ts:Date.now()};this.d.chats.push(c);this.d.activeChat=c.id;this.save();return c}};
