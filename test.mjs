import assert from 'node:assert/strict';
import * as r from './dist/rules.mjs';
import {phaseOf,findRoute,walkableGrid} from './dist/crew.mjs';
import {staticObstacles,bounds,start,spots,rosters,people,tank,playerLook} from './dist/layout.mjs';
const IDS={
 supervisor:['capacitacao','caracterizar','isolar','equipe','energias','detector','avaliacao','ventilar','reavaliar','emergencia','pet','orientar','alarme','prorrogar','encerrar'],
 vigia:['capacitacao','posto','lista','contagem','comunicacao','movimentador','substituicao','monitor','abandono','resgate','comunicar','fim'],
 trabalhador:['capacitacao','sinalizacao','riscos','pet','bloqueio','equipamento','entrada','dentro','sintoma','abandono','colega','fim']
};
const has=m=>r.MODULE_IDS.includes(m);
const correctOf=o=>o.choices.find(c=>c.correct);
const pos=(m,id)=>r.indexOf(m,id);
const obj=(m,id)=>r.objectivesOf(m)[pos(m,id)];
const at=(m,id)=>({...r.initialState(m),step:pos(m,id),completed:IDS[m].slice(0,pos(m,id))});
const after=(m,id)=>({...r.initialState(m),step:pos(m,id)+1,completed:IDS[m].slice(0,pos(m,id)+1),finished:pos(m,id)+1===IDS[m].length});

// 1. Módulos, ordem e quantidade das etapas
assert.ok(r.MODULE_IDS.length>=1&&r.MODULE_IDS.every(m=>IDS[m]),'Módulos conhecidos');
for(const m of r.MODULE_IDS){
 assert.deepEqual(r.objectivesOf(m).map(o=>o.id),IDS[m],`${m}: ordem das etapas`);
 assert.equal(new Set(IDS[m]).size,IDS[m].length,`${m}: ids únicos`);
 const M=r.MODULES[m];assert.ok(M.name&&M.course&&M.role&&M.intro&&M.summary&&M.place&&M.short,`${m}: textos do módulo`);
 assert.ok(rosters[m]&&playerLook[m],`${m}: equipe e aparência do jogador`);
}

// 2. Cada decisão: três opções, uma única correta, feedback didático em todas
for(const m of r.MODULE_IDS)for(const o of r.objectivesOf(m)){
 assert.ok(o.title&&o.description&&o.tip,`${m}/${o.id}: título, descrição e dica`);
 assert.equal(o.choices.length,3,`${m}/${o.id}: três opções`);
 assert.equal(o.choices.filter(c=>c.correct).length,1,`${m}/${o.id}: uma única correta`);
 assert.equal(new Set(o.choices.map(c=>c.id)).size,3,`${m}/${o.id}: ids das opções únicos`);
 for(const c of o.choices)assert.ok(c.label&&c.feedback&&c.feedback.length>25,`${m}/${o.id}/${c.id}: feedback didático`);
}

// 3. Referências: origem válida e itens da NR 33 conferidos no texto em vigor (Portaria SEPRT 1.690/2022)
const NR33=['33.2.2','33.2.2.1','33.3.1','33.3.3','33.3.4','33.3.5','33.3.6','33.4.2','33.5.1','33.5.2','33.5.3','33.5.4','33.5.5','33.5.6','33.5.7','33.5.9','33.5.10','33.5.11',
 '33.5.12','33.5.12.1','33.5.12.1.1','33.5.13','33.5.14.1','33.5.14.2','33.5.14.3','33.5.14.4','33.5.15.1','33.5.15.2','33.5.15.3','33.5.15.4','33.5.15.5','33.5.15.6',
 '33.5.16.1','33.5.16.2','33.5.16.3','33.5.17.1','33.5.17.2','33.5.19.1','33.5.19.2','33.5.20.1','33.5.20.2','33.6.2','33.7.1'];
const ALINEAS={'33.3.1':'abcdefghi','33.3.3':'abcdefgh','33.3.4':'abcdefgh','33.3.5':'abc','33.3.6':'ab','33.7.1':'abcd'};
for(const m of r.MODULE_IDS)for(const o of r.objectivesOf(m)){
 assert.ok(o.refs?.length>=1,`${m}/${o.id}: referência`);
 for(const ref of o.refs){assert.ok(ref.norm&&ref.item,`${o.id}: norma e item`);assert.ok(r.KINDS[ref.kind],`${o.id}: origem válida`);
  if(ref.norm==='NR 33'){const n=ref.item.match(/^33(\.\d+)+/);assert.ok(n&&NR33.includes(n[0]),`${m}/${o.id}: item da NR 33 conferido (${ref.item})`);assert.equal(ref.kind,'vigente');
   for(const a of ref.item.matchAll(/\b([a-i])\)/g))assert.ok(ALINEAS[n[0]]?.includes(a[1]),`${m}/${o.id}: alínea existente (${ref.item})`);}
  if(/Anexo/.test(ref.norm))assert.match(ref.norm,/Anexo (I|II|III)$/,'Anexos I, II e III');
  if(/Quadro 1/.test(ref.item))assert.ok(ref.check,'Quadro de capacitação pede conferência');
  if(/Boa prática|Referência/.test(ref.norm))assert.equal(ref.kind,'pratica');}
 assert.ok(r.refSummary(o).every(x=>x.label&&x.status));
}
// Cada função cobre as suas atribuições (33.3.3, 33.3.4 e 33.3.5): todas as alíneas aparecem em alguma etapa.
const cited=(m,item)=>new Set(r.objectivesOf(m).flatMap(o=>o.refs).filter(x=>x.item.startsWith(item+' ')).flatMap(x=>[...x.item.matchAll(/\b([a-i])\)/g)].map(a=>a[1])));
if(has('supervisor'))assert.deepEqual([...cited('supervisor','33.3.3')].sort().join(''),'abcdefh','Supervisor: atribuições a) a f) e h)');
if(has('vigia'))assert.deepEqual([...cited('vigia','33.3.4')].sort().join(''),'abcdefgh','Vigia: todas as atribuições');
if(has('trabalhador'))assert.deepEqual([...cited('trabalhador','33.3.5')].sort().join(''),'abc','Trabalhador: todas as atribuições');

// 4. Capacitação (Anexo III, Quadro 1) coerente com os textos
assert.deepEqual(r.CAPACITACAO.supervisor,{inicial:40,periodica:8,meses:12});assert.deepEqual(r.CAPACITACAO.vigia,{inicial:16,periodica:8,meses:12});assert.deepEqual(r.CAPACITACAO.trabalhador,{inicial:16,periodica:8,meses:12});
for(const m of r.MODULE_IDS){const C=r.CAPACITACAO[m],M=r.MODULES[m],o=obj(m,'capacitacao');
 assert.equal(M.horas,C.inicial);assert.equal(M.periodica,C.periodica);
 assert.ok(correctOf(o).label.includes(`${C.inicial} horas`),`${m}: resposta cita ${C.inicial} horas`);assert.ok(correctOf(o).label.includes('8 horas')&&/12 meses/.test(correctOf(o).label+o.tip));
 assert.ok(o.refs.some(x=>x.item.includes(`${C.inicial} h inicial`)),`${m}: Quadro 1`);}

// 5. Fluxo completo com erros, em cada módulo
for(const m of r.MODULE_IDS){
 let s=r.initialState(m);
 for(const o of r.objectivesOf(m)){
  assert.equal(r.interact(s,o.id).step,s.step,'Decisão exige escolha');
  for(const c of o.choices.filter(c=>!c.correct)){const n=r.answer(s,c.id);assert.equal(n.step,s.step,'Erro não avança');assert.equal(n.errors,s.errors+1);assert.equal(n.feedback,c.feedback);s={...s,errors:n.errors};}
  const n=r.answer(s,correctOf(o).id);assert.equal(n.step,s.step+1);s=n;
 }
 assert.equal(s.finished,true,`${m}: termina`);assert.equal(s.errors,r.objectivesOf(m).length*2,`${m}: dois erros por decisão`);
 assert.equal(r.petOf(s),'encerrada',`${m}: PET encerrada no fim`);assert.equal(r.insideOf(s),0,`${m}: ninguém dentro no fim`);
}

// 6. Atmosfera: limites, leituras e coerência com os textos
assert.deepEqual(r.LIMITS,{o2min:19.5,o2max:23,lie:10,h2s:8,co:39});
const st=a=>r.atmosphereStatus(a);
assert.equal(st(null).ok,false);assert.equal(st(null).label,'Atmosfera não avaliada');
assert.ok(st({o2:20.9,lie:0,h2s:0,co:0}).ok);assert.ok(st({o2:19.5,lie:9,h2s:8,co:39}).ok,'Limites inclusive');
assert.ok(!st({o2:19.4,lie:0,h2s:0,co:0}).ok&&!st({o2:19.4,lie:0,h2s:0,co:0}).o2,'Deficiência de oxigênio');assert.ok(!st({o2:23.1,lie:0,h2s:0,co:0}).ok,'Enriquecimento de oxigênio');
assert.ok(!st({o2:20.9,lie:10,h2s:0,co:0}).ok,'Inflamáveis a 10% do LIE não são aceitáveis');assert.ok(!st({o2:20.9,lie:0,h2s:9,co:0}).ok);assert.ok(!st({o2:20.9,lie:0,h2s:0,co:40}).ok);
const num=v=>String(v).replace('.',',');
if(has('supervisor')){const m='supervisor';
 assert.equal(r.atmosphereOf(r.initialState(m)),null,'Sem leitura antes da avaliação');
 const a=r.atmosphereOf(at(m,'avaliacao'));assert.ok(!st(a).ok&&!st(a).o2&&!st(a).h2s);assert.ok(correctOf(obj(m,'avaliacao')).label.includes(num(a.o2)+'%')&&correctOf(obj(m,'avaliacao')).label.includes(a.h2s+' ppm'),'Leitura do painel igual à do texto');
 assert.ok(!st(r.atmosphereOf(at(m,'ventilar'))).ok,'Segue perigosa até ventilar');assert.ok(st(r.atmosphereOf(at(m,'reavaliar'))).ok);assert.ok(st(r.atmosphereOf(at(m,'pet'))).ok,'PET só com atmosfera aceitável');
 const al=r.atmosphereOf(at(m,'alarme'));assert.ok(!st(al).ok);assert.ok(obj(m,'alarme').description.includes(al.h2s+' ppm'));
 assert.ok(pos(m,'avaliacao')<pos(m,'ventilar')&&pos(m,'ventilar')<pos(m,'reavaliar')&&pos(m,'reavaliar')<pos(m,'pet')&&pos(m,'energias')<pos(m,'pet')&&pos(m,'emergencia')<pos(m,'pet')&&pos(m,'pet')<pos(m,'orientar'),'Ordem: bloqueio, avaliação, ventilação, resgate, PET, entrada');
 assert.equal(r.petOf(at(m,'pet')),'nao');assert.equal(r.petOf(after(m,'pet')),'emitida');assert.equal(r.insideOf(at(m,'orientar')),0,'Ninguém dentro antes de liberar');assert.equal(r.insideOf(after(m,'orientar')),0,'No alarme, todos já saíram');
 assert.equal(r.petOf(after(m,'alarme')),'emitida','Nova PET na etapa seguinte');assert.equal(r.petOf({...after(m,'alarme'),step:pos(m,'alarme')+1}),'emitida');
 assert.ok(/24 horas/.test(correctOf(obj(m,'prorrogar')).label)&&/5 anos/.test(correctOf(obj(m,'encerrar')).label));assert.ok(/oxigênio puro/.test(obj(m,'ventilar').tip));}
if(has('vigia')){const m='vigia';
 assert.equal(r.petOf(r.initialState(m)),'emitida','Vigia começa com a PET emitida');assert.ok(st(r.atmosphereOf(r.initialState(m))).ok);
 assert.equal(r.insideOf(at(m,'contagem')),0);assert.equal(r.insideOf(after(m,'contagem')),2);assert.equal(r.insideOf(after(m,'abandono')),1,'Um ficou para trás');assert.equal(r.insideOf(after(m,'resgate')),0);
 assert.ok(!st(r.atmosphereOf(at(m,'abandono'))).ok&&!st(r.atmosphereOf(at(m,'resgate'))).ok);assert.ok(obj(m,'abandono').description.includes(r.atmosphereOf(at(m,'abandono')).h2s+' ppm'));
 assert.equal(r.petOf(at(m,'comunicar')),'emitida');assert.equal(r.petOf(after(m,'comunicar')),'emitida','Nova PET na última etapa');assert.ok(/Não entrar/.test(correctOf(obj(m,'resgate')).label),'Vigia nunca entra');
 assert.ok(pos(m,'lista')<pos(m,'contagem')&&pos(m,'abandono')<pos(m,'resgate')&&pos(m,'resgate')<pos(m,'comunicar'));}
if(has('trabalhador')){const m='trabalhador';
 assert.equal(r.petOf(at(m,'sinalizacao')),'nao');assert.equal(r.petOf(at(m,'pet')),'emitida');assert.ok(st(r.atmosphereOf(at(m,'pet'))).ok);
 assert.equal(r.insideOf(at(m,'entrada')),0);assert.equal(r.insideOf(after(m,'entrada')),2);assert.equal(r.insideOf(after(m,'abandono')),1);assert.equal(r.insideOf(after(m,'colega')),0);
 assert.ok(st(r.atmosphereOf(at(m,'sintoma'))).ok,'Sintoma vem antes do alarme');assert.ok(!st(r.atmosphereOf(at(m,'abandono'))).ok);
 assert.ok(pos(m,'pet')<pos(m,'bloqueio')&&pos(m,'bloqueio')<pos(m,'entrada')&&pos(m,'equipamento')<pos(m,'entrada')&&pos(m,'sintoma')<pos(m,'abandono')&&pos(m,'abandono')<pos(m,'colega'));
 assert.ok(/Não voltar/.test(correctOf(obj(m,'colega')).label),'Não se entra para socorrer sem proteção');}

// 7. Objetos do cenário
const ITEMS=['tripe','contagem2','sinalProv','pet','fechado','alarme','gas','cadeados','meuCadeado','duto'];
for(const m of r.MODULE_IDS){
 for(const k of r.MODULES[m].on||[])assert.ok(ITEMS.includes(k),`${m}: objeto conhecido (${k})`);
 for(const o of r.objectivesOf(m)){for(const k of [...(o.fx?.show||[]),...(o.fx?.hide||[]),...(o.during||[])])assert.ok(ITEMS.includes(k),`${m}/${o.id}: objeto conhecido (${k})`);
  for(const k of o.fx?.show||[]){assert.ok(!r.visibleItems(at(m,o.id))[k],`${m}/${k}: oculto antes`);assert.ok(r.visibleItems(after(m,o.id))[k],`${m}/${k}: visível depois`);}
  for(const k of o.during||[])assert.ok(r.visibleItems(at(m,o.id))[k],`${m}/${k}: visível durante ${o.id}`);}
 const fim=r.visibleItems(after(m,IDS[m].at(-1)));assert.ok(fim.fechado&&!fim.pet&&!fim.alarme&&!fim.gas,`${m}: no fim, tanque fechado e sem alarme`);
 assert.ok(!r.visibleItems(r.initialState(m)).alarme&&!r.visibleItems(r.initialState(m)).gas);
 // Gás e alarme aparecem sempre que a atmosfera da etapa é perigosa, e só então.
 for(const o of r.objectivesOf(m)){const bad=r.atmosphereOf(at(m,o.id))&&!st(r.atmosphereOf(at(m,o.id))).ok;assert.equal(!!r.visibleItems(at(m,o.id)).gas,!!bad,`${m}/${o.id}: gás no tanque coerente com a leitura`);}
}

// 8. Planta e equipe: tudo livre e alcançável; o tanque só se acessa pela boca de visita
const grid=walkableGrid(staticObstacles,bounds),free=p=>r.canMove(p.x,p.z,staticObstacles,bounds);
const reach=(from,target,radius)=>{const route=findRoute(from,target,staticObstacles,grid);if(!route.length)return false;const end=route.at(-1);return Math.hypot(end.x-target.x,end.z-target.z)<=radius;};
assert.ok(free(start),'Início livre');for(const [k,p] of Object.entries(spots))assert.ok(free(p),`Ponto ${k} livre`);
const insideTank=p=>Math.abs(p.x-tank.x)<tank.w/2&&Math.abs(p.z-tank.z)<tank.d/2;
assert.ok(insideTank(spots.dentro)&&insideTank(spots.fundo)&&!insideTank(spots.entrada)&&!insideTank(spots.posto),'Pontos dentro e fora do tanque');
{const route=findRoute(start,spots.fundo,staticObstacles,grid);assert.ok(route.some(p=>Math.abs(p.x-tank.door.x)<tank.door.w/2&&Math.abs(p.z-tank.door.z)<.45),'Entrada só pela boca de visita');
 assert.equal(r.canMove(-2.6,-5,staticObstacles,bounds),false,'Parede do tanque bloqueia');assert.ok(r.canMove(0,-5,staticObstacles,bounds),'Boca de visita passável');assert.equal(r.canMove(0,-10,staticObstacles,bounds),false);}
for(const m of r.MODULE_IDS){const ids=IDS[m];
 for(const [n,p] of Object.entries(rosters[m])){assert.ok(people[n]&&p.role&&p.task&&p.look,`${m}/${n}: função, tarefa e aparência`);assert.ok(free(p),`${m}/${n}: posição livre`);assert.ok(!insideTank(p),`${m}/${n}: começa fora do tanque`);
  for(const s of p.states){for(const k of ['cur','after','before'])if(s[k])assert.ok(ids.includes(s[k]),`${m}/${n}: etapa conhecida (${s[k]})`);if(s.at){assert.ok(free(s.at),`${m}/${n}: destino livre (${s.label})`);assert.ok(reach(p,s.at,.5),`${m}/${n}: rota (${s.label})`);}}}
 for(const o of r.objectivesOf(m)){const a=o.who?rosters[m][o.who]:o;assert.ok(a&&a.x!==undefined,`${m}/${o.id}: âncora`);assert.ok(reach(start,a,o.r??2),`${m}/${o.id}: destino acessível`);
  if(o.who){const ph=phaseOf(m,o.who,at(m,o.id));assert.ok(reach(start,ph.at,2),`${m}/${o.id}: pessoa alcançável`);}}
 // Quem a contagem diz estar dentro está mesmo dentro do tanque (o jogador conta como um quando é o trabalhador).
 for(const id of ids){const s=after(m,id);if(s.finished)continue;const npc=Object.keys(rosters[m]).filter(n=>insideTank(phaseOf(m,n,s).at)).length;const me=m==='trabalhador'&&insideTank(r.currentTarget(s))?1:0;
  assert.ok(npc+me<=r.insideOf(s)+ (m==='trabalhador'?1:0)&&npc<=r.insideOf(s),`${m}/${id}: ninguém dentro além da contagem (${npc} de ${r.insideOf(s)})`);}
 // O vigia do módulo nunca entra no tanque.
 const vig=m==='vigia'?null:'Elaine';if(vig)for(const id of ids)assert.ok(!insideTank(phaseOf(m,vig,at(m,id)).at),`${m}: a vigia fica fora (${id})`);
 if(m==='vigia')for(const o of r.objectivesOf(m))assert.ok(!insideTank(o.who?rosters[m][o.who]:o),`vigia/${o.id}: destino do jogador fora do tanque`);
 if(m==='supervisor')for(const o of r.objectivesOf(m))assert.ok(!insideTank(o.who?rosters[m][o.who]:o),`supervisor/${o.id}: destino do jogador fora do tanque`);
}
if(has('trabalhador')){const m='trabalhador';for(const id of ['dentro','sintoma','abandono'])assert.ok(insideTank(obj(m,id)),`${id}: dentro do tanque`);for(const id of ['capacitacao','sinalizacao','pet','bloqueio','equipamento','colega','fim'])assert.ok(!insideTank(obj(m,id)),`${id}: fora do tanque`);
 assert.ok(pos(m,'entrada')<pos(m,'dentro'),'Só entra depois de combinar com a vigia');}
if(has('vigia')){assert.equal(phaseOf('vigia','Bento',at('vigia','resgate')).tone,'perigo');assert.ok(insideTank(phaseOf('vigia','Bento',at('vigia','resgate')).at));assert.ok(!insideTank(phaseOf('vigia','Bento',after('vigia','resgate')).at),'Bento resgatado fica fora');assert.ok(!insideTank(phaseOf('vigia','Sandra',after('vigia','resgate')).at));}
console.log(`PASS: ${r.MODULE_IDS.map(m=>r.MODULES[m].name+' ('+r.objectivesOf(m).length+' etapas)').join(', ')} — uma resposta certa por decisão, itens da NR 33 em vigor, atribuições de cada função, capacitação, atmosfera e PET, objetos do cenário, equipe e acessibilidade`);
