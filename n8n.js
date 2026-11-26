// Feature: talk to n8n webhook
const N8N={
 async send(app,chat,message,extra={}){
  const h={'Content-Type':'application/json'};if(app.token)h.Authorization='Bearer '+app.token;
  const ctl=new AbortController(),t=setTimeout(()=>ctl.abort(),120000);
  let res;try{res=await fetch(app.webhook,{method:'POST',headers:h,signal:ctl.signal,body:JSON.stringify(Object.assign({message,chatId:chat.id,appId:app.id,history:chat.msgs.slice(-10)},extra))})}
  catch(e){throw new Error(e.name==='AbortError'?'Timed out after 120s.':'Cannot reach '+app.webhook)}finally{clearTimeout(t)}
  const raw=await res.text();
  if(!res.ok)throw new Error('n8n returned '+res.status+(res.status===404?' (workflow not active, or wrong path)':'')+'. '+raw.slice(0,160));
  let j;try{j=JSON.parse(raw)}catch(e){return{reply:raw,dash:null}}
  if(Array.isArray(j)&&j.length===1)j=j[0];
  if(typeof j==='string')return{reply:j,dash:null};
  const dash=j.dashboard??j.data??(Array.isArray(j)?j:null);
  return{reply:j.reply??j.output??j.text??j.message??(dash?'Output is ready.':JSON.stringify(j)),dash}
 }};
