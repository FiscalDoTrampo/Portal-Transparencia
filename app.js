'use strict';
const D=window.DADOS;
const el=id=>document.getElementById(id);
const mes=el('mes');
const mesValue=()=>mes&&mes.value?mes.value:'';
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
function receipt(path){
 if(typeof path!=='string' || !path)return null;
 if(/^comprovantes\/[a-zA-Z0-9_./-]+$/.test(path) && !path.includes('..'))return path;
 try{const u=new URL(path);if(u.protocol==='https:' && !u.username && !u.password)return u.href;}catch{}
 return null;
}
let tipo='';
function periodRows(){const p=mesValue();return D.movimentos.filter(m=>!p || m.data.startsWith(p));}
function visibleRows(){const q=el('busca').value.trim().toLocaleLowerCase('pt-BR');return periodRows().filter(m=>(!tipo||m.tipo===tipo)&&[m.descricao,m.categoria,m.id].join(' ').toLocaleLowerCase('pt-BR').includes(q)).sort((a,b)=>b.data.localeCompare(a.data)||a.id.localeCompare(b.id));}
function summary(){
 const rows=periodRows(),ins=rows.filter(m=>m.tipo==='entrada').reduce((s,m)=>s+m.valorCentavos,0),outs=rows.filter(m=>m.tipo==='saida').reduce((s,m)=>s+m.valorCentavos,0);
 const through=D.movimentos.filter(m=>!mesValue() || m.data.slice(0,7)<=mesValue());
 const saldo=through.reduce((s,m)=>s+(m.tipo==='entrada'?m.valorCentavos:-m.valorCentavos),D.saldoInicialCentavos);
 el('entradas').textContent=money(ins);el('saidas').textContent=money(outs);el('saldo').textContent=money(saldo);
 el('saldo-legenda').textContent=mesValue()?'Saldo acumulado até o fim do mês':'Saldo inicial + doações − despesas';
 el('categorias').replaceChildren();
 const groups={};for(const m of rows.filter(m=>m.tipo==='saida')) groups[m.categoria]=(groups[m.categoria]||0)+m.valorCentavos;
 for(const [name,value] of Object.entries(groups).sort((a,b)=>b[1]-a[1])){
  const item=document.createElement('div'),head=document.createElement('div');head.className='category-head';const label=document.createElement('span'),val=document.createElement('span');label.textContent=name;val.textContent=money(value)+' · '+Math.round(value/outs*100)+'%';head.append(label,val);
  const track=document.createElement('div'),bar=document.createElement('div');track.className='track';bar.className='bar';bar.style.width=(value/outs*100)+'%';track.append(bar);item.append(head,track);el('categorias').append(item);
 }
 if(!outs)el('categorias').textContent='Nenhuma despesa registrada neste período.';
}
function table(){
 const rows=visibleRows();el('linhas').replaceChildren();
 for(const m of rows){const tr=document.createElement('tr');const cells=Array.from({length:5},()=>document.createElement('td'));cells[0].textContent=date(m.data);cells[1].textContent=m.descricao;const cat=document.createElement('small');cat.textContent=m.categoria+' · '+m.id;cells[1].append(cat);const badge=document.createElement('span');badge.className='tag '+m.tipo;badge.textContent=m.tipo==='entrada'?'Doação':'Despesa';cells[2].append(badge);cells[3].className='amount '+(m.tipo==='entrada'?'positive':'negative');cells[3].textContent=(m.tipo==='entrada'?'+ ':'− ')+money(m.valorCentavos);
  const url=receipt(m.comprovante);if(url){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Consultar ↗';a.setAttribute('aria-label','Consultar comprovante de '+m.descricao);cells[4].append(a);}else{const s=document.createElement('span');s.className='unavailable';s.textContent='Não disponível';cells[4].append(s);}tr.append(...cells);el('linhas').append(tr);
 }
 if(!rows.length){const tr=document.createElement('tr'),td=document.createElement('td');td.colSpan=5;td.className='empty';td.textContent='Nenhuma movimentação encontrada para os filtros selecionados.';tr.append(td);el('linhas').append(tr);}
 el('contagem').textContent=rows.length+' movimentaç'+(rows.length===1?'ão':'ões');
}
function csv(){
 const safe=v=>'"'+String(v).replace(/^[=+@\-\t\r]/,"'$&").replace(/"/g,'""')+'"';
 const rows=[['ID','Data','Tipo','Descrição','Categoria','Valor (R$)','Comprovante'],...visibleRows().map(m=>[m.id,date(m.data),m.tipo,m.descricao,m.categoria,(m.valorCentavos/100).toFixed(2).replace('.',','),receipt(m.comprovante)||''])];
 const blob=new Blob(['\uFEFF'+rows.map(r=>r.map(safe).join(';')).join('\r\n')],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='movimentacoes-'+(mesValue()||'todos')+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
try{
 validate(D);document.title=D.nome+' | Transparência';if(el('descricao'))el('descricao').textContent=D.descricao;if(el('sobre-texto'))el('sobre-texto').textContent=D.sobre;if(el('atualizacao'))el('atualizacao').textContent='Última atualização dos dados: '+date(D.atualizadoEm);
 if(mes){const months=[...new Set(D.movimentos.map(m=>m.data.slice(0,7)))].sort().reverse();for(const month of months){const opt=document.createElement('option');opt.value=month;opt.textContent=new Date(month+'-15T12:00:00Z').toLocaleDateString('pt-BR',{month:'long',year:'numeric',timeZone:'UTC'});mes.append(opt);}}
 if(mes)mes.addEventListener('change',()=>{summary();table();});el('busca').addEventListener('input',table);
 for(const b of document.querySelectorAll('[data-tipo]'))b.addEventListener('click',()=>{tipo=b.dataset.tipo;for(const t of document.querySelectorAll('[data-tipo]')){t.classList.toggle('active',t===b);t.setAttribute('aria-pressed',String(t===b));}table();});
 el('csv').addEventListener('click',csv);el('imprimir').addEventListener('click',()=>window.print());summary();table();
}catch(error){console.error(error);const aviso=document.createElement('p');aviso.className='erro';aviso.setAttribute('role','alert');aviso.textContent='Não foi possível carregar as apurações. O responsável precisa revisar o arquivo de dados.';const alvo=document.querySelector('main')||document.body;alvo.prepend(aviso);}

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
