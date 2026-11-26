// Feature: ready-made n8n starter workflow (import in n8n: Workflows > Import from file)
const Starter={
 json:{name:'LoopX Starter',nodes:[
  {parameters:{httpMethod:'POST',path:'loopx',responseMode:'responseNode',options:{allowedOrigins:'*'}},id:'1c0f6d10-0000-4000-8000-000000000001',name:'Webhook',type:'n8n-nodes-base.webhook',typeVersion:2,position:[0,0],webhookId:'3b0c9a52-0000-4000-8000-0000000000aa'},
  {parameters:{respondWith:'json',responseBody:'={{ { "reply": "Received: " + $json.body.message, "dashboard": { "title": "Last request", "cards": [ { "label": "Characters", "value": String($json.body.message.length) }, { "label": "Messages so far", "value": String(($json.body.history || []).length) } ], "table": [ { "field": "chatId", "value": $json.body.chatId }, { "field": "app", "value": $json.body.appId } ] } } }}'},id:'1c0f6d10-0000-4000-8000-000000000002',name:'Respond to Webhook',type:'n8n-nodes-base.respondToWebhook',typeVersion:1.1,position:[260,0]}],
  connections:{Webhook:{main:[[{node:'Respond to Webhook',type:'main',index:0}]]}},settings:{executionOrder:'v1'}},
 download(){const b=new Blob([JSON.stringify(this.json,null,2)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='loopx-starter-workflow.json';a.click();toast('Saved. Import it in n8n.')}};
