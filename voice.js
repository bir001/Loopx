// Feature: mic button (speech to text). Change r.lang to 'hi-IN' for Hindi.
const Voice={init(){const SR=window.SpeechRecognition||window.webkitSpeechRecognition,b=$('mic');if(!SR){b.style.display='none';return}
 let r=null,on=false;
 b.onclick=()=>{if(on){r.stop();return}
  r=new SR();r.lang='en-IN';r.interimResults=true;r.continuous=false;const base=$('input').value;
  r.onresult=e=>{$('input').value=(base?base+' ':'')+[...e.results].map(x=>x[0].transcript).join('')};
  r.onstart=()=>{on=true;b.classList.add('rec')};r.onend=()=>{on=false;b.classList.remove('rec')};
  r.onerror=()=>toast('Voice input is not available here');
  try{r.start()}catch(e){}}}};
