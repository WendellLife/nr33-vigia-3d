// Cenário estático da estação de tratamento, construído conforme layout.mjs: tanque T-02 em corte (espaço confinado),
// boca de visita com tripé, bloqueios, ventilação, mesa da PET, bancada e equipe de emergência.
// Devolve "items": objetos que o jogo liga e desliga conforme as etapas (sinalização, cadeados, duto, PET, alarme, gás…).
import * as T from './three.module.js';
import {structures as ST,spots as SP,tank,LOT} from './layout.mjs';
import {glowSprite} from './graphics.mjs';
export function buildScenery(scene,TX){
 const mats={};
 const mat=(c,metal=0,rough=.7)=>mats[c+'-'+metal+'-'+rough]??=new T.MeshStandardMaterial({color:c,metalness:metal,roughness:rough});
 const shadowed=(m,cast=true)=>{m.castShadow=cast;m.receiveShadow=true;return m;};
 const out={trees:[],groundMats:[],items:{},see:[]};
 function canvasPlane(w,h,draw,res=768){const cv=document.createElement('canvas');cv.width=res;cv.height=Math.max(8,Math.round(res*h/w));const g=cv.getContext('2d');draw(g,cv.width,cv.height);const tx=new T.CanvasTexture(cv);tx.colorSpace=T.SRGBColorSpace;tx.anisotropy=4;return new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:tx,roughness:.8}));}
 // Ferramentas de construção presas a um grupo (o lote), em coordenadas locais.
 function tools(P){
  const box=(w,h,d,c,x,y,z,parent=P,metal=0)=>{const m=shadowed(new T.Mesh(new T.BoxGeometry(w,h,d),typeof c==='object'?c:mat(c,metal)));m.position.set(x,y,z);parent.add(m);return m;};
  const cyl=(r,rb,h,c,x,y,z,parent=P,n=16)=>{const m=shadowed(new T.Mesh(new T.CylinderGeometry(r,rb,h,n),typeof c==='object'?c:mat(c,.2)));m.position.set(x,y,z);parent.add(m);return m;};
  const sphere=(r,c,x,y,z,parent=P)=>{const m=shadowed(new T.Mesh(new T.SphereGeometry(r,16,12),typeof c==='object'?c:mat(c)),true);m.position.set(x,y,z);parent.add(m);return m;};
  const rod=(a,b,r,c,parent=P)=>{const av=new T.Vector3(...a),bv=new T.Vector3(...b);const m=cyl(r,r,av.distanceTo(bv),c,0,0,0,parent,8);m.position.copy(av.clone().add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),bv.sub(av).normalize());return m;};
  const sign=(text,w,h,x,y,z,bg='#173e31',fg='#ffffff',parent=P,ry=0)=>{
   const m=canvasPlane(w,h,(g,W,H)=>{g.fillStyle=bg;g.fillRect(0,0,W,H);g.strokeStyle=fg;g.lineWidth=6;g.strokeRect(12,12,W-24,H-24);g.fillStyle=fg;g.textAlign='center';g.textBaseline='middle';const lines=text.split('\n');g.font=`bold ${Math.min(110,H/(lines.length+1))}px Arial`;lines.forEach((s,i)=>g.fillText(s,W/2,H*(i+1)/(lines.length+1),W-54));});
   m.position.set(x,y,z);m.rotation.y=ry;parent.add(m);return m;};
  const flat=(w,d,c,x,z,y=.012,parent=P,opacity=1)=>{const m=new T.Mesh(new T.PlaneGeometry(w,d),new T.MeshStandardMaterial({color:c,roughness:.9,transparent:opacity<1,opacity}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);m.receiveShadow=true;parent.add(m);return m;};
  const disc=(r,c,x,z,y=.014,parent=P,opacity=1)=>{const m=new T.Mesh(new T.CircleGeometry(r,28),new T.MeshStandardMaterial({color:c,roughness:.15,metalness:.2,transparent:opacity<1,opacity}));m.rotation.x=-Math.PI/2;m.position.set(x,y,z);parent.add(m);return m;};
  const cone=(x,z,parent=P)=>{const c=new T.Group();c.position.set(x,0,z);parent.add(c);cyl(.05,.2,.6,'#f07a28',0,.3,0,c);cyl(.11,.13,.08,'#f4f1e6',0,.38,0,c);box(.42,.04,.42,'#23282c',0,.02,0,c);return c;};
  // Fita de isolamento entre pontos, com cones nas pontas.
  const cordon=(pts,parent=P)=>{const g=new T.Group();parent.add(g);pts.forEach(([x,z])=>cone(x,z,g));for(let i=0;i<pts.length;i++){const a=pts[i],b=pts[(i+1)%pts.length];rod([a[0],.55,a[1]],[b[0],.55,b[1]],.014,'#f5c518',g);}return g;};
  const group=()=>{const g=new T.Group();P.add(g);return g;};
  const item=(name,obj,def=false)=>{out.items[name]={obj,def};obj.visible=def;return obj;};
  // Cartaz do mapa de riscos (círculos coloridos sobre a planta).
  const riskPoster=(title,w,h,x,y,z,parent=P)=>{const m=canvasPlane(w,h,(g,W,H)=>{g.fillStyle='#f6f6f2';g.fillRect(0,0,W,H);g.fillStyle='#173e31';g.fillRect(0,0,W,H*.16);g.fillStyle='#fff';g.font=`bold ${H*.09}px Arial`;g.textAlign='center';g.fillText(title,W/2,H*.115,W-30);
    g.strokeStyle='#9aa4a8';g.lineWidth=4;g.strokeRect(W*.08,H*.24,W*.84,H*.56);g.beginPath();g.moveTo(W*.45,H*.24);g.lineTo(W*.45,H*.8);g.moveTo(W*.45,H*.5);g.lineTo(W*.92,H*.5);g.stroke();
    [['#2e9e4f',.22,.4,.1],['#d6362b',.62,.36,.075],['#f2c21c',.3,.66,.06],['#2a6fd6',.72,.66,.1],['#8a5a2b',.56,.6,.035]].forEach(([c,cx,cy,r])=>{g.fillStyle=c;g.beginPath();g.arc(W*cx,H*cy,H*r,0,7);g.fill();});
    g.font=`${H*.05}px Arial`;g.fillStyle='#23282c';g.textAlign='left';['Físico','Químico','Biológico','Ergonômico','Acidente'].forEach((t,i)=>{g.fillStyle=['#2e9e4f','#d6362b','#8a5a2b','#f2c21c','#2a6fd6'][i];g.fillRect(W*(.06+i*.185),H*.87,H*.05,H*.05);g.fillStyle='#23282c';g.fillText(t,W*(.06+i*.185)+H*.065,H*.915,W*.13);});},640);
   m.position.set(x,y,z);parent.add(m);return m;};
  const easel=(x,z,parent=P)=>{rod([x-.5,0,z-.25],[x-.35,1.9,z-.02],.03,'#6b747a',parent);rod([x+.5,0,z-.25],[x+.35,1.9,z-.02],.03,'#6b747a',parent);};
  const table=(s,c='#d8cfb7',h=.78)=>{box(s.w,.06,s.d,c,s.x,h,s.z);for(const dx of [-s.w/2+.12,s.w/2-.12])box(.07,h,s.d-.2,'#5e666b',s.x+dx,h/2,s.z);};
  const board=(s,title,lines)=>{rod([s.x-1.1,0,s.z],[s.x-1.1,2.5,s.z],.05,'#6b747a');rod([s.x+1.1,0,s.z],[s.x+1.1,2.5,s.z],.05,'#6b747a');box(2.4,1.3,.08,'#3a4349',s.x,1.85,s.z+.08);
   const m=canvasPlane(2.3,1.2,(g,W,H)=>{g.fillStyle='#10303f';g.fillRect(0,0,W,H);g.fillStyle='#f5c948';g.fillRect(0,0,W,H*.2);g.fillStyle='#10303f';g.font=`bold ${H*.12}px Arial`;g.textAlign='left';g.fillText(title,W*.03,H*.145,W*.94);g.fillStyle='#e8f1f5';g.font=`${H*.095}px Arial`;lines.forEach((t,i)=>g.fillText(t,W*.03,H*(.34+i*.15),W*.94));},1024);
   m.material.emissive=new T.Color('#ffffff');m.material.emissiveMap=m.material.map;m.material.emissiveIntensity=.3;m.position.set(s.x,1.85,s.z+.14);P.add(m);};
  return {box,cyl,sphere,rod,sign,flat,disc,cone,cordon,group,item,riskPoster,easel,table,board};
 }
 // ---- Terreno comum: gramado, via ao norte e calçada ----
 const grassMat=new T.MeshStandardMaterial({map:TX.grass,roughness:1});
 const grass=new T.Mesh(new T.PlaneGeometry(320,240),grassMat);grass.rotation.x=-Math.PI/2;grass.position.y=-.32;grass.receiveShadow=true;scene.add(grass);
 const asphaltMat=new T.MeshStandardMaterial({map:TX.asphalt,normalMap:TX.asphaltN,normalScale:new T.Vector2(.6,.6),color:'#8d9498',roughness:.95});
 const road=new T.Mesh(new T.BoxGeometry(240,.3,6),asphaltMat);road.position.set(0,-.17,-16.4);road.receiveShadow=true;scene.add(road);
 {const S=tools(scene);for(let x=-110;x<112;x+=3)S.box(1.4,.02,.14,'#e9e2c8',x,-.015,-16.4);S.box(240,.12,2,'#b7b4aa',0,-.06,-12.6);}
 out.groundMats.push(grassMat,asphaltMat);
 function tree(x,z,s=1){const g=new T.Group();g.position.set(x,0,z);scene.add(g);const S=tools(g);S.cyl(.2*s,.28*s,3*s,'#5b4632',0,1.5*s,0,g,10);
  const foliage=new T.Group();foliage.position.y=3*s;g.add(foliage);for(const [dx,dy,dz,r,c] of [[0,.8,0,1.5,'#4f7a3f'],[.9,.1,.3,1.1,'#5a8845'],[-.9,.2,-.2,1.15,'#476f39'],[.1,1.6,.2,.95,'#5f9148']])S.sphere(r*s,c,dx*s,dy*s,dz*s,foliage);
  out.trees.push({g,foliage,seed:Math.random()*6});}

 const S=tools(scene);const R=k=>ST[k];
 const floor=new T.MeshStandardMaterial({map:TX.concrete,normalMap:TX.concreteN,normalScale:new T.Vector2(.5,.5),color:'#c8cac4',roughness:.88});
 const slab=new T.Mesh(new T.BoxGeometry(LOT.halfW*2+.6,.3,LOT.halfD*2+.6),floor);slab.position.set(0,-.15,0);slab.receiveShadow=true;scene.add(slab);out.groundMats.push(floor);
 for(const k of ['tree1','tree2'])tree(R(k).x,R(k).z,1.1);for(const [x,z] of [[-17,-6],[17,-4],[-17,6],[17,7]])tree(x,z,1.2);
 for(let x=-12;x<12.5;x+=1.2)S.flat(.6,.12,'#f2c230',x,2.2);
 S.sign('NR 33 • ESPAÇOS CONFINADOS\nESTAÇÃO DE TRATAMENTO',4.6,1,-10.4,.9,11.2,'#10303f','#f5c948');S.rod([-12.4,0,11.15],[-12.4,1.3,11.15],.05,'#6b747a');S.rod([-8.4,0,11.15],[-8.4,1.3,11.15],.05,'#6b747a');
 // ---- Tanque T-02, mostrado em corte: paredes de concreto, piso com lodo, agitador ----
 const conc=mat('#9ea39f',0,.95);
 for(const k of ['tBack','tL','tR']){const w=R(k);S.box(w.w,2.6,w.d,conc,w.x,1.3,w.z);}
 for(const k of ['tFrontL','tFrontR']){const w=R(k);S.box(w.w,1.5,w.d,conc,w.x,.75,w.z);S.box(w.w,.08,w.d+.1,'#7d827e',w.x,1.52,w.z);}
 S.flat(7.8,4.7,'#4d4a3c',tank.x,tank.z,.014);S.flat(7.6,1.7,'#3a3a2c',tank.x,-9,.018,undefined,.9);for(const [x,z,r] of [[-2.4,-8.9,.5],[.4,-9.2,.6],[1.9,-8.2,.4],[-.8,-8.4,.35]])S.disc(r,'#2c2e22',x,z,.022,undefined,.9);
 {const a=R('agitador');S.cyl(.12,.12,2.4,'#6b747a',a.x,1.2,a.z,undefined,10);for(const ry of [0,Math.PI/2]){const b=S.box(1.5,.08,.22,'#8e979c',a.x,.35,a.z,undefined,.5);b.rotation.y=ry;}S.box(.6,.5,.6,'#3a6f9f',a.x,2.6,a.z,undefined,.4);S.sign('AGITADOR',.8,.2,a.x,3.05,a.z+.31,'#23282c','#f5c948');}
 S.sign('TANQUE T-02 • VISTA EM CORTE',3.2,.34,0,2.85,-9.82,'#10303f','#f5c948');
 // Boca de visita: moldura, placa permanente do Anexo I e tripé com guincho.
 S.box(.14,1.5,.36,'#5e666b',-1,.75,-5);S.box(.14,1.5,.36,'#5e666b',1,.75,-5);
 {const p=canvasPlane(1.5,1.05,(g,W,H)=>{g.fillStyle='#f6f6f2';g.fillRect(0,0,W,H);g.fillStyle='#d62d20';g.fillRect(0,0,W,H*.26);g.fillStyle='#fff';g.font=`bold ${H*.17}px Arial`;g.textAlign='center';g.textBaseline='middle';g.fillText('PERIGO',W/2,H*.14);
   g.fillStyle='#111';g.font=`bold ${H*.115}px Arial`;g.fillText('ESPAÇO CONFINADO',W/2,H*.4,W*.92);g.font=`bold ${H*.1}px Arial`;g.fillText('PROIBIDA A ENTRADA',W/2,H*.57,W*.92);g.fillStyle='#d62d20';g.font=`bold ${H*.085}px Arial`;g.fillText('RISCO DE MORTE',W/2,H*.73,W*.92);g.fillStyle='#111';g.font=`${H*.07}px Arial`;g.fillText('Entrada só com PET e capacitação',W/2,H*.88,W*.92);});
  p.position.set(2.7,.82,-4.83);scene.add(p);}
 {const g=S.group();const [x,z]=[0,-4.55];for(const [dx,dz] of [[-1.25,.75],[1.25,.75],[0,-1.2]])S.rod([x+dx,0,z+dz],[x,3.1,z],.04,'#d9a116',g);S.box(.3,.2,.3,'#d9a116',x,3.1,z,g);S.cyl(.14,.14,.3,'#3a3f44',x+.5,1.5,z+.3,g).rotation.z=Math.PI/2;S.rod([x,3,z],[x,1.3,z+.1],.012,'#23282c',g);S.box(.1,.16,.06,'#c9d1d4',x,1.25,z+.1,g);S.item('tripe',g,true);}
 // Quadro de controle de entrada e saída.
 {const c=R('contagem');S.rod([c.x-.35,0,c.z],[c.x-.35,1.6,c.z],.03,'#6b747a');S.rod([c.x+.35,0,c.z],[c.x+.35,1.6,c.z],.03,'#6b747a');S.sign('CONTROLE DE ENTRADA\nDENTRO: 0',.95,.6,c.x,1.3,c.z+.06,'#f6f6f2','#23282c');S.item('contagem2',S.sign('CONTROLE DE ENTRADA\nRUI • BENTO  DENTRO: 2',.95,.6,c.x,1.3,c.z+.07,'#fff6c8','#23282c'));}
 // Sinalização provisória e isolamento da área de entrada.
 {const g=S.cordon([[-4.2,-1],[4.6,-1],[4.6,-4.7],[-4.2,-4.7]]);const s=S.sign('ÁREA ISOLADA\nENTRADA EM ESPAÇO CONFINADO',1.9,.6,-3.2,1.1,-.95,'#f5c518','#111',g);S.rod([-3.2,0,-1],[-3.2,.8,-1],.03,'#6b747a',g);S.item('sinalProv',g);}
 // PET afixada no posto do vigia.
 {const g=S.group();S.rod([1.75,0,-4.55],[1.75,1.5,-4.55],.03,'#6b747a',g);S.sign('PET Nº 0147\nT-02 • LIMPEZA',.6,.42,1.75,1.5,-4.5,'#f6f6f2','#23282c',g);S.item('pet',g);}
 {const g=S.group();S.box(2,1.4,.08,'#8e979c',0,.72,-4.82,g,.6);S.sign('PET ENCERRADA\nBOCA DE VISITA FECHADA',1.8,.6,0,.9,-4.76,'#2f8a57','#fff',g);S.item('fechado',g);}
 // Alarme do detector e gás no interior do tanque.
 {const g=S.group();const gl=glowSprite('#ff3b2a',1.6);gl.position.set(1.2,1.9,-4.9);g.add(gl);const l=new T.PointLight('#ff3b2a',5,9,1.6);l.position.set(1.2,1.9,-4.6);g.add(l);S.item('alarme',g);
  const h=S.group();const m=new T.Mesh(new T.BoxGeometry(7.6,.9,4.6),new T.MeshBasicMaterial({color:'#b7c23a',transparent:true,opacity:.28,depthWrite:false}));m.position.set(tank.x,.5,tank.z);h.add(m);S.item('gas',h);}
 // ---- Controle de energias: painel do agitador e válvula de entrada ----
 {const p=R('painel');S.box(p.w,1.7,p.d,'#c9ced1',p.x,.95,p.z,undefined,.3);S.box(.5,.5,.03,'#21272b',p.x-.3,1.3,p.z+.26);S.box(.1,.28,.08,'#d62d20',p.x+.3,1.25,p.z+.28);S.sign('CCM • AGITADOR T-02',1.3,.22,p.x,1.95,p.z+.26,'#1f2a30','#f5c948');
  const v=R('valvula');S.cyl(.2,.2,3.2,'#3a8fcf',v.x,.7,v.z,undefined,14).rotation.z=Math.PI/2;S.rod([v.x+1.5,.7,v.z],[-4.2,.7,-7.5],.2,'#3a8fcf');S.cyl(.32,.32,.1,'#d62d20',v.x,1.25,v.z,undefined,16);S.rod([v.x,.7,v.z],[v.x,1.25,v.z],.04,'#6b747a');S.sign('ENTRADA DE EFLUENTE',1.5,.22,v.x,1.75,v.z,'#1f5fa0');
  const g=S.group();const lock=(x,y,z,c)=>{S.box(.11,.09,.05,c,x,y,z,g);const sh=new T.Mesh(new T.TorusGeometry(.04,.012,6,12,Math.PI),mat('#c9d1d4',.8,.3));sh.position.set(x,y+.045,z);g.add(sh);};
  lock(p.x+.3,1.02,p.z+.31,'#1f5fa0');lock(v.x+.25,1.08,v.z+.36,'#1f5fa0');S.sign('BLOQUEADO\nNÃO OPERE',.5,.3,p.x+.75,1.25,p.z+.27,'#d62d20','#fff',g);S.sign('BLOQUEADO',.5,.18,v.x+.8,1.25,v.z+.34,'#d62d20','#fff',g);S.item('cadeados',g);
  const me=S.group();{const l2=(x,y,z)=>{S.box(.11,.09,.05,'#25ddff',x,y,z,me);const sh=new T.Mesh(new T.TorusGeometry(.04,.012,6,12,Math.PI),mat('#c9d1d4',.8,.3));sh.position.set(x,y+.045,z);me.add(sh);};l2(p.x+.45,1.02,p.z+.31);l2(v.x+.4,1.08,v.z+.36);S.sign('SEU CADEADO',.5,.16,p.x+.45,.82,p.z+.28,'#25ddff','#111',me);}S.item('meuCadeado',me);}
 // ---- Ventilação: insuflador e duto até o fundo do tanque ----
 {const f=R('insuflador');S.box(.8,.7,.8,'#f2c21c',f.x,.4,f.z,undefined,.3);S.cyl(.3,.3,.3,'#3a3f44',f.x,.45,f.z-.5,undefined,16).rotation.x=Math.PI/2;S.sign('INSUFLADOR',.8,.18,f.x,.95,f.z+.42,'#23282c','#f5c948');
  const g=S.group();const duct=mat('#f07a28',0,.8);S.rod([f.x,.45,f.z-.6],[-.55,.5,-4.6],.2,duct,g);S.rod([-.55,.5,-4.6],[-.6,.3,-6.2],.2,duct,g);S.rod([-.6,.3,-6.2],[-2.2,.25,-8.2],.2,duct,g);S.item('duto',g);}
 // ---- Mesa da PET, bancada de equipamentos e quadro de treinamento ----
 {const m=R('mesaPet');S.table(m,'#c9a16b');S.box(.3,.01,.42,'#f6f6f2',m.x-.4,.83,m.z);S.box(.3,.01,.42,'#fff6c8',m.x+.2,.83,m.z+.05);S.sign('PERMISSÃO DE ENTRADA E TRABALHO',1.9,.26,m.x,1.25,m.z-.46,'#173e31');
  const b=R('bancada');S.table(b,'#d8cfb7',.85);S.box(.16,.26,.1,'#f5c518',b.x-.9,1.02,b.z);S.box(.5,.12,.3,'#355e8a',b.x-.2,.94,b.z);S.sphere(.14,'#23282c',b.x+.5,1.02,b.z);S.cyl(.12,.12,.5,'#f5c518',b.x+1.05,1.13,b.z);S.sign('DETECTOR • CINTO • RESPIRADOR',2.4,.3,b.x,1.75,b.z-.3,'#8f5a10','#fff');S.rod([b.x-1.2,.8,b.z-.35],[b.x-1.2,1.9,b.z-.35],.03,'#7a858b');S.rod([b.x+1.2,.8,b.z-.35],[b.x+1.2,1.9,b.z-.35],.03,'#7a858b');}
 S.board(R('board'),'NR 33 • CAPACITAÇÃO',['Supervisor de entrada: 40 h','Vigia e trabalhador: 16 h','Periódica: 8 h a cada 12 meses','Sem capacitação, não entra (33.7.1)']);
 // ---- Equipe de emergência e salvamento ----
 {const v=R('viatura');S.box(v.w,1.6,v.d,'#c62b20',v.x,1.1,v.z,undefined,.2);S.box(v.w,.2,v.d,'#f2f2ec',v.x,1.1,v.z);S.box(.06,.6,v.d-.3,'#9fd0e6',v.x-v.w/2-.01,1.5,v.z,undefined,.6);for(const dx of [-1.1,1.1])for(const dz of [-.9,.9]){const w=S.cyl(.35,.35,.25,'#1d2427',v.x+dx,.35,v.z+dz);w.rotation.x=Math.PI/2;}S.sign('EMERGÊNCIA E SALVAMENTO',2.8,.36,v.x,1.55,v.z+.92,'#f2f2ec','#c62b20');
  S.cyl(.14,.14,.6,'#f5c518',SP.resgate.x+.9,.3,SP.resgate.z-.9);S.box(.5,.3,.3,'#355e8a',SP.resgate.x+1.4,.15,SP.resgate.z-.9);}
 // ---- Outros espaços confinados da estação: silo e poço de visita ----
 {const s=R('silo');S.cyl(1.1,1.1,4.2,'#b9c2c5',s.x,2.7,s.z,undefined,20);const c=new T.Mesh(new T.ConeGeometry(1.1,1,20),mat('#b9c2c5',.2));c.rotation.x=Math.PI;c.position.set(s.x,.5+.6,s.z);scene.add(c);for(const [dx,dz] of [[-.9,-.9],[.9,-.9],[-.9,.9],[.9,.9]])S.rod([s.x+dx,0,s.z+dz],[s.x+dx*.9,1.6,s.z+dz*.9],.05,'#6b747a');S.sign('SILO • ENGOLFAMENTO',1.9,.3,s.x,1.2,s.z+1.25,'#d62d20','#fff');
  S.disc(.55,'#3a3f44',10.4,-9.4,.02);S.cyl(.6,.6,.06,'#5e666b',10.4,.03,-9.4,undefined,20);S.sign('POÇO DE VISITA\nESPAÇO CONFINADO',1.3,.5,10.4,.9,-10.2,'#d62d20','#fff');S.rod([10.4,0,-10.25],[10.4,.65,-10.25],.03,'#6b747a');}
 out.mats=mats;
 return out;
}
