// Planta da estação de tratamento: tanque T-02 (espaço confinado, mostrado em corte), ponto de entrada com tripé,
// bloqueios de energia, ventilação, mesa da PET, bancada de equipamentos e posto da equipe de emergência.
// As mesmas pessoas aparecem nos outros jogos da NR 33 da série; neste, o jogador é: vigia.
// Usado pelo cenário 3D (scenery.mjs, game.mjs) e pelos testes, para garantir que todo destino é alcançável.
export const LOT = {halfW:13.4,halfD:11.4};
export const bounds = {minX:-LOT.halfW,maxX:LOT.halfW,minZ:-LOT.halfD,maxZ:LOT.halfD};
const wall = (x,z,w,d) => ({x,z,w,d});
// Tanque T-02: interior x de -3,9 a 3,9 e z de -9,85 a -5,15; boca de visita de 2 m na parede sul.
export const tank = {x:0,z:-7.5,w:8.4,d:5.3,door:{x:0,w:2,z:-5}};
export const structures = {
 tBack:wall(0,-10,8.4,.3),tL:wall(-4.05,-7.5,.3,5.3),tR:wall(4.05,-7.5,.3,5.3),tFrontL:wall(-2.6,-5,3.2,.3),tFrontR:wall(2.6,-5,3.2,.3),
 agitador:wall(2.7,-8.7,1,1),
 painel:wall(7,-6.7,1.4,.5),valvula:wall(-6.6,-7.5,1.8,.6),insuflador:wall(-2.7,-3.5,.9,.9),
 mesaPet:wall(5.2,-1.2,2,.9),bancada:wall(-6,-.8,2.8,.9),board:wall(-9.5,5.2,2.4,.3),
 viatura:wall(10,4.4,3.6,1.8),silo:wall(-10.6,-8.4,2.4,2.4),contagem:wall(2.9,-3.3,.9,.3),
 tree1:wall(-12.2,9.6,.9,.9),tree2:wall(12.2,9.8,.9,.9)
};
export const staticObstacles = Object.values(structures);
export const start = {x:0,z:8.6};
export const spots = {
 board:{x:-9.5,z:6.5},placa:{x:2.7,z:-4.1},entrada:{x:0,z:-3.7},posto:{x:1.4,z:-3.8},contagem:{x:2.9,z:-2.4},tripe:{x:-.9,z:-3.9},
 painel:{x:7,z:-5.7},valvula:{x:-6.6,z:-6.4},ventilador:{x:-2.7,z:-2.4},mesaPet:{x:5.2,z:0},bancada:{x:-6,z:.4},resgate:{x:7.4,z:4.4},
 dentro:{x:-1.4,z:-7.4},fundo:{x:-2.6,z:-8.8}
};
const U={pants:'#3b4a5a',shoes:'#2b2622',helmet:'#f2f2ec',vest:null,gloves:'#6b5a3e'};
// Aparência e função de cada pessoa. O jogador não aparece na equipe do módulo em que assume a função.
export const people = {
 Marcos:{role:'Supervisor de entrada',look:{body:'male',surface:'#2f6f8f',skin:'#e0ac69',beard:true,...U,helmet:'#2f7fb8',gloves:null,vest:'#ed8b32',backLabel:{text:'SUPERVISOR',bg:'#1f4e79'}}},
 Elaine:{role:'Vigia',look:{body:'female',surface:'#e9e4d6',skin:'#c68642',...U,helmet:'#e8aa21',gloves:null,vest:'#c8e02a',backLabel:{text:'VIGIA',bg:'#3a3f45'}}},
 Rui:{role:'Trabalhador autorizado',look:{body:'male',surface:'#c8772b',skin:'#8d5524',...U}},
 Bento:{role:'Trabalhador autorizado',look:{body:'male',surface:'#c8772b',skin:'#f1c27d',...U}},
 Sandra:{role:'Líder da equipe de emergência',look:{body:'female',surface:'#b0413e',skin:'#8d5524',...U,helmet:'#d6362b',vest:'#b0413e',stripes:'#f5c518',backLabel:{text:'RESGATE',bg:'#7a1f1a'}}},
 Nelson:{role:'Operador de processo',look:{body:'male',surface:'#4a7c59',skin:'#c68642',...U,gloves:null}},
 Gil:{role:'Mecânico • contratada',look:{body:'male',surface:'#6f6f8f',skin:'#e0ac69',...U,helmet:'#9aa4a8'}}
};
const P=(name,x,z,angle,pose,task,states=[])=>[name,{...people[name],x,z,angle,pose,task,states:states.map(s=>s.at?{...s,at:{x:s.at[0],z:s.at[1]}}:s)}];
export const rosters = {
 vigia:Object.fromEntries([
  P('Marcos',6.6,0,-Math.PI/2,'inspect','Supervisor • PET emitida',[{cur:'substituicao',label:'“Precisa sair do posto?”',tone:'info',pose:'none',at:[3,-1.4],angle:Math.PI},{cur:'comunicar',label:'Aguardando o seu relato',tone:'alerta',pose:'none',at:[3,-1.4],angle:Math.PI}]),
  P('Rui',-1.4,-2.2,Math.PI,'none','Pronto para entrar',[{after:'contagem',label:'Dentro • limpeza do tanque',tone:'info',pose:'repair',at:[-1.4,-8.2],angle:Math.PI},{after:'abandono',label:'Fora • saiu no abandono',tone:'ok',pose:'none',at:[-2,-1.6],angle:0}]),
  P('Bento',-.2,-1.8,Math.PI,'none','Pronto para entrar',[{after:'contagem',label:'Dentro • limpeza do tanque',tone:'info',pose:'repair',at:[.8,-8.4],angle:Math.PI},{cur:'resgate',label:'Caído dentro do tanque!',tone:'perigo',pose:'victim',at:[.8,-7.2],angle:0},{after:'resgate',label:'Resgatado pelo guincho • consciente',tone:'ok',pose:'seated',at:[3.6,-.6],angle:Math.PI}]),
  P('Sandra',7.6,5.2,-Math.PI/2,'inspect','Equipe de emergência a postos',[{after:'resgate',label:'Resgate concluído sem entrada',tone:'ok',pose:'inspect',at:[-1,-2.8],angle:Math.PI}]),
  P('Gil',9.2,-2,-Math.PI/2,'none','Manutenção da bomba ao lado',[{cur:'lista',label:'“Só vou pegar a bomba lá dentro”',tone:'alerta',pose:'point',at:[3.4,-1.8],angle:Math.PI},{after:'lista',label:'Fora da área isolada',tone:'ok',pose:'phone'}]),
  P('Nelson',-9.2,1.6,Math.PI/2,'phone','Operando a planta',[{cur:'posto',label:'“Vigia, busca a mangueira para mim?”',tone:'alerta',pose:'point',at:[-3.6,-1.6],angle:Math.PI/2}])
 ]),
};
// Função que o jogador assume em cada módulo (define a roupa).
export const playerLook = {vigia:people.Elaine.look};
export const W = bounds;
