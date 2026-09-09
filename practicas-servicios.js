const body=document.body;
const themeButton=document.querySelector('#theme');
if(localStorage.getItem('azure-theme')==='dark')body.classList.add('dark');
themeButton?.addEventListener('click',()=>{
  body.classList.toggle('dark');
  localStorage.setItem('azure-theme',body.classList.contains('dark')?'dark':'light');
});

const checks=[...document.querySelectorAll('[data-lab-check]')];
const progressValue=document.querySelector('#progressValue');
const panelValue=document.querySelector('#panelValue');
const progressBar=document.querySelector('#progressBar');
const sideBar=document.querySelector('#sideProgressBar');
const sideText=document.querySelector('#sideProgressText');
const storageKey='azure-network-server-labs-v2';

function readProgress(){
  try{return JSON.parse(localStorage.getItem(storageKey))||{}}catch{return {}}
}
function updateProgress(){
  const state={};
  checks.forEach(check=>state[check.id]=check.checked);
  localStorage.setItem(storageKey,JSON.stringify(state));
  const done=checks.filter(check=>check.checked).length;
  const percent=checks.length?Math.round(done/checks.length*100):0;
  if(progressValue)progressValue.textContent=`${percent}%`;
  if(panelValue)panelValue.textContent=`${percent}%`;
  if(progressBar)progressBar.style.width=`${percent}%`;
  if(sideBar)sideBar.style.width=`${percent}%`;
  if(sideText)sideText.textContent=`${done} de ${checks.length} comprobaciones`;
}
const saved=readProgress();
checks.forEach(check=>{
  check.checked=Boolean(saved[check.id]);
  check.addEventListener('change',updateProgress);
});
updateProgress();

const panel=document.querySelector('#progressPanel');
document.querySelector('#progressButton')?.addEventListener('click',()=>{panel.hidden=!panel.hidden});
document.querySelector('#closeProgress')?.addEventListener('click',()=>{panel.hidden=true});
document.querySelector('#resetProgress')?.addEventListener('click',()=>{
  if(!window.confirm('¿Borrar todas las marcas de estas prácticas en este navegador?'))return;
  checks.forEach(check=>check.checked=false);
  updateProgress();
});
document.querySelector('#printGuide')?.addEventListener('click',()=>window.print());

document.querySelectorAll('.copy-button').forEach(button=>button.addEventListener('click',async()=>{
  const code=button.closest('.code-box')?.querySelector('pre code')?.innerText||'';
  try{
    await navigator.clipboard.writeText(code);
    button.textContent='Copiado ✓';
    button.classList.add('copied');
    setTimeout(()=>{button.textContent='Copiar';button.classList.remove('copied')},1800);
  }catch{
    button.textContent='Selecciona el texto';
    setTimeout(()=>button.textContent='Copiar',2200);
  }
}));

const navLinks=[...document.querySelectorAll('.side-index a[href^="#lab-"]')];
const sections=navLinks.map(link=>document.querySelector(link.getAttribute('href'))).filter(Boolean);
if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    const visible=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(!visible)return;
    navLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')===`#${visible.target.id}`));
  },{rootMargin:'-20% 0px -65% 0px',threshold:[0,.2,.5]});
  sections.forEach(section=>observer.observe(section));
}
