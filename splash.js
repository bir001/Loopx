// Feature: animated splash screen on every app open
window.addEventListener('load',()=>setTimeout(()=>{const e=document.getElementById('splash');if(!e)return;e.classList.add('hide');setTimeout(()=>e.remove(),600)},1700));
