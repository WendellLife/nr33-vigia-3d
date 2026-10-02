// Regras do jogo NR 33 • Vigia (espaços confinados), no mesmo padrão dos demais jogos da série.
// A operação é a limpeza interna do tanque T-02 de uma estação de tratamento.
// Cada etapa traz as referências normativas em "refs". O campo "kind" diz de onde vem o conteúdo:
//  vigente → NR 33 em vigor (Portaria SEPRT 1.690/2022, vigente desde 03/10/2022) e outras NR citadas.
//  pratica → boa prática técnica, que não é item de NR.
// "check:true" marca item ou anexo que deve ser conferido no texto consolidado antes de usar em treinamento.
// "atm" é a leitura do detector a partir da etapa; "inside" é quantas pessoas estão dentro e "pet" é a situação da permissão,
// ambos depois de concluída a etapa ("insideNow" e "petNow" valem durante a etapa).
// "fx" liga e desliga objetos do cenário quando a etapa é concluída; "during" mostra objetos só durante a etapa.
import {spots} from './layout.mjs';
export const KINDS = {
 vigente:'Em vigor',
 pratica:'Boa prática — não é item de NR'
};
const nr33=item=>({norm:'NR 33',item,kind:'vigente'});
const anexo=(n,item,check=false)=>({norm:`NR 33 • Anexo ${n}`,item,kind:'vigente',...(check?{check:true}:{})});
const nr=(norm,item,check=false)=>({norm,item,kind:'vigente',...(check?{check:true}:{})});
const pratica=(norm,item)=>({norm,item,kind:'pratica'});
const at=(p,r)=>({x:p.x,z:p.z,r});
// Parâmetros de atmosfera aceitável usados no painel do jogo.
export const LIMITS = {o2min:19.5,o2max:23,lie:10,h2s:8,co:39};
const RUIM={o2:17.8,lie:4,h2s:22,co:6},BOA={o2:20.8,lie:0,h2s:1,co:2},ALARME={o2:20.1,lie:2,h2s:14,co:4},IPVS={o2:18.9,lie:3,h2s:60,co:5};
// ---------------- Vigia (16 h) ----------------
const vigia = [
 {id:'capacitacao',refs:[nr33('33.6.2'),anexo('III','Quadro 1: vigia, 16 h inicial e 8 h a cada 12 meses',true),nr33('33.7.1 c) e d)')],...at(spots.board,2),
  title:'Confira a sua capacitação',description:'Você é a vigia da limpeza do tanque T-02. No quadro de treinamento, confira o que a função exige.',
  tip:'O vigia faz capacitação inicial de 16 horas e periódica de 8 horas a cada 12 meses. É proibido entrar e trabalhar em espaço confinado sem vigia e sem a capacitação de cada função (33.7.1 c e d).',
  choices:[
   {id:'dezesseis',correct:true,label:'Capacitação inicial de 16 horas como vigia e a periódica de 8 horas feita há menos de 12 meses.',feedback:'Certo: 16 horas iniciais e 8 horas a cada 12 meses.'},
   {id:'olhar',label:'Vigia só fica olhando: não precisa de curso.',feedback:'O vigia controla a entrada, a contagem, a comunicação e ordena o abandono. A capacitação é obrigatória.'},
   {id:'quarenta',label:'Só quem fez o curso de 40 horas pode ser vigia.',feedback:'40 horas é a carga do supervisor de entrada. Para o vigia são 16 horas.'}
  ]},
 {id:'posto',who:'Nelson',refs:[nr33('33.3.4 c)'),nr33('33.3.4 g)')],
  title:'Não saia do posto',description:'Nelson, da operação, pede que você vá ao almoxarifado buscar uma mangueira. “É rapidinho, eles ainda nem entraram.”',
  tip:'O vigia permanece fora do espaço confinado, junto à entrada, em contato ou comunicação permanente com os trabalhadores (33.3.4 c), e não realiza outras tarefas durante a operação (33.3.4 g).',
  choices:[
   {id:'ficar',correct:true,label:'Recusar: o vigia não sai de junto da entrada nem faz outra tarefa durante a operação. Outra pessoa busca a mangueira.',feedback:'Posto mantido: junto à entrada e sem outras tarefas.'},
   {id:'ir',label:'Ir correndo e voltar antes de alguém entrar.',feedback:'Sem vigia, ninguém controla quem entra. O posto não fica vazio.'},
   {id:'radio',label:'Ir, mas levar o rádio para ouvir se chamarem.',feedback:'Comunicação não substitui a presença junto à entrada. E buscar mangueira é outra tarefa.'}
  ]},
 {id:'lista',who:'Gil',refs:[nr33('33.3.4 a)'),nr33('33.5.6'),nr33('33.7.1 a)')],
  title:'Só entra quem está na PET',description:'Gil, mecânico de uma contratada, aparece na entrada: “Só vou pegar a bomba lá dentro, dois minutos”. O nome dele não está na PET.',
  tip:'O vigia permite somente a entrada dos trabalhadores autorizados relacionados na PET (33.3.4 a). Entrar sem autorização prévia é proibido (33.7.1 a).',
  choices:[
   {id:'barrar',correct:true,label:'Barrar: o nome dele não está na PET. Se o serviço dele for necessário, o supervisor avalia e emite a permissão correta.',feedback:'Entrada controlada pela relação da PET.'},
   {id:'dois',label:'Deixar entrar, porque são só dois minutos.',feedback:'Gás não espera dois minutos, e ninguém saberia que ele está lá dentro.'},
   {id:'acompanhado',label:'Deixar entrar junto com o Rui, que está autorizado.',feedback:'Estar acompanhado não coloca ninguém na PET. Só entra quem está relacionado.'}
  ]},
 {id:'contagem',inside:2,fx:{show:['contagem2']},refs:[nr33('33.3.4 b)'),pratica('Boa prática','quadro de entrada e saída com nome e horário')],...at(spots.contagem,1.6),
  title:'Controle quem está dentro',description:'Rui e Bento vão entrar. No quadro de controle, registre a entrada.',
  tip:'O vigia mantém continuamente o controle do número de trabalhadores autorizados dentro do espaço e assegura que todos saiam ao término (33.3.4 b).',
  choices:[
   {id:'registrar',correct:true,label:'Anotar nome e horário de cada entrada e de cada saída e manter o número de pessoas dentro sempre atualizado.',feedback:'Contagem viva: a qualquer momento você sabe quem está dentro.'},
   {id:'memoria',label:'Guardar de cabeça: são só dois.',feedback:'Numa emergência, memória falha. O registro é o que diz ao resgate quantos procurar.'},
   {id:'fim',label:'Conferir só no fim do dia, pela folha de ponto.',feedback:'O controle é contínuo (33.3.4 b), não ao fim do dia.'}
  ]},
 {id:'comunicacao',refs:[nr33('33.3.4 c)'),pratica('Boa prática','chamadas em intervalos fixos e sinal combinado de abandono')],...at(spots.entrada,1.8),
  title:'Mantenha a comunicação',description:'Os dois estão dentro, fora da sua vista, atrás do agitador. Decida como manter contato.',
  tip:'O vigia fica em contato ou comunicação permanente com os trabalhadores (33.3.4 c). Combine antes o meio (voz, rádio adequado à área, sinais na corda) e o sinal de abandono. Silêncio é sinal de problema.',
  choices:[
   {id:'intervalo',correct:true,label:'Rádio testado e chamadas em intervalos curtos, com resposta obrigatória e um sinal combinado de abandono. Sem resposta, tratar como emergência.',feedback:'Contato permanente, com resposta exigida e sinal de abandono combinado.'},
   {id:'gritar',label:'Eles gritam se precisarem de alguma coisa.',feedback:'Quem desmaia não grita. O vigia é quem chama e exige resposta.'},
   {id:'celular',label:'Trocar mensagens pelo celular de vez em quando.',feedback:'Celular comum pode não ser permitido na área e distrai. A comunicação é permanente, não de vez em quando.'}
  ]},
 {id:'movimentador',refs:[nr33('33.3.4 e)'),nr33('33.5.2'),pratica('Boa prática','inspeção do tripé, do guincho e do cabo antes do uso')],...at(spots.tripe,1.6),
  title:'Opere o movimentador de pessoas',description:'O tripé com guincho está montado sobre a boca de visita, ligado ao cinto de cada trabalhador.',
  tip:'O vigia opera os movimentadores de pessoas (33.3.4 e), segundo os critérios do procedimento (33.5.2). O guincho permite retirar a vítima sem que ninguém entre.',
  choices:[
   {id:'inspecionar',correct:true,label:'Inspecionar tripé, guincho, cabo e conexões, manter o cabo ligado ao cinto de quem está dentro e ficar pronta para içar de fora.',feedback:'Movimentador inspecionado e pronto para resgate sem entrada.'},
   {id:'soltar',label:'Soltar os cabos para eles trabalharem mais à vontade.',feedback:'Sem o cabo, o resgate de fora deixa de existir.'},
   {id:'outro',label:'Deixar o guincho com quem passar, se for preciso.',feedback:'Operar o movimentador é atribuição do vigia capacitado (33.3.4 e).'}
  ]},
 {id:'substituicao',who:'Marcos',refs:[nr33('33.3.4 f)'),nr33('33.3.3 g)'),nr33('33.5.11')],
  title:'Você precisa sair do posto',description:'Você precisa ir ao banheiro. Marcos, o supervisor, está por perto. Há um ajudante sem curso oferecendo-se para “ficar olhando”.',
  tip:'Quando o vigia não puder desempenhar suas tarefas nem ser substituído por outro vigia, ordena o abandono (33.3.4 f). O supervisor pode fazer a função de vigia quando isso está previsto na PET (33.3.3 g). Substituição por vigia não relacionado encerra a PET (33.5.11).',
  choices:[
   {id:'substituto',correct:true,label:'Pedir ao Marcos que assuma o posto, o que está previsto na PET, passar a contagem e a situação e só então sair. Sem substituto capacitado, ordenar o abandono.',feedback:'Posto passado a quem está capacitado e previsto na PET.'},
   {id:'ajudante',label:'Deixar o ajudante olhando por cinco minutos.',feedback:'Quem não é vigia capacitado e relacionado na PET não assume o posto.'},
   {id:'sair',label:'Sair sem avisar: são só cinco minutos.',feedback:'Cinco minutos sem vigia são cinco minutos de entrada proibida (33.7.1 c).'}
  ]},
 {id:'monitor',atm:BOA,refs:[nr33('33.5.15.3'),nr33('33.5.15.4'),nr33('33.5.16.2')],...at(spots.entrada,1.8),
  title:'Acompanhe o monitoramento',description:'De volta ao posto, você acompanha a leitura contínua do detector e o insuflador. Veja o painel.',
  tip:'A atmosfera é monitorada de forma contínua durante a permanência (33.5.15.3), com alarmes sonoro, visual e vibratório (33.5.15.4). A ventilação fica ligada durante o trabalho (33.5.16.2).',
  choices:[
   {id:'acompanhar',correct:true,label:'Acompanhar a leitura e a ventilação o tempo todo, conhecer os valores de alarme e avisar o supervisor de qualquer tendência de piora.',feedback:'Monitoramento contínuo acompanhado de perto.'},
   {id:'desligar',label:'Desligar o insuflador, porque o barulho atrapalha o rádio.',feedback:'A ventilação mantém a atmosfera segura. Não se desliga com gente dentro.'},
   {id:'bom',label:'A leitura inicial foi boa: não precisa olhar mais.',feedback:'A atmosfera muda quando o lodo é remexido. Por isso o monitoramento é contínuo.'}
  ]},
 {id:'abandono',atm:ALARME,inside:1,during:['alarme','gas'],refs:[nr33('33.3.4 f)')],...at(spots.entrada,1.8),
  title:'Ordene o abandono',description:'O alarme do detector dispara: gás sulfídrico em 14 ppm e subindo. Rui e Bento dizem pelo rádio que “falta pouco”.',
  tip:'O vigia ordena o abandono do espaço sempre que reconhecer sinal de alarme, perigo, sintoma, queixa, condição proibida, acidente ou situação não prevista (33.3.4 f). Não se negocia a ordem.',
  choices:[
   {id:'ordenar',correct:true,label:'Ordenar o abandono imediato, pelo sinal combinado, e contar quem sai.',feedback:'Abandono ordenado no primeiro sinal de alarme. Rui saiu; falta o Bento.'},
   {id:'esperar',label:'Dar mais cinco minutos para terminarem.',feedback:'Alarme é abandono. Em cinco minutos a concentração pode multiplicar.'},
   {id:'perguntar',label:'Perguntar se eles estão se sentindo bem antes de decidir.',feedback:'Os sintomas chegam tarde, e o gás atrapalha o julgamento de quem está dentro. A decisão é do vigia.'}
  ]},
 {id:'resgate',atm:IPVS,inside:0,during:['alarme','gas'],refs:[nr33('33.3.4 d)'),nr33('33.3.4 c)'),nr33('33.5.17.2'),nr33('33.3.6 a)')],...at(spots.tripe,1.6),
  title:'Não entre: acione o resgate',description:'Bento não responde ao rádio. Pela boca de visita, você o vê caído perto da saída, com o cabo do guincho ainda preso ao cinto.',
  tip:'O vigia permanece fora do espaço (33.3.4 c) e aciona a equipe de emergência e salvamento (33.3.4 d). Em atmosfera IPVS só se entra com máscara autônoma ou respirador de linha de ar com cilindro auxiliar (33.5.17.2). Muitos dos mortos em espaço confinado são pessoas que entraram para socorrer.',
  choices:[
   {id:'acionar',correct:true,label:'Não entrar: acionar a equipe de emergência pelo rádio, içar o Bento com o guincho, de fora, e manter a ventilação ligada.',feedback:'Resgate acionado e retirada sem entrada. Bento saiu pelo guincho.'},
   {id:'entrar',label:'Entrar correndo para puxar o Bento: ele está a dois passos da saída.',feedback:'A mesma atmosfera que derrubou o Bento derruba você. O vigia nunca entra.'},
   {id:'pano',label:'Entrar com um pano molhado no rosto.',feedback:'Pano não filtra gás nem fornece oxigênio. Em atmosfera IPVS, só equipamento com ar próprio.'}
  ]},
 {id:'comunicar',who:'Marcos',atm:ALARME,pet:'cancelada',during:['gas'],refs:[nr33('33.3.4 h)'),nr33('33.3.3 e)'),nr33('33.5.11')],
  title:'Comunique ao supervisor',description:'Bento está fora, consciente, com a equipe de emergência. Marcos chega ao posto.',
  tip:'O vigia comunica ao supervisor de entrada qualquer evento não previsto ou estranho à operação, inclusive a ordem de abandono (33.3.4 h). O supervisor cancela a entrada (33.3.3 e), e a PET é encerrada por condição não prevista (33.5.11).',
  choices:[
   {id:'relatar',correct:true,label:'Relatar os fatos na ordem: horário do alarme, leituras, ordem de abandono, quem saiu, a queda do Bento, o resgate pelo guincho e a contagem em zero.',feedback:'Relato completo, com horários, leituras e contagem.'},
   {id:'omitir',label:'Dizer só que “deu tudo certo”, para não complicar o Bento.',feedback:'Sem os fatos, a causa não é corrigida e a próxima entrada repete o risco.'},
   {id:'depois',label:'Deixar para contar na reunião da semana.',feedback:'A comunicação ao supervisor é imediata: é ele quem cancela a entrada e encerra a PET.'}
  ]},
 {id:'fim',atm:BOA,petNow:'emitida',pet:'encerrada',fx:{show:['fechado'],hide:['pet','duto','contagem2','cadeados','sinalProv']},refs:[nr33('33.3.4 b)'),nr33('33.5.11')],...at(spots.contagem,1.6),
  title:'Feche a contagem',description:'Dias depois, com nova PET, a limpeza foi concluída sem ocorrências. No quadro de controle, feche a operação.',
  tip:'O vigia assegura que todos saiam ao término da atividade (33.3.4 b). A PET é encerrada com a saída de todos (33.5.11).',
  choices:[
   {id:'zero',correct:true,label:'Conferir nome por nome que todos saíram, com a contagem em zero, avisar o supervisor para encerrar a PET e só então deixar o posto.',feedback:'Contagem em zero conferida e posto encerrado com a PET.'},
   {id:'barulho',label:'Como não se ouve mais ninguém lá dentro, encerrar.',feedback:'Silêncio não é contagem. Confere-se pelo registro, nome por nome.'},
   {id:'embora',label:'Sair no fim do expediente e deixar a conferência com o próximo turno.',feedback:'O vigia só deixa o posto com todos fora ou depois de substituído por outro vigia.'}
  ]}
];
export const MODULES = {
 vigia:{id:'vigia',name:'Vigia',short:'VIGIA',course:'Capacitação de 16 h',horas:16,periodica:8,role:'Vigia',place:'TANQUE T-02 • POSTO DO VIGIA',on:['sinalProv','cadeados','duto','pet'],pet0:'emitida',atm0:BOA,
  intro:'Você é a vigia da limpeza do tanque T-02. Fique no posto, controle quem entra, mantenha a contagem e a comunicação, ordene o abandono e nunca entre.',
  summary:'Você manteve o posto, barrou quem não estava na PET, controlou a contagem e a comunicação, ordenou o abandono, acionou o resgate sem entrar e fechou a contagem em zero.',objectives:vigia},
};
export const MODULE_IDS = Object.keys(MODULES);
export const objectivesOf = m => MODULES[m].objectives;
export const indexOf = (m,id) => objectivesOf(m).findIndex(o => o.id === id);
export const refLabel = r => `${r.norm} • ${/^\d/.test(r.item)?'item ':''}${r.item}`;
// Linha de referência mostrada no painel. A origem (em vigor ou boa prática) sempre aparece.
export const refSummary = o => o.refs.map(r => ({label:refLabel(r),kind:r.kind,status:KINDS[r.kind],check:!!r.check}));

// ---------------- Capacitação (Anexo III, Quadro 1) ----------------
export const CAPACITACAO = {supervisor:{inicial:40,periodica:8,meses:12},vigia:{inicial:16,periodica:8,meses:12},trabalhador:{inicial:16,periodica:8,meses:12}};

// ---------------- Estado do jogo ----------------
export const initialState = (module=MODULE_IDS[0]) => ({module,step:0,feedback:'',errors:0,completed:[],finished:false});
export const done = (s,id) => s.completed.includes(id);
export const currentTarget = s => objectivesOf(s.module)[s.step];
function advance(s,next,id){
 const list=objectivesOf(s.module);next.completed=[...s.completed,id];next.step=s.step+1;next.finished=next.step===list.length;
 return next;
}
export function answer(s,choiceId){
 const o=currentTarget(s);const c=o?.choices?.find(x=>x.id===choiceId);if(!c)return s;
 if(!c.correct)return {...s,errors:s.errors+1,feedback:c.feedback};
 return advance(s,{...s,feedback:c.feedback},o.id);
}
export function interact(s,id){
 const o=currentTarget(s);if(!o||o.id!==id)return s;
 if(o.choices)return {...s,feedback:'Escolha uma das opções.'};
 return advance(s,{...s,feedback:''},id);
}
// Valor de um campo que acompanha o andamento: "inside" e "pet" valem depois que a etapa é concluída;
// "insideNow", "petNow" e "atm" valem enquanto a etapa é a atual (e "atm" segue valendo depois).
function carried(s,key,initial){
 const list=objectivesOf(s.module);let v=initial;
 for(let i=0;i<Math.min(s.step,list.length);i++)if(list[i][key]!==undefined)v=list[i][key];
 const cur=list[s.step];if(cur&&cur[key+'Now']!==undefined)v=cur[key+'Now'];
 return v;
}
// Leitura do detector (null = ainda não avaliada), pessoas dentro do espaço e situação da PET.
export function atmosphereOf(s){const list=objectivesOf(s.module),last=Math.min(s.step,list.length-1);let v=MODULES[s.module].atm0??null;for(let i=0;i<=last;i++)if(list[i].atm!==undefined)v=list[i].atm;return v;}
export const insideOf = s => carried(s,'inside',0);
export const petOf = s => carried(s,'pet',MODULES[s.module].pet0??'nao');
export const PET_LABEL = {nao:'PET não emitida',emitida:'PET emitida',cancelada:'PET cancelada',encerrada:'PET encerrada'};
export function atmosphereStatus(a){
 if(!a)return {ok:false,o2:null,lie:null,h2s:null,co:null,label:'Atmosfera não avaliada'};
 const st={o2:a.o2>=LIMITS.o2min&&a.o2<=LIMITS.o2max,lie:a.lie<LIMITS.lie,h2s:a.h2s<=LIMITS.h2s,co:a.co<=LIMITS.co};
 const ok=st.o2&&st.lie&&st.h2s&&st.co;return {ok,...st,label:ok?'Atmosfera aceitável':'Atmosfera perigosa • não entrar'};
}
// Objetos do cenário visíveis: começa pelos do módulo ("on"), aplica o "fx" das etapas concluídas e o "during" da etapa atual.
export function visibleItems(s,defaults={}){
 const v={...defaults};for(const k of MODULES[s.module].on||[])v[k]=true;
 for(const o of objectivesOf(s.module)){if(!done(s,o.id)||!o.fx)continue;for(const k of o.fx.show||[])v[k]=true;for(const k of o.fx.hide||[])v[k]=false;}
 const cur=currentTarget(s);
 for(const o of objectivesOf(s.module))for(const k of o.during||[])v[k]=false;
 for(const k of cur?.during||[])v[k]=true;
 return v;
}
// Áreas caminháveis: o pátio da estação; estruturas entram como obstáculos {x,z,w,d}.
export function canMove(x,z,obstacles,bounds){
 if(bounds&&!(x>bounds.minX&&x<bounds.maxX&&z>bounds.minZ&&z<bounds.maxZ))return false;
 return !obstacles.some(o=>Math.abs(x-o.x)<o.w/2+.32&&Math.abs(z-o.z)<o.d/2+.32);
}
