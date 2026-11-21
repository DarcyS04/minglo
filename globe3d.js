import * as T from './assets/three.module.js';
// Simplified coastlines drawn for the toy globe, with smaller islands kept separate.
const lands=[
 [[-168,68],[-153,72],[-133,69],[-120,73],[-102,72],[-91,68],[-83,65],[-80,58],[-72,62],[-59,56],[-53,50],[-66,45],[-74,41],[-80,33],[-81,25],[-88,30],[-96,26],[-93,18],[-86,21],[-84,16],[-78,9],[-84,9],[-94,16],[-105,22],[-114,30],[-118,34],[-125,48],[-134,56],[-145,60],[-158,56],[-168,60]],
 [[-80,9],[-71,12],[-62,10],[-54,5],[-49,0],[-36,-7],[-39,-16],[-48,-26],[-53,-34],[-63,-42],[-66,-55],[-74,-49],[-73,-36],[-70,-24],[-77,-12],[-82,-5]],
 [[-73,60],[-49,59],[-40,65],[-20,71],[-19,78],[-38,84],[-61,81],[-71,75]],
 [[-17,33],[-8,36],[4,37],[11,33],[20,33],[25,31],[32,31],[35,24],[38,16],[43,12],[52,11],[48,4],[43,-5],[41,-15],[35,-22],[32,-30],[25,-35],[18,-35],[12,-26],[12,-17],[9,-7],[3,4],[-5,5],[-13,8],[-17,15],[-17,23]],
 [[-10,36],[-9,43],[-3,44],[-5,48],[1,50],[6,54],[9,57],[13,55],[11,59],[5,61],[10,66],[20,71],[28,70],[32,65],[27,60],[24,59],[28,55],[35,58],[42,62],[49,68],[60,70],[70,73],[88,74],[101,78],[116,72],[133,72],[152,69],[174,67],[179,61],[164,58],[163,54],[156,50],[151,51],[145,46],[140,49],[132,44],[129,41],[125,35],[123,39],[119,38],[122,31],[120,25],[113,22],[109,21],[108,15],[105,10],[103,4],[100,8],[96,17],[91,22],[87,20],[81,9],[77,8],[73,18],[69,23],[63,25],[59,23],[56,17],[48,13],[44,15],[42,23],[36,28],[35,33],[31,35],[28,41],[32,43],[39,44],[38,47],[30,46],[28,41],[24,39],[23,35],[19,41],[15,44],[13,45],[14,42],[18,38],[16,37],[13,40],[10,44],[6,43],[3,43],[0,39],[-5,36]],
 [[112,-12],[123,-14],[132,-11],[137,-18],[142,-11],[149,-20],[153,-28],[148,-39],[137,-36],[131,-31],[120,-34],[114,-34],[112,-26]],
 [[-8,50],[-6,56],[-4,59],[-1,57],[1,52],[-3,50]], [[-11,51],[-10,55],[-6,55],[-6,52]],
 [[-25,64],[-18,67],[-13,65],[-17,63]], [[47,-13],[51,-15],[49,-23],[44,-26],[43,-21]],
 [[130,32],[137,36],[141,43],[145,44],[144,39],[140,34],[135,33]],
 [[96,5],[105,-2],[106,-6],[100,-3]],[[109,6],[118,7],[119,0],[114,-4],[109,-2]],
 [[106,-6],[115,-7],[115,-9],[108,-8]],[[129,-2],[140,-2],[151,-7],[147,-10],[132,-6]],
 [[120,18],[123,17],[126,9],[123,6],[120,12]],[[166,-46],[172,-40],[175,-37],[177,-40],[172,-45]],
 [[-85,22],[-80,24],[-74,21],[-78,20]], [[79,9],[82,8],[81,5],[79,6]],
 [[-142,-73],[-110,-70],[-81,-73],[-53,-66],[-61,-79],[-110,-86],[-142,-84]],
 [[-50,-73],[-17,-71],[15,-69],[49,-68],[83,-67],[114,-67],[150,-70],[178,-76],[150,-86],[90,-88],[20,-89],[-40,-83]]
];
window.mountGlobe3D=function(el){
const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,50);camera.position.set(0,.10,4.55);camera.lookAt(0,.10,0);const renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;el.querySelector('img').replaceWith(renderer.domElement);el.querySelector('.hint').textContent='Drag to turn · Hover to discover';
scene.add(new T.HemisphereLight(0xffffff,0x91a2d3,1.65));const sun=new T.DirectionalLight(0xfff2dc,2.15);sun.position.set(-3,5,5);scene.add(sun);const rimLight=new T.DirectionalLight(0xd1dfff,.7);rimLight.position.set(3,2,-3);scene.add(rimLight);const root=new T.Group();scene.add(root);root.rotation.set(.12,-.25,-.09);
const mat=(c,flat=true)=>new T.MeshStandardMaterial({color:c,roughness:.82,flatShading:flat});const ocean=mat('#64b4ee'),green=mat('#b8d970'),gold=mat('#eed780'),mint=mat('#8bd6bd'),roof=mat('#7777c7'),red=mat('#e97e63'),cream=mat('#ffe3ac'),trunk=mat('#c6986d'),leaf=mat('#9acd70'),pink=mat('#efb7d9'),white=mat('#faf6ff',false);
function mesh(g,m,parent=root){const o=new T.Mesh(g,m);parent.add(o);return o}function ball(parent,x,y,z,r,m,detail=1){const o=mesh(new T.IcosahedronGeometry(r,detail),m,parent);o.position.set(x,y,z);return o}function box(p,x,y,z,w,h,d,m){const o=mesh(new T.BoxGeometry(w,h,d),m,p);o.position.set(x,y,z);return o}function cone(p,x,y,z,rt,rb,h,m,n=8){const o=mesh(new T.CylinderGeometry(rt,rb,h,n),m,p);o.position.set(x,y,z);return o}
function pos(lon,lat,r=1){const a=T.MathUtils.degToRad(lon),b=T.MathUtils.degToRad(lat);return new T.Vector3(Math.cos(b)*Math.sin(a)*r,Math.sin(b)*r,Math.cos(b)*Math.cos(a)*r)}
function anchor(lon,lat,r=1.035){const g=new T.Group(),n=pos(lon,lat);g.position.copy(n.multiplyScalar(r));g.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),g.position.clone().normalize());root.add(g);return g}
function faceColors(geometry,pick){
 const positions=geometry.attributes.position;const colors=[];
 for(let i=0;i<positions.count;i+=3){
  const center=new T.Vector3().fromBufferAttribute(positions,i).add(new T.Vector3().fromBufferAttribute(positions,i+1)).add(new T.Vector3().fromBufferAttribute(positions,i+2)).normalize();
  const color=pick(center);const variation=Math.sin(i*78.233)*.033;
  color.offsetHSL(0,0,variation);
  for(let j=0;j<3;j++)colors.push(color.r,color.g,color.b);
 }
 geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));
 return geometry;
}
const oceanSurface=mat('#ffffff');oceanSurface.vertexColors=true;
mesh(faceColors(new T.IcosahedronGeometry(1,5),()=>new T.Color('#3988e1')),oceanSurface);
const landSurface=mat('#ffffff');landSurface.vertexColors=true;landSurface.side=T.DoubleSide;
const coastMaterial=mat('#a2b750');coastMaterial.side=T.DoubleSide;
lands.forEach((polygon,index)=>{
 const coords=polygon.map(p=>new T.Vector2(...p)),vertices=[],edges=[];
 const radius=1.032;
 function tri(a,b,c,depth){
  if(depth){const ab=a.clone().lerp(b,.5),bc=b.clone().lerp(c,.5),ca=c.clone().lerp(a,.5);
   tri(a,ab,ca,depth-1);tri(ab,b,bc,depth-1);tri(ca,bc,c,depth-1);tri(ab,bc,ca,depth-1);
  }else for(const p of [a,b,c])vertices.push(...pos(p.x,p.y,radius).toArray());
 }
 T.ShapeUtils.triangulateShape(coords,[]).forEach(t=>tri(...t.map(i=>coords[i]),3));
 const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.computeVertexNormals();
 mesh(faceColors(geo,v=>{
  const lat=Math.asin(v.y)*180/Math.PI,lon=Math.atan2(v.x,v.z)*180/Math.PI;
  const sandy=index>=18||(index===3&&(lat>12||lat< -19))||(index===4&&lat<43&&lon>30)||index===5;
  return new T.Color(sandy?'#edce70':'#b3ce65');
 }),landSurface);
 coords.forEach((a,i)=>{
  const b=coords[(i+1)%coords.length];
  for(let j=0;j<8;j++){
   const u=a.clone().lerp(b,j/8),v=a.clone().lerp(b,(j+1)/8);
   const wall=[pos(u.x,u.y,.991),pos(v.x,v.y,.991),pos(v.x,v.y,radius),pos(u.x,u.y,radius)];
   [0,1,2,0,2,3].forEach(k=>edges.push(...wall[k].toArray()));
  }
 });
 const wall=new T.BufferGeometry();wall.setAttribute('position',new T.Float32BufferAttribute(edges,3));wall.computeVertexNormals();mesh(wall,coastMaterial);
});
function tree(lon,lat,scale=1,color=leaf){const p=anchor(lon,lat);p.scale.setScalar(scale);cone(p,0,.045,0,.015,.021,.09,trunk,6);ball(p,0,.105,0,.057,color);ball(p,.032,.105,.01,.038,color)}
[[-123,49],[-115,55],[-95,57],[-65,-9],[-63,-22],[-73,-30],[8,49],[20,57],[42,53],[80,55],[115,48],[126,40],[135,51],[37,-4],[25,-27],[140,-25],[-155,62]].forEach((p,i)=>tree(...p,.7+(i%3)*.16,i%5===0?pink:leaf));
// Tiered pavilion: red columns, warm stone platforms, swept blue roofs.
const temple=anchor(103,49);temple.scale.setScalar(.9);for(let i=0;i<3;i++){const y=.05+i*.105,w=.29-i*.055;box(temple,0,y,0,w,.035,w*.78,cream);box(temple,0,y+.047,0,w*.75,.073,w*.58,red);for(const x of [-1,1])for(const z of [-1,1])box(temple,x*w*.33,y+.052,z*w*.25,.014,.085,.014,cream);const r=cone(temple,0,y+.108,0,w*.23,w*.78,.075,roof,4);r.rotation.y=Math.PI/4;const rim=cone(temple,0,y+.075,0,w*.79,w*.83,.013,cream,4);rim.rotation.y=Math.PI/4}ball(temple,0,.39,0,.018,mat('#f4c353'));cone(temple,0,.37,0,0,.012,.045,cream);
// Eiffel Tower: four tapering legs, two decks and an antenna.
const eiffel=anchor(2,50);eiffel.rotation.y=.3;const peach=mat('#e7b69a');for(const x of [-1,1])for(const z of [-1,1]){const leg=box(eiffel,x*.047,.14,z*.047,.021,.29,.021,peach);leg.rotation.z=x*.23;leg.rotation.x=-z*.23}box(eiffel,0,.105,0,.16,.018,.16,peach);box(eiffel,0,.23,0,.085,.018,.085,peach);cone(eiffel,0,.315,0,.008,.04,.2,peach,4);cone(eiffel,0,.44,0,.003,.008,.065,cream);ball(eiffel,0,.474,0,.011,cream);
// Statue of Liberty: pedestal, draped figure, crown and raised torch.
const liberty=anchor(-79,46);box(liberty,0,.025,0,.105,.05,.095,cream);box(liberty,0,.063,0,.075,.03,.065,trunk);cone(liberty,0,.17,0,.028,.052,.19,mint,7);ball(liberty,0,.29,0,.033,mint);for(let i=0;i<7;i++){const a=i*Math.PI/3.5;const spike=cone(liberty,Math.cos(a)*.035,.315,Math.sin(a)*.035,0,.008,.035,mint,4);spike.rotation.z=-Math.cos(a)*.6}const arm=box(liberty,-.055,.3,0,.021,.16,.022,mint);arm.rotation.z=-.4;cone(liberty,-.087,.39,0,.023,.012,.027,cream);ball(liberty,-.087,.42,0,.018,mat('#ffd35a'));box(liberty,.048,.21,.015,.035,.065,.014,mint);
// Acacia and rock cluster near southern Africa.
const acacia=anchor(31,-28);const stem=cone(acacia,0,.09,0,.017,.028,.18,trunk,6);for(const s of [-1,1]){const b=box(acacia,s*.035,.16,0,.018,.13,.018,trunk);b.rotation.z=-s*.6}const canopy=ball(acacia,0,.225,0,.13,leaf,2);canopy.scale.set(1.15,.32,.75);ball(acacia,-.08,.22,0,.07,leaf);const rock=ball(acacia,-.075,.035,.06,.055,mat('#e9c591'));rock.scale.y=1.4;
// Additional landmarks on the reverse side make a full turn worth exploring.
const fuji=anchor(139,36);cone(fuji,0,.07,0,0,.12,.16,mat('#c3b7d9'),7);cone(fuji,0,.14,0,0,.04,.05,white,7);const pyramid=anchor(30,27);const py=cone(pyramid,0,.06,0,0,.1,.13,gold,4);py.rotation.y=.4;
// European landmarks from the first reference.
const biscuit=mat('#e7b17f'),stone=mat('#f6cf9e'),ivory=mat('#fff1dd'),blueDome=mat('#448ed8');
function archBlock(w,h,d){
 const shape=new T.Shape(),r=w*.28,y=h*.45;
 shape.moveTo(-w/2,0);shape.lineTo(-r,0);shape.lineTo(-r,y);
 shape.absarc(0,y,r,Math.PI,0,true);shape.lineTo(r,0);
 shape.lineTo(w/2,0);shape.lineTo(w/2,h);shape.lineTo(-w/2,h);shape.closePath();
 return new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:.002,bevelThickness:.002,bevelSegments:1,curveSegments:8});
}
const arena=anchor(18,49);
cone(arena,0,.018,0,.138,.15,.037,biscuit,20);
for(let tier=0;tier<3;tier++){
 const y=.037+tier*.067,r=.122-tier*.007,n=12;
 const arch=archBlock(.064,.065,.022);
 for(let i=0;i<n;i++){
  if(tier===2&&i>=8)continue;
  const a=i*Math.PI*2/n,o=mesh(arch,stone,arena);
  o.position.set(Math.sin(a)*r,y,Math.cos(a)*r);o.rotation.y=a;
 }
 if(tier<2)cone(arena,0,y+.065,0,r+.026,r+.026,.011,biscuit,20);
}
const windmill=anchor(-9,53);
cone(windmill,0,.075,0,.052,.076,.15,ivory,8);
cone(windmill,0,.174,0,.002,.069,.072,mat('#ce8058'),8);
box(windmill,0,.035,.065,.026,.064,.009,biscuit);
const sails=new T.Group();sails.position.set(0,.151,.083);sails.rotation.z=.43;windmill.add(sails);
for(let i=0;i<4;i++){
 const arm=new T.Group();arm.rotation.z=i*Math.PI/2;sails.add(arm);
 box(arm,0,.066,0,.007,.145,.009,trunk);
 box(arm,.02,.092,0,.037,.082,.007,ivory);
 for(let j=0;j<4;j++)box(arm,.02,.064+j*.018,.006,.039,.003,.003,biscuit);
}
ball(sails,0,0,.01,.013,biscuit,2);
const chapel=anchor(32,36);
box(chapel,0,.042,0,.18,.084,.125,ivory);
for(const [x,y,r] of [[0,.09,.057],[-.067,.072,.031],[.067,.072,.031]]){
 cone(chapel,x,y,0,r,r,.045,ivory,14);
 const dome=mesh(new T.SphereGeometry(r,18,10,0,Math.PI*2,0,Math.PI/2),blueDome,chapel);
 dome.position.set(x,y+.021,0);
 ball(chapel,x,y+r+.024,0,.007,cream,1);
 box(chapel,x,y-.045,.064,.018,.04,.007,blueDome);
}
// Rounded lavender cloud puffs, separated from the land.
const clouds=[];
[[-104,20,1.26,.94],[-47,68,1.23,1.08],[77,-24,1.23,1.02],[4,-52,1.24,.87],[155,8,1.22,1],[-49,-40,1.23,.97],[-14,4,1.14,.86],[56,58,1.18,.73]].forEach(([lon,lat,r,size])=>{
 const pivot=new T.Group();pivot.position.copy(pos(lon,lat,r));root.add(pivot);pivot.scale.setScalar(size);
 [[-.11,-.024,0,.084],[-.013,.038,-.01,.125],[.097,-.012,0,.083],[.015,-.045,.047,.098]].forEach(([x,y,z,r])=>ball(pivot,x,y,z,r,white,3));
 clouds.push(pivot);
});
const countries=[['China',104,35],['USA',-100,38],['Zimbabwe',30,-19],['Japan',139,37],['Brazil',-52,-12],['Australia',134,-25],['France',2,47],['Italy',13,42],['Netherlands',5,52],['Greece',23,38],['India',79,22],['Canada',-110,58],['Egypt',30,27],['Korea',127,37]];
const pins=[];countries.forEach(([name,lon,lat],i)=>{if(i>5)return;const p=anchor(lon,lat);const pm=mat('#f32b6b');cone(p,0,.032,0,.025,0,.065,pm,16);const b=ball(p,0,.075,0,.036,pm,3);b.scale.z=.65;ball(p,0,.08,.026,.015,white,2);pins.push(p)});
const label=document.createElement('div');label.className='country-tooltip';label.setAttribute('role','status');el.append(label);const ray=new T.Raycaster(),mouse=new T.Vector2();let hover=null,down=false,lastX=0,lastY=0,startX=0,startY=0,moved=0,speed=0,frame;const targetSphere=new T.Sphere(new T.Vector3(),1.025);
function hoverAt(e){const rect=renderer.domElement.getBoundingClientRect();mouse.set((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1);ray.setFromCamera(mouse,camera);const hit=ray.ray.intersectSphere(targetSphere,new T.Vector3());hover=null;if(hit){const local=root.worldToLocal(hit.clone()).normalize();let best=-1;countries.forEach(c=>{const score=local.dot(pos(c[1],c[2]));if(score>best){best=score;hover=c}});if(best<.87)hover=null}label.textContent=hover?hover[0]:'';label.classList.toggle('visible',!!hover&&!down);const scale=rect.width/renderer.domElement.clientWidth;label.style.left=(e.clientX-rect.left)/scale+'px';label.style.top=((e.clientY-rect.top)/scale-22)+'px'}
el.addEventListener('pointerdown',e=>{down=true;speed=0;moved=0;startX=lastX=e.clientX;startY=lastY=e.clientY;label.classList.remove('visible');el.setPointerCapture(e.pointerId)});el.addEventListener('pointermove',e=>{if(!down){hoverAt(e);return}const dx=e.clientX-lastX,dy=e.clientY-lastY;root.rotation.y+=dx*.007;root.rotation.x=Math.max(-1.4,Math.min(1.4,root.rotation.x+dy*.006));speed=dx*.0015;moved=Math.max(moved,Math.hypot(e.clientX-startX,e.clientY-startY));lastX=e.clientX;lastY=e.clientY});el.addEventListener('pointerup',e=>{if(!down)return;down=false;if(moved<7)location.hash='china';else hoverAt(e)});el.addEventListener('pointerleave',()=>label.classList.remove('visible'));el.addEventListener('pointercancel',()=>{down=false;speed=0});el.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Enter',' '].includes(e.key))e.preventDefault();if(e.key==='ArrowLeft')root.rotation.y-=.2;if(e.key==='ArrowRight')root.rotation.y+=.2;if(e.key==='ArrowUp')root.rotation.x-=.15;if(e.key==='ArrowDown')root.rotation.x+=.15;if(e.key==='Enter'||e.key===' ')location.hash='china'});
const observer=new ResizeObserver(()=>{const w=el.clientWidth;renderer.setSize(w,w*.91);camera.aspect=1/.91;camera.updateProjectionMatrix()});observer.observe(el);function animate(){if(!el.isConnected){observer.disconnect();renderer.dispose();root.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});return}if(!down){root.rotation.y+=speed;speed*=.94}if(!down&&Math.abs(speed)<.0001)speed=0;root.updateWorldMatrix(true,false);for(const c of clouds)c.quaternion.copy(root.quaternion).invert();renderer.render(scene,camera);frame=requestAnimationFrame(animate)}animate();
};
