'use strict';
const D=window.DADOS;
const el=id=>document.getElementById(id);
const money=n=>(n/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const date=s=>s.split('-').reverse().join('/');
const validDate=s=>typeof s==='string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s+'T12:00:00Z')) && new Date(s+'T12:00:00Z').toISOString().slice(0,10)===s;
function validate(d){
 if(!d || !Array.isArray(d.movimentos) || !Number.isSafeInteger(d.saldoInicialCentavos) || !validDate(d.atualizadoEm)) throw Error('Configuração inválida');
 const ids=new Set();let total=Math.abs(d.saldoInicialCentavos);
 for(const m of d.movimentos){
  if(!m.id || ids.has(m.id) || !validDate(m.data) || !['entrada','saida'].includes(m.tipo) || !Number.isSafeInteger(m.valorCentavos) || m.valorCentavos<=0 || typeof m.descricao!=='string' || typeof m.categoria!=='string')throw Error('Lançamento inválido ou identificador duplicado');
  total+=m.valorCentavos;if(!Number.isSafeInteger(total))throw Error('Total excede o limite de precisão');ids.add(m.id);
 }
}
try{
 validate(D);
 document.title=D.nome+' | Transparência';
 if(el('atualizacao'))el('atualizacao').textContent='Última atualização dos dados: '+date(D.atualizadoEm);
 const doacoes=D.movimentos.filter(m=>m.tipo==='entrada').reduce((s,m)=>s+m.valorCentavos,0);
 if(el('entradas'))el('entradas').textContent=money(doacoes);
}catch(error){
 console.error(error);
 const aviso=document.createElement('p');
 aviso.className='erro';
 aviso.setAttribute('role','alert');
 aviso.textContent='Não foi possível carregar as informações. O responsável precisa revisar o arquivo de dados.';
 const alvo=document.querySelector('main')||document.body;
 alvo.prepend(aviso);
}

/* Popup de doacao (Pix) */
(function(){
 const dlg=document.getElementById('doacao');
 if(!dlg)return;
 const PIX='00020126330014BR.GOV.BCB.PIX0111028174751275204000053039865802BR5922Guilherme Silva Borges6009SAO PAULO62140510pguAOtUdK6630453B3';
 let origem=null;
 function abrir(){origem=document.activeElement;dlg.hidden=false;document.body.style.overflow='hidden';var x=dlg.querySelector('.doacao-x');if(x)x.focus();}
 function fechar(){dlg.hidden=true;document.body.style.overflow='';if(origem&&origem.focus)origem.focus();}
 var abridor=document.getElementById('abrir-doacao');
 if(abridor)abridor.addEventListener('click',abrir);
 dlg.addEventListener('click',function(e){if(e.target.closest('[data-fechar]'))fechar();});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!dlg.hidden)fechar();});
 var copiar=document.getElementById('copiar-pix'),aviso=document.getElementById('pix-copiado');
 function responder(t){if(aviso)aviso.textContent=t;}
 if(copiar)copiar.addEventListener('click',function(){
  function ok(){responder('Código Pix copiado.');setTimeout(function(){responder('');},4000);}
  function reserva(){
   var ta=document.createElement('textarea');ta.value=PIX;ta.setAttribute('readonly','');ta.style.position='fixed';ta.style.opacity='0';
   document.body.appendChild(ta);ta.select();var deu=false;
   try{deu=document.execCommand('copy');}catch(err){deu=false;}
   document.body.removeChild(ta);
   if(deu)ok();else responder('Não foi possível copiar automaticamente.');
  }
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(PIX).then(ok,reserva);
  else reserva();
 });
})();
