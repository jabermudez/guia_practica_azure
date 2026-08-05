const root=document.body;
const theme=document.querySelector('#theme');
if(localStorage.getItem('azure-theme')==='dark')root.classList.add('dark');
theme.addEventListener('click',()=>{root.classList.toggle('dark');localStorage.setItem('azure-theme',root.classList.contains('dark')?'dark':'light')});

// La ubicación de Blob Storage cambia entre versiones del portal de Azure.
const storageCard=document.querySelector('.deep-card');
const storageSteps=storageCard?.querySelector('.portal-steps');
if(storageSteps){
  const step=storageSteps.children[6];
  if(step)step.innerHTML='Selecciona <b>Ir al recurso</b>. En <b>Información general</b>, busca la sección de servicios y selecciona <b>Blobs</b>. También puedes abrir el menú izquierdo, desplegar <b>Almacenamiento de datos</b> y seleccionar <b>Contenedores</b>.';
  const help=document.createElement('div');
  help.className='storage-help';
  help.innerHTML='<b>¿Todavía no aparece “Contenedores”?</b><ol><li>En el menú izquierdo usa <b>Buscar en el menú</b> y escribe <b>contenedores</b>.</li><li>Si no aparece, vuelve a <b>Información general</b> y selecciona el vínculo <b>Blobs</b>.</li><li>Comprueba en <b>Información general → Tipo de cuenta</b> que sea <b>uso general v2 (StorageV2)</b>. Una cuenta especializada <b>FileStorage</b> solo muestra recursos compartidos de archivos.</li><li>Si aparece un mensaje de permisos, solicita el rol <b>Colaborador de datos de Storage Blob</b> en <b>Control de acceso (IAM)</b>.</li></ol>';
  storageSteps.after(help);
}

document.querySelectorAll('.toggle').forEach(button=>button.addEventListener('click',()=>{
  const module=button.closest('.service-module');
  const open=module.classList.toggle('open');
  button.setAttribute('aria-expanded',String(open));
  button.textContent=open?'Cerrar módulo −':'Abrir módulo +';
}));

const tasks=[...document.querySelectorAll('[data-task]')];
const progressText=document.querySelector('#progressText');
const drawerPercent=document.querySelector('#drawerPercent');
const drawerBar=document.querySelector('#drawerBar');
function updateProgress(){
  const checked=tasks.filter(item=>item.checked).length;
  const value=tasks.length?Math.round(checked/tasks.length*100):0;
  progressText.textContent=`${value}%`;
  drawerPercent.textContent=`${value}%`;
  drawerBar.style.width=`${value}%`;
  localStorage.setItem('azure-progress',JSON.stringify(tasks.map(item=>item.checked)));
}
try{const saved=JSON.parse(localStorage.getItem('azure-progress'));if(Array.isArray(saved))tasks.forEach((item,index)=>item.checked=Boolean(saved[index]))}catch{}
tasks.forEach(item=>item.addEventListener('change',updateProgress));updateProgress();

const drawer=document.querySelector('#progressDrawer');
document.querySelector('#progressBtn').addEventListener('click',()=>drawer.hidden=!drawer.hidden);
document.querySelector('#closeProgress').addEventListener('click',()=>drawer.hidden=true);
document.querySelector('#resetProgress').addEventListener('click',()=>{tasks.forEach(item=>item.checked=false);updateProgress()});

document.querySelector('#checkQuiz').addEventListener('click',()=>{
  const fields=[...document.querySelectorAll('#quiz fieldset')];
  let correct=0,answered=0;
  fields.forEach(field=>{const selected=field.querySelector('input:checked');field.classList.remove('correct','incorrect');if(selected){answered++;if(selected.value===field.dataset.answer){correct++;field.classList.add('correct')}else field.classList.add('incorrect')}});
  const result=document.querySelector('#quizResult');
  result.textContent=answered<fields.length?`Respondiste ${answered} de ${fields.length}. Resultado parcial: ${correct}/${fields.length}.`:`Resultado: ${correct}/${fields.length}. ${correct===fields.length?'Excelente: ya tienes una base sólida.':'Revisa los módulos marcados en rojo.'}`;
});
