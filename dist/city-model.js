// An orthographic, depth-sorted scale model. All geometry is in district coordinates.
const TAU = Math.PI * 2;
const RAD = Math.PI / 180;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const unit = value => clamp(Number(value) || 0, 0, 1);
const pt = (x, z, y = 0) => [x, y, z];
function tint(hex, factor) {
  const n = parseInt(hex.slice(1), 16);
  const shadow=clamp(1-factor,0,.45);
  const color=[(n>>16)*(1-.18*shadow),((n>>8)&255)+9*shadow,(n&255)+32*shadow];
  return `rgb(${color.map(c => Math.min(255,Math.round(c*factor))).join(',')})`;
}
function seeded(seed) {
  return () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
}
const river = x => -1.9 + 3.9 * Math.sin((x + 7) * .042) + .043 * x;
const width = x => 5.9 + .8 * Math.cos(x * .068);
const topFace = (x, z, w, d, y) => [pt(x-w/2,z-d/2,y),pt(x+w/2,z-d/2,y),pt(x+w/2,z+d/2,y),pt(x-w/2,z+d/2,y)];
function group(x,z) { return { x,z, faces: [] }; }
function face(g, points, color, normal = null) {
  const c = [0,0,0];
  for (const p of points) { c[0] += p[0]; c[1] += p[1]; c[2] += p[2]; }
  g.faces.push({points, color, normal, center: c.map(v => v / points.length)});
}
function box(g, x, z, w, d, bottom, h, color, roof = null) {
  const a = topFace(x,z,w,d,bottom), b = topFace(x,z,w,d,bottom+h);
  const normals = [[0,0,-1],[1,0,0],[0,0,1],[-1,0,0]];
  const lighting = [.69,.61,.96,1.13];
  for(let i=0;i<4;i++) { const j=(i+1)%4; face(g,[a[i],a[j],b[j],b[i]],tint(color,lighting[i]),normals[i]); }
  face(g,b,roof||tint(color,1.06),[0,1,0]);
}
function prism(g,x,z,rx,rz,y0,y1,n,color,r2=1,phase=0) {
  const bottom=[], top=[];
  for(let k=0;k<n;k++) { const t=k*TAU/n+phase; bottom.push(pt(x+rx*Math.cos(t),z+rz*Math.sin(t),y0)); top.push(pt(x+rx*r2*Math.cos(t),z+rz*r2*Math.sin(t),y1)); }
  for(let k=0;k<n;k++) { const j=(k+1)%n, t=(k+.5)*TAU/n+phase; const nx=Math.cos(t),nz=Math.sin(t);face(g,[bottom[k],bottom[j],top[j],top[k]],tint(color,.88-.14*nx+.11*nz),r2===1?[nx,0,nz]:null); }
  if(r2>0)face(g,top,tint(color,1.06),[0,1,0]);
}
const district = [];
const shadows = [];
const ground = [];
const roadXs = [-51,-27,-2,23,50];
const roadZs = [-32,31];
function pavement(x,z,w,d,color) {ground.push({p:topFace(x,z,w,d,.04),c:color});}
function frontage(g,x,z,w,d,h,style,rng) {
  const walls=g.faces.slice(-5,-1);
  const rows=Math.max(1,Math.floor((h-1.2)/2.05));
  for(let side=0;side<4;side++) {
    const alongX=side%2===0, sign=side<2?1:-1;
    const wall=walls[[2,1,0,3][side]];wall.decals=[];wall.facade=true;
    const decorate=(points,color)=>wall.decals.push({points,color});
    const panel=(u,v)=>alongX?pt(x+u,z+sign*(d/2+.06),v):pt(x+sign*(w/2+.06),z+u,v);
    const rect=(a,b,l,r,color)=>decorate([panel(a,l),panel(b,l),panel(b,r),panel(a,r)],color);
    const len=alongX?w:d, interval=style==='glass'?1.55:1.94;
    const count=Math.max(1,Math.floor((len-.8)/interval));
    for(let j=0;j<count;j++) for(let k=0;k<rows;k++) {
      const a=(j+.5)*len/count-len/2, b=.85+k*(h-1.15)/rows;
      const rw=style==='glass'?len/count-.19:Math.min(len/count*.53,1.14);
      const rh=Math.min((h-1.05)/rows*.72,1.58);
      const shade=rng();
      const warm=['#ffce85','#d9a864','#edd6ae','#f2b96a'];
      const dark=['#234652','#354f58','#476b72'];
      const c=shade<.48?warm[(k+j+side)%warm.length]:dark[(j+2*k)%dark.length];
      const world=(u,v)=>alongX?pt(x+a+u,z+sign*(d/2+.06),v):pt(x+sign*(w/2+.06),z+a+u,v);
      decorate([world(-rw/2,b),world(rw/2,b),world(rw/2,b+rh),world(-rw/2,b+rh)],c);
      if(style==='glass')rect(a-rw/2,a+rw/2,b+rh*.72,b+rh*.78,'#688084');
      else rect(a-rw/2-.09,a+rw/2+.09,b-.14,b-.035,'#8e9491');
    }
    if(side===0){rect(-.71,.71,.44,2.18,'#5d6967');rect(-.51,-.04,.45,1.95,'#708f8b');rect(.04,.51,.45,1.95,'#708f8b');}
    if(style==='brick')for(let j=1;j<rows;j++){const y=.74+j*(h-1.15)/rows;rect(-len/2,len/2,y-.11,y,'#bca592');}
  }
}
function building(x,z,w,d,h,wall,style='stone',seed=1) {
  const rng=seeded(seed),g=group(x,z);district.push(g);
  shadows.push({x,z,w,d,h}); box(g,x,z,w+.55,d+.55,.08,.48,'#697772');
  box(g,x,z,w,d,.44,h-.44,wall,style==='glass'?'#58757b':'#77847e');
  frontage(g,x,z,w,d,h,style,rng);
  box(g,x,z,w+.28,d+.28,h,.32,style==='brick'?'#a8947c':'#a7ac9f');
  box(g,x,z,w-.38,d-.38,h+.32,.08,'#667873');
  if(style==='tower') {
    box(g,x,z,w*.77,d*.76,h+.40,2.15,wall,'#a9ac9d');
    box(g,x,z,w*.50,d*.5,h+2.55,1.3,'#99a19a');
    if(seed%3===0){
      prism(g,x,z,w*.26,d*.25,h+3.85,h+5.45,4,'#688387',.39,Math.PI/4);
      box(g,x,z,.17,.17,h+5.4,2.6,'#dbc59a');
    }else{
      box(g,x+w*.13,z-d*.12,.18,.18,h+3.85,2.15,'#9a9f91');
      for(const off of [-.22,0,.22])box(g,x+w*off,z-d*.22,w*.11,.27,h+3.87,.18,'#52696a');
    }
  } else {
    box(g,x-w*.18,z+d*.10,Math.max(1.15,w*.28),Math.max(.8,d*.24),h+.41,.7,'#7e8b80');
    box(g,x-w*.18,z+d*.10,Math.max(.78,w*.20),Math.max(.5,d*.18),h+1.11,.10,'#526766');
    if(style==='glass'){
      for(const off of [-.26,-.1,.06,.22])face(g,topFace(x+w*.19,z+off*d,w*.25,d*.115,h+.42),'#435d68',[0,1,0]);
    }else{
      for(const off of [-.22,.21])face(g,topFace(x,z+d*off,w*.85,.075,h+.42),'#687671',[0,1,0]);
    }
    if(w>6)box(g,x+w*.27,z-d*.19,1,1,h+.41,1.1,'#b7b7a5');
  }
  return g;
}
function classicalHall(x,z) {
  const g=group(x,z);district.push(g);shadows.push({x,z,w:15,d:8,h:11});
  box(g,x,z,16.6,10,.08,.45,'#b4b5a3');box(g,x,z,15.8,9.4,.53,.47,'#d2cfb7');
  box(g,x,z-.8,14.5,6.9,1,5.5,'#c8c7ae');
  frontage(g,x,z-.8,14.5,6.9,5.7,'stone',seeded(34));
  for(let j=0;j<7;j++) {
    const cx=x-6.2+j*2.07;
    box(g,cx,z+3.64,.85,.85,1,.28,'#cecab5');prism(g,cx,z+3.64,.31,.31,1.28,5.9,8,'#e0ddc4');
    box(g,cx,z+3.64,.84,.84,5.9,.4,'#e3dfc4');
  }
  box(g,x,z,15.6,9.2,6.3,.72,'#c7c7ac');
  const front=z+4.6,back=z-4.6;
  for(const [iz,n] of [[front,1],[back,-1]])face(g,[pt(x-7.8,iz,7),pt(x+7.8,iz,7),pt(x,iz,9.05)],'#e0d8b7',[0,0,n]);
  face(g,[pt(x-7.8,front,7),pt(x,front,9.05),pt(x,back,9.05),pt(x-7.8,back,7)],'#7f9588');
  face(g,[pt(x,front,9.05),pt(x+7.8,front,7),pt(x+7.8,back,7),pt(x,back,9.05)],'#5c7d72');
  prism(g,x,z-.75,2.55,2.55,8.7,10.2,12,'#c8c6b2');
  prism(g,x,z-.75,2.62,2.62,10.15,11.65,14,'#829988',.84);prism(g,x,z-.75,2.2,2.2,11.65,12.5,14,'#8ca395',.49);
  prism(g,x,z-.75,1.12,1.12,12.5,12.88,14,'#8ca691',.26);prism(g,x,z-.75,.24,.24,12.87,14.23,8,'#c8b47f',.15);
  for(let i=0;i<3;i++)box(g,x,z+5.55+i*.47,7.4,.52,.05,.74-i*.22,'#cfceb7');
}
const rng=seeded(2026);
const tones=['#8a9692','#657b7d','#aca799','#997d6f','#7a8686','#959b92','#9e8c78','#68868c'];
for(const z of [-41,41]) {
  for(const x of [-61,-44,-34,-20,-10,5,16,31,41,60]) {
    if(z>0 && (x===-10||x===5||x===16))continue;
    const cx=x+rng()*.7,cz=z+rng()*1.6-1;const w=5.2+rng()*2.6,d=5+rng()*2;
    const h=z<0?6+rng()*13:3+rng()*6;
    building(cx,cz,w,d,h+(z<0&&x===16?5.9:0),tones[Math.floor(rng()*tones.length)],h>11?'tower':rng()<.36?'glass':'brick',Math.floor(rng()*10000));
  }
}
for(const [x,z,w,d,h,wall,style] of [
 [-60,-21,8,7,6,'#b6b6a2','stone'],[-41,-22,11,7.5,8.5,'#928e85','brick'],[15,-23,7,7,9,'#98a7a5','glass'],[34,-23,11.5,7.5,10,'#8da29c','glass'],[58,-22,9,6.3,5.3,'#a77f68','brick'],[-60,21,7.5,6,5,'#a47763','brick'],[-40,20,13,6.8,5,'#ad846c','brick'],[-17,22,7.2,6.4,8,'#9eab9e','stone'],[7,21,9,7,6,'#b8ac93','stone'],[36,22,13,8,6.8,'#c2bd9f','stone'],[60,22,8.3,8,6.9,'#94a39a','glass'] ])building(x,z,w,d,h,wall,style,Math.round((x+100)*(z+60)));
classicalHall(-13,-21);

// The clock and copper lantern distinguish the civic frontage at a glance.
const clockTower=group(-21.2,-23.5);district.push(clockTower);
box(clockTower,-21.2,-23.5,2.42,2.55,.2,7.8,'#b2a688');
box(clockTower,-21.2,-23.5,2.69,2.8,8,.28,'#cbbc91');
box(clockTower,-21.2,-23.5,2.31,2.36,8.28,2.14,'#a89e82');
for(const [nx,nz] of [[0,1],[-1,0],[1,0],[0,-1]]){
  const dial=Array.from({length:12},(_,i)=>{
    const a=i*TAU/12,u=Math.cos(a)*.68;
    return pt(-21.2+nx*1.21+nz*u,-23.5+nz*1.24-nx*u,9.35+Math.sin(a)*.68);
  });
  face(clockTower,dial,'#ffcf89',[nx,0,nz]);
}
prism(clockTower,-21.2,-23.5,1.66,1.66,10.42,12.25,4,'#587a77',.21,Math.PI/4);
prism(clockTower,-21.2,-23.5,.20,.20,12.25,13.25,6,'#e4bd78',0);
shadows.push({x:-21.2,z:-23.5,w:2.7,d:2.8,h:12.3});
// A riverfront park, promenade and separately planted avenues.
function tree(x,z,s=1,kind=0) {
  const g=group(x,z);district.push(g);const height=(2.6+rng()*.95)*s;
  box(g,x,z,.24*s,.24*s,.04,height*.63,'#817e61');
  const leaves=['#536f54','#69815d','#43655d','#587558','#75815b'][kind%5];
  prism(g,x,z,1.32*s,1.14*s,height*.34,height*.63,7,leaves,1.24,.12);
  prism(g,x,z,1.64*s,1.41*s,height*.63,height*.91,7,leaves,.72,.12);
  prism(g,x,z,1.18*s,1.02*s,height*.91,height*1.08,7,leaves,.12,.12);
  shadows.push({x,z,w:1.6*s,d:1.2*s,h:height});
}
for(let x=-64;x<=64;x+=4.8) {
  if(roadXs.some(v=>Math.abs(x-v)<3.5))continue;
  for(const z of [river(x)-width(x)-2.5,river(x)+width(x)+2.3])tree(x,z,.73+rng()*.33,Math.floor(rng()*5));
}
for(let i=0;i<28;i++)tree(-20+rng()*39,36+rng()*10,.74+rng()*.72,Math.floor(rng()*5));
for(const z of [-30.15,29.1])for(let x=-62;x<64;x+=8.8)if(!roadXs.some(v=>Math.abs(x-v)<3))tree(x,z,.60+rng()*.22,Math.floor(rng()*5));
// Road paint, sidewalks, crossings, parked cars and the two rival river crossings.
for(const z of roadZs){pavement(0,z,133,4.5,'#969c90');pavement(0,z,133,3.5,'#526469');}
for(const x of roadXs) {
 for(const z of [-28,27]) {const bottom=z<0?-48:river(x)+width(x)+.8, top=z<0?river(x)-width(x)-.8:48;
  pavement(x,(top+bottom)/2,4.5,top-bottom,'#8c968d');pavement(x,(top+bottom)/2,3.3,top-bottom,'#586a6c');}
}
for(const z of roadZs)for(let x=-63;x<64;x+=4.8)if(!roadXs.some(v=>Math.abs(x-v)<3.2))pavement(x,z,2.1,.14,'#d8ca98');
for(const x of roadXs)for(let z=-46;z<46;z+=4.4)if(Math.abs(z-river(x))>width(x)+2&&roadZs.every(v=>Math.abs(z-v)>3.2))pavement(x,z,.13,1.9,'#d5c690');
for(const z of roadZs)for(const x of roadXs)for(const sign of [-1,1])for(let k=0;k<5;k++)pavement(x+sign*3.15,z-1.24+k*.62,.56,.36,'#d0d0b9');
function bridge(x,arched) {
 const mid=river(x), span=width(x)*2+8, g=group(x,mid);district.push(g);
 for(const off of [-span*.30,span*.30])for(const edge of [-1.62,1.62])box(g,x+edge,mid+off,.83,1.3,-1.3,3.5,'#8d9b91');
 box(g,x,mid,4.55,span,1.25,.8,'#a9b0a0','#818b83');
 for(const edge of [-2.19,2.19]) {
  box(g,x+edge,mid,.20,span,2.05,.65,'#c5c4ad');
  for(let i=0;i<=8;i++) box(g,x+edge,mid-span/2+i*span/8,.18,.18,2.65,.4,'#929f96');
  box(g,x+edge,mid,.14,span,3.02,.13,'#a1b2a5');
  if(arched) {
    const chord=[];for(let i=0;i<=12;i++){const u=i/12,z=mid+span*(u-.5),h=2.70+3.45*Math.sin(Math.PI*u);chord.push([z,h]);
      if(i%2===0&&h>3.2)box(g,x+edge,z,.18,.18,2.7,h-2.7,'#849b8d');}
    for(let i=0;i<12;i++){const [[a,ha],[b,hb]]=chord.slice(i,i+2);face(g,[pt(x+edge,a,ha),pt(x+edge,b,hb),pt(x+edge,b,hb+.32),pt(x+edge,a,ha+.32)],'#8ca998');}
  }
 }
 for(let i=1;i<7;i++)face(g,topFace(x,mid-span/2+i*span/7,.14,1.45,2.08),'#d1c9a1',[0,1,0]);
}
bridge(-27,true);bridge(50,false);
// Amber bridge beacons and long balustrades make the river crossing legible at dusk.
for(const x of [-27,50]){
  const z=river(x),gage=width(x)+2.9,g=group(x,z);district.push(g);
  for(const side of [-1,1])for(const end of [-1,1]){
    const bx=x+side*2.21,bz=z+end*gage;
    box(g,bx,bz,.36,.36,2.55,2.0,'#697c76');
    box(g,bx,bz,.59,.59,4.55,.29,'#ffe0a4');
  }
}
for(const sign of [-1,1])for(let x=-65;x<=63;x+=3.5){
  if([-27,50].some(bx=>Math.abs(x-bx)<4.8))continue;
  const z=river(x)+sign*(width(x)+.38),g=group(x,z);district.push(g);
  box(g,x,z,.20,.20,.08,.90,'#728580');
  const nextX=x+3.35,nextZ=river(nextX)+sign*(width(nextX)+.38);
  face(g,[pt(x,z,.83),pt(nextX,nextZ,.83),pt(nextX,nextZ,.95),pt(x,z,.95)],'#90a39c');
}
function car(x,z,heading,color,emergency=false,y=.08) {
 const g=group(x,z),w=heading?1.94:.92,d=heading?.92:1.94;
 box(g,x,z,w,d,y,.55,color);box(g,x,z,w*(heading?.55:.83),d*(heading?.8:.55),y+.55,.4,emergency?'#c5ccc0':'#849798');
 if(emergency){box(g,x-.2,z,.32,.28,y+.96,.19,'#e2af69');box(g,x+.2,z,.32,.28,y+.96,.19,'#59969d');}
 for(const side of [-1,1]){
   const lampX=heading?x+w*.49:x+side*w*.33,lampZ=heading?z+side*d*.33:z+d*.49;
   box(g,lampX,lampZ,.17,.17,y+.25,.13,'#f5d497');
 }
 return g;
}
for(let n=0;n<28;n++) {const z=roadZs[n%2]+(n%3===0?-.9:.92),x=-63+rng()*126;
 if(roadXs.some(v=>Math.abs(v-x)<3.5))continue;district.push(car(x,z,true,['#d7d1b8','#6e8f8a','#a77360','#c6ae80','#71848b'][n%5]));}
function person(x,z,color) {const g=group(x,z);box(g,x,z,.29,.25,.08,.52,'#505e5d'); box(g,x,z,.43,.32,.6,.59,color);prism(g,x,z,.18,.17,1.19,1.47,6,'#c09d79');return g;}
// Covered transit shelters and a fountain distinguish the civic plaza from the residential grid.
for(const [x,z] of [[35,28.25],[-41,25],[-11,-29.2]]){
 const shelter=group(x,z);district.push(shelter);for(const off of [-2.15,2.15])box(shelter,x+off,z,.14,.22,.1,2.3,'#647e76');
 box(shelter,x,z,5.0,1.57,2.36,.24,'#879e8f');box(shelter,x,z,3.6,.53,.46,.25,'#a18e6e');}
const fountain=group(-13,-12.4);district.push(fountain);prism(fountain,-13,-12.4,1.76,1.52,.1,.52,14,'#b6b8a2');prism(fountain,-13,-12.4,1.52,1.29,.52,.58,14,'#80afaa');prism(fountain,-13,-12.4,.55,.55,.58,1.0,10,'#c0c3ad');prism(fountain,-13,-12.4,.16,.16,1,1.95,8,'#bdcfbf',.3);
for(const [fx,fz] of [[-23,-17.4],[43.6,24.4]]){const flag=group(fx,fz);district.push(flag);prism(flag,fx,fz,.11,.11,.1,5.05,7,'#b0b3a4');face(flag,[pt(fx,fz,4.95),pt(fx+1.6,fz+.2,4.7),pt(fx+2.05,fz+.06,4.72),pt(fx+2.05,fz+.06,3.83),pt(fx,fz,4.07)],'#84a596');}
// Riverside landing stages connect the promenade to the launch used in the exercise.
for(const x of [-56,12,36]){const z=river(x)+width(x)-1.05,g=group(x,z);district.push(g);box(g,x,z,5.2,2.35,.13,.32,'#a6987a');
 for(const sign of [-1,1])for(const off of [-.82,.82])prism(g,x+sign*2.4,z+off,.14,.14,-.2,.93,6,'#867a60');
 for(let t=-2.3;t<2.5;t+=.42)face(g,topFace(x+t,z,.055,1.87,.47),'#8f846b',[0,1,0]);}
function waterLaunch(x){const z=river(x)+.72,boat=group(x,z);
 const outline=[[-2.5,-.1],[-1.6,-.69],[1.38,-.69],[2.32,-.19],[2.4,.13],[1.34,.69],[-1.56,.69]];
 const a=outline.map(([dx,dz])=>pt(x+dx,z+dz,.22)), b=outline.map(([dx,dz])=>pt(x+dx,z+dz,.75));
 for(let i=0;i<a.length;i++){const j=(i+1)%a.length;face(boat,[a[i],a[j],b[j],b[i]],'#cfb689');}face(boat,b,'#ddd4b2',[0,1,0]);
 box(boat,x+.1,z,2.2,1.04,.75,.58,'#6c8f8c','#e4dec8');box(boat,x+.1,z,2.5,1.21,1.3,.13,'#dbd4b9');return boat;}
// The shopfronts form a covered market opposite the service centre. The bench,
 // canvas and tiled gable are separate surfaces so the district reads from any bearing.
function marketStall(x,z,w,cloth) {
  const g=group(x,z); district.push(g);
  box(g,x,z,w,1.75,.08,.88,'#826c56');
  for(const sx of [-1,1])for(const sz of [-1,1])
    box(g,x+sx*(w*.46),z+sz*.65,.12,.12,.82,1.69,'#756c5c');
  const panels=6;
  for(let n=0;n<panels;n++){
    const a=x-w*.56+w*1.12*n/panels,b=a+w*1.12/panels;
    const color=n%2?'#cdc2a3':cloth;
    for(const sign of [-1,1])face(g,[pt(a,z,2.86),pt(b,z,2.86),pt(b,z+sign*1.28,2.3),pt(a,z+sign*1.28,2.3)],color);
  }
  for(let n=0;n<4;n++)box(g,x-w*.33+n*w*.21,z+.23,w*.16,.46,.96,.28,n%2?'#b28257':'#8f9a68');
  shadows.push({x,z,w,d:2.4,h:2.8});
}
for(const [x,z,cloth] of [[29.5,34.8,'#95654e'],[36,34.8,'#617f77'],[42.5,34.8,'#95654e']])marketStall(x,z,4.3,cloth);

// Varied rooflines and small waterside warehouses give each bank a different character.
function pitchedRoof(g,x,z,w,d,y,ridge,roof){
  face(g,[pt(x-w/2,z-d/2,y),pt(x+w/2,z-d/2,y),pt(x+w/2,z,y+ridge),pt(x-w/2,z,y+ridge)],tint(roof,.84));
  face(g,[pt(x-w/2,z,y+ridge),pt(x+w/2,z,y+ridge),pt(x+w/2,z+d/2,y),pt(x-w/2,z+d/2,y)],tint(roof,1.12));
  for(const sign of [-1,1])face(g,[pt(x+sign*w/2,z-d/2,y),pt(x+sign*w/2,z+d/2,y),pt(x+sign*w/2,z,y+ridge)],'#987c68',[sign,0,0]);
}
for(const [x,z,w,d] of [[-62,-13.8,6.5,3.1],[-42,-14,6.8,3.0],[-36,-14.3,3.2,3.0],[5,-13.7,5.8,3.4],[12,-14.1,5.7,3.1],[-38,35.3,5.7,3],[-32,35.4,4.2,3]]){
  const g=group(x,z);district.push(g);
  box(g,x,z,w,d,.16,2.9,'#927d70');
  frontage(g,x,z,w,d,2.9,'brick',seeded(Math.floor(1700+x)));
  pitchedRoof(g,x,z,w+.44,d+.4,3.06,1.38,'#6e7a77');
  box(g,x+w*.3,z-.3,.43,.46,3.9,1.19,'#8b7466');
  shadows.push({x,z,w,d,h:4.4});
}
const staticPeople=seeded(928);
for(let j=0;j<35;j++){const x=-64+staticPeople()*128,z=roadZs[j%2]+2.4+staticPeople()*.3; if(!roadXs.some(v=>Math.abs(x-v)<2.7))district.push(person(x,z,['#a58967','#768d87','#b2a07b','#687b81'][j%4]));}
const lightPools=[];
function lamp(x,z){
  const g=group(x,z);district.push(g);
  box(g,x,z,.17,.17,.05,2.8,'#51646a');
  box(g,x+.28,z,.69,.15,2.81,.13,'#6c7976');
  box(g,x+.56,z,.44,.4,2.77,.20,'#ffd990');
  lightPools.push([x+.56,z]);
}
for(const x of [-58,-44,-32,-16,-5,9,22,36,45,56]){
  lamp(x,river(x)-width(x)-1.15);
  lamp(x+2,river(x+2)+width(x+2)+1.05);
}
for(const z of roadZs)for(let x=-60;x<=62;x+=15)lamp(x,z+2.14);
function band(project,ctx,low,high,y,color,start=-67,end=67) {
 const p=[];for(let x=start;x<=end;x+=2)p.push(pt(x,low(x),y));p.push(pt(end,low(end),y));
 for(let x=end;x>=start;x-=2)p.push(pt(x,high(x),y));p.push(pt(start,high(start),y));
 polygon(project,ctx,p,color);
}
function polygon(project,ctx,points,color) {
 ctx.beginPath();for(let j=0;j<points.length;j++){const p=project(points[j]);if(j===0)ctx.moveTo(p[0],p[1]);else ctx.lineTo(p[0],p[1]);}ctx.closePath();ctx.fillStyle=color;ctx.fill();
}
function drawGroup(g,view,project,ctx) {
 const visible=[];
 for(const f of g.faces){const n=f.normal;if(n&&(n[0]*view[0]+n[1]*view[1]+n[2]*view[2])<=.002)continue;
  const c=f.center;visible.push([f,c[0]*view[0]+c[1]*view[1]+c[2]*view[2]]);}
 visible.sort((a,b)=>a[1]-b[1]);
 for(const [f] of visible){
   polygon(project,ctx,f.points,f.color);
   if(f.facade){
     const top=project(f.points[3]),foot=project(f.points[0]);
     const sheen=ctx.createLinearGradient(top[0],top[1],foot[0],foot[1]);
     sheen.addColorStop(0,'rgba(221,207,178,.12)');sheen.addColorStop(.24,'rgba(81,102,113,.03)');sheen.addColorStop(1,'rgba(21,45,55,.30)');
     polygon(project,ctx,f.points,sheen);
   }
   if(f.decals)for(const d of f.decals)polygon(project,ctx,d.points,d.color);
 }
}
const deck=group(0,0);box(deck,0,0,134,96,-3.9,1.05,'#213a40','#49635d');box(deck,0,0,134,96,-2.85,.32,'#947c55','#a2926e');box(deck,0,0,134,96,-2.53,2.53,'#526961','#778774');
const ripples=Array.from({length:160},()=>{const x=-66+rng()*132;return [x,river(x)+(rng()*2-1)*(width(x)-.5),.23+rng()*1.7,rng()];});
const meadow=Array.from({length:95},()=>{const x=-65+rng()*130;return [x,river(x)+(rng()>.5?1:-1)*(width(x)+.8+rng()*2.3),.35+rng()*.8,rng()];});
const districtStations = [
  {id:'riverside',name:'Riverside',anchor:pt(-27,river(-27),6.75),stage:[-27,15],offset:[-1,-.4]},
  {id:'market',name:'Market Ward',anchor:pt(35.7,22,8.3),stage:[36,29],offset:[1,.35]},
  {id:'civic',name:'Civic Quarter',anchor:pt(-13,-21.7,14.6),stage:[-13,-29.3],offset:[-.1,-1]}
];
const lampReflections=[];
const shimmerRandom=seeded(177);
for(const x of [-58,-44,-32,-27,-16,-5,9,22,36,45,50,56]){
  for(let i=0;i<16;i++){
    const offset=(shimmerRandom()-.5)*(2.9+i*.13);
    lampReflections.push([x+offset,river(x)-width(x)+.63+i*.31,.42+shimmerRandom()*.83,.13+shimmerRandom()*.13]);
  }
}
const scenarios={ progress:0, flood:null, queue:null, response:null, playing:false, districts:null, selectedDistrict:null, transfers:[] };
const motionQuery = '(prefers-reduced-motion: reduce)';
/** Mount on a sized canvas; all metric values are fractions from zero to one. */
export function createCityModel(canvas, initial={}) {
 if(!canvas?.getContext) throw new TypeError('createCityModel requires a canvas element');
 const ctx=canvas.getContext('2d');if(!ctx)return {update(){},rotate(){},zoomBy(){},resetView(){},destroy(){}};
 const owner=canvas.ownerDocument||document;const win=owner.defaultView||window;
 const surface=owner.createElement('canvas'), buffer=surface.getContext('2d');
 const reduced=win.matchMedia?.(motionQuery);const state={...scenarios};
 let yaw=-34*RAD, pitch=35*RAD, zoom=1, w=0,h=0,dpr=1, frame=0, dirty=true, ended=false;
 let project,view,scale,skyMid,skyBottom,eventState,clock=0,lastTime=0,lastRender=0;
 let markerHits=[], tap=null, districtsKey='';
 let onSelectDistrict=typeof initial?.onSelectDistrict==='function'?initial.onSelectDistrict:null;
 const pointers=new Map();let pinch=0;const previousTouch=canvas.style.touchAction, previousCursor=canvas.style.cursor;
 canvas.style.touchAction='none';canvas.style.cursor='grab';
 function set(values){if(!values)return;
  for(const key of ['progress','flood','queue','response'])if(Object.hasOwn(values,key))state[key]=values[key]==null&&key!=='progress'?null:unit(values[key]);
  if(Object.hasOwn(values,'playing'))state.playing=Boolean(values.playing);
  if(Object.hasOwn(values,'selectedDistrict')&&state.selectedDistrict!==values.selectedDistrict){state.selectedDistrict=values.selectedDistrict;dirty=true;}
  if(Object.hasOwn(values,'transfers'))state.transfers=Array.isArray(values.transfers)?values.transfers.filter(m=>districtStations.some(d=>d.id===m.from)&&districtStations.some(d=>d.id===m.to)&&m.to!==m.from&&Number.isFinite(m.at)&&Number.isFinite(m.eta)&&m.eta>m.at):[];
  if(Object.hasOwn(values,'onSelectDistrict'))onSelectDistrict=typeof values.onSelectDistrict==='function'?values.onSelectDistrict:null;
  if(Object.hasOwn(values,'districts')){
    const input=values.districts;
    const next=Array.isArray(input)?districtStations.flatMap(station=>{
      const row=input.find(d=>d?.id===station.id);if(!row)return [];
      const count=v=>Math.max(0,Math.floor(Number(v)||0));
      return [{...station,queue:count(row.queue),teams:count(row.teams),flood:unit(row.flood),transit:count(row.transit)}];
    }):null;
    const key=next?next.map(d=>[d.id,d.queue,d.teams,d.flood,d.transit].join(':')).join('|'):'';
    if(key!==districtsKey||Boolean(next)!==Boolean(state.districts)){state.districts=next;districtsKey=key;dirty=true;}
  }
 }
 function metrics(){const p=state.progress;return {flood:state.flood??(.08+.79*Math.sin(p*Math.PI*.83)), queue:state.queue??(.1+.72*Math.sin(p*Math.PI*.83)), response:state.response??p};}
 function resize(){const r=canvas.getBoundingClientRect();const nextW=Math.round(r.width||canvas.clientWidth),nextH=Math.round(r.height||canvas.clientHeight);
  if(nextW<2||nextH<2)return;const ratio=Math.min(win.devicePixelRatio||1,2);if(w===nextW&&h===nextH&&dpr===ratio)return;
  w=nextW;h=nextH;dpr=ratio;canvas.width=surface.width=Math.round(w*ratio);canvas.height=surface.height=Math.round(h*ratio);dirty=true;schedule();}
 function camera(){const sn=Math.sin(yaw),cs=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch);view=[sn*cp,sp,cs*cp];
  // The full district fits at every heading. Zoom and tilt retain the civic quarter as a visual anchor.
  const sceneW=Math.abs(cs)*134+Math.abs(sn)*96, sceneH=(Math.abs(sn)*134+Math.abs(cs)*96)*sp+23*cp;
  scale=Math.min((w-2*Math.max(12,w*.038))/sceneW,(h-2*Math.max(12,h*.06))/sceneH)*zoom;
  const cx=w*.50,cy=h*.50+5.6*scale*cp;
  project=([x,y,z])=>[cx+(x*cs-z*sn)*scale,cy+((x*sn+z*cs)*sp-y*cp)*scale];
 }
 function drawBackground(c){const m=eventState.flood;const g=c.createLinearGradient(0,0,0,h);
  const r=Math.round(18-5*m),gr=Math.round(36-4*m),b=Math.round(43-4*m);skyMid=`rgb(${r},${gr},${b})`;
  skyBottom='#0c2027';g.addColorStop(0,'#233a41');g.addColorStop(.45,skyMid);g.addColorStop(1,skyBottom);c.fillStyle=g;c.fillRect(0,0,w,h);
  const aura=c.createRadialGradient(w*.37,h*.4,0,w*.37,h*.4,Math.max(w,h)*.62);aura.addColorStop(0,'rgba(219,187,126,.16)');aura.addColorStop(1,'rgba(197,175,116,0)');c.fillStyle=aura;c.fillRect(0,0,w,h);
  // Fine survey grid extends behind the tabletop, fading into the edge of the viewport.
  c.lineWidth=.65;c.strokeStyle='rgba(176,204,186,.065)';c.beginPath();
  for(let n=-196;n<=196;n+=12){for(const [a,b] of [[pt(n,-180,-6),pt(n,180,-6)],[pt(-180,n,-6),pt(180,n,-6)]]){const p=project(a),q=project(b);c.moveTo(...p);c.lineTo(...q);}}c.stroke();
  c.save();c.shadowBlur=Math.max(12,scale*5);c.shadowColor='rgba(3,10,15,.80)';polygon(project,c,topFace(1,1,134,96,-4.8),'rgba(10,22,21,.78)');c.restore();
 }
 function lands(c){
  drawGroup(deck,view,project,c);
  for(const z of [-41,-22,22,41]) for(const [left,right] of [[-66.4,-53.4],[-48.65,-29.45],[-24.55,-4.45],[.45,20.55],[25.45,47.55],[52.45,66.4]]){
   const center=(left+right)/2;let terrain=z===41&&center>-24&&center<22?'#718568':(z<0?'#83908a':'#92988a');
   polygon(project,c,topFace(center,z,right-left,z===41||z===-41?13.6:14.6,.02),terrain);
  }
  // Paths and gardens around the hall and emergency station provide spatial anchors.
  polygon(project,c,topFace(-13,-17,20.8,10.4,.03),'#c8c4aa');polygon(project,c,topFace(36,22.9,17.6,11,.03),'#bfc0aa');
  for(const p of ground)polygon(project,c,p.p,p.c);
  for(const [x,z,s,k] of meadow){polygon(project,c,topFace(x,z,s,s*.65,.06),k>.55?'#919f79':'#a9b18a');}
  for(const sign of [-1,1]){
   const bank=x=>river(x)+sign*width(x);band(project,c,x=>bank(x)+sign*.13,x=>bank(x)+sign*1.05,.07,'#b6ae93');
   band(project,c,x=>bank(x)-sign*.23,x=>bank(x)+sign*.12,.09,'#6a7d78');
  }
  const waters=c.createLinearGradient(w*.05,h*.3,w*.84,h*.7);waters.addColorStop(0,'#28576a');waters.addColorStop(.28,'#36787e');waters.addColorStop(.52,'#206877');waters.addColorStop(.78,'#4f8683');waters.addColorStop(1,'#25596a');
  band(project,c,x=>river(x)-width(x),x=>river(x)+width(x),.09,waters);
  for(const sign of [-1,1])band(project,c,x=>river(x)+sign*(width(x)-.8),x=>river(x)+sign*(width(x)-.1),.12,'rgba(189,210,179,.26)');
  for(const [x,z,length,light] of ripples){polygon(project,c,topFace(x,z,length,light>.6?.12:.20,.14),light>.5?'rgba(200,224,205,.34)':'rgba(28,102,112,.19)');}
  for(const [x,z,len,thick] of lampReflections)polygon(project,c,topFace(x,z,len,thick,.13),'rgba(236,191,117,.37)');
  const flood=eventState.flood;
  if(flood>.06) {
   const spill=(x,side)=>{
    let level=flood;
    if(state.districts?.length){
      const sample=pt(x,river(x)+side*width(x));
      let weighted=0,weight=0;
      for(const d of state.districts){
        const dx=d.anchor[0]-sample[0],dz=d.anchor[2]-sample[2];
        const influence=1/(90+dx*dx+1.8*dz*dz);
        weighted+=d.flood*influence;weight+=influence;
      }
      level=.35*flood+.65*weighted/weight;
    }
    return Math.max(0,(level-.06)*(.55+.45*Math.sin(x*.050+side*1.7))*(side>0?11.4:7.8));
   };
   for(const sign of [-1,1]){const origin=x=>river(x)+sign*(width(x)-.4), edge=x=>origin(x)+sign*spill(x,sign);
    band(project,c,origin,edge,.16,`rgba(67,145,155,${.26+flood*.26})`);
    band(project,c,edge,x=>edge(x)-sign*.11,.17,'rgba(179,218,201,.75)');}
  }
  // Projected light pools stay on the pavement beneath the poles as the camera orbits.
  for(const [x,z] of lightPools){
    const p=project(pt(x,z,.07));const pos=project(pt(x+2,z,.07));
    const radius=Math.max(2.5,Math.hypot(pos[0]-p[0],pos[1]-p[1])*1.55);
    const halo=c.createRadialGradient(p[0],p[1],0,p[0],p[1],radius);
    halo.addColorStop(0,'rgba(255,212,139,.32)');halo.addColorStop(.45,'rgba(245,187,100,.16)');halo.addColorStop(1,'rgba(255,214,145,0)');
    c.save();c.translate(p[0],p[1]);c.scale(1,.60);c.translate(-p[0],-p[1]);c.fillStyle=halo;c.fillRect(p[0]-radius,p[1]-radius,radius*2,radius*2);c.restore();
  }
  for(const s of shadows){const dx=s.h*.67,dz=s.h*.30;const a=s.x-s.w/2,b=s.x+s.w/2,m=s.z-s.d/2,n=s.z+s.d/2;
   polygon(project,c,[pt(a,m,.19),pt(b,m,.19),pt(b+dx,m+dz,.19),pt(b+dx,n+dz,.19),pt(a+dx,n+dz,.19),pt(a,n,.19)],'rgba(20,40,47,.25)');}
  const selected=state.districts?.find(d=>d.id===state.selectedDistrict);
  if(selected){
    const [cx,,cz]=selected.anchor;
    const ring=Array.from({length:48},(_,i)=>pt(cx+Math.cos(i*TAU/48)*9.3,cz+Math.sin(i*TAU/48)*8.8,.24));
    polygon(project,c,ring,'rgba(229,184,111,.13)');
    c.strokeStyle='rgba(247,211,145,.72)';c.lineWidth=Math.max(.65,scale*.19);c.stroke();
  }
  // Inclined approach panels put the road surface at bridge-deck height at the abutment.
  for(const bx of [-27,50])for(const sign of [-1,1]) {
   const near=river(bx)+sign*(width(bx)+4),far=near+sign*3.7;
   polygon(project,c,[pt(bx-2.2,far,.16),pt(bx+2.2,far,.16),pt(bx+2.2,near,2.08),pt(bx-2.2,near,2.08)],'#8f998f');
  }
 }
 function featuredObjects(){const launchX=-59+state.progress*102;const out=[waterLaunch(launchX)];
  if(state.districts){
    for(const d of state.districts){
      const [x,z]=d.stage;
      for(let i=0;i<Math.min(d.teams,8);i++){
        const sx=x+(i%4-1.5)*1.23,sz=z+Math.floor(i/4)*1.21;
        out.push(person(sx,sz,'#e9b56b'));
      }
    }
    return out;
  }
  const q=Math.round(eventState.queue*25);for(let i=0;i<q;i++){
  const x=30.6+(i%10)*1.03,z=27.1+Math.floor(i/10)*.87;out.push(person(x,z,['#c09065','#759491','#b9ad86','#9a7565','#6b818c'][i%5]));}
  const count=Math.min(5,Math.ceil(eventState.response*5));for(let j=0;j<count;j++){
   const destinations=[[-36,24.7,true],[-27,14,false],[-27,river(-27)+1.8,false],[23,13,false],[50,river(50)-2,false]];
   const [x,z,d]=destinations[j];out.push(car(x,z,d,'#d2bd93',true,j===2||j===4?2.12:.09));}
  return out;
 }
 function build(){if(!w||!h)return;eventState=metrics();camera();buffer.setTransform(dpr,0,0,dpr,0,0);drawBackground(buffer);lands(buffer);
  const items=district.concat(featuredObjects()).sort((a,b)=>(a.x-b.x)*view[0]+(a.z-b.z)*view[2]);
  for(const g of items)drawGroup(g,view,project,buffer);dirty=false;}
 function pulse(c,x,z,elevation,t,color){const pos=project(pt(x,z,elevation));const rad=Math.max(3.9,scale*1.00),wave=reduced?.matches?0:.5+.5*Math.sin(t);
  c.beginPath();c.arc(pos[0],pos[1],rad+2+3*wave,0,TAU);c.strokeStyle=color;c.globalAlpha=.23-.10*wave;c.lineWidth=1.45;c.stroke();c.globalAlpha=1;
  c.beginPath();c.arc(pos[0],pos[1],rad,0,TAU);c.fillStyle=color;c.fill();c.beginPath();c.arc(pos[0],pos[1],rad*.37,0,TAU);c.fillStyle='#243c3c';c.fill();}
 function renderStations(c){
  markerHits=[];
  const compact=w<530;
  const margin=7,topMargin=h<200?7:38,bottomMargin=h<200?12:53;
  const baseHeight=compact?30:37;
  const items=[...state.districts].sort((a,b)=>Number(b.id===state.selectedDistrict)-Number(a.id===state.selectedDistrict));
  for(const d of items){
    const [px,py]=project(d.anchor);
    if(px<-12||px>w+12||py<-12||py>h+12)continue;
    const selected=d.id===state.selectedDistrict, color=selected?'#f6cc8d':'#9ad6cb';
    const details=d.queue+' open · '+d.teams+' '+(d.teams===1?'team':'teams');
    const height=baseHeight+(d.transit?(compact?12:14):0);
    c.font=compact?'10px sans-serif':'11px sans-serif';
    const width=Math.min(w-2*margin,Math.ceil(Math.max(c.measureText(details).width+16,c.measureText(d.name).width+18,compact?65:91)));
    const [dx,dy]=d.offset, midX=px+dx*(compact?25:38),midY=py+dy*(compact?29:36);
    let bx=clamp(midX-width/2,margin,w-width-margin);
    let by=clamp(midY-height/2,topMargin,h-bottomMargin-height);
    // Candidate positions keep every landmark selectable even in a near edge-on view.
    const candidates=[[bx,by]];
    for(let n=1;n<=3;n++)for(const sign of [-1,1]){
      candidates.push([bx,clamp(by+sign*(height+5)*n,topMargin,h-bottomMargin-height)]);
      candidates.push([clamp(bx+sign*(width+5)*n,margin,w-width-margin),by]);
    }
    const fits=([x,y])=>!markerHits.some(b=>x<b.x+b.w+3&&x+width>b.x-3&&y<b.y+b.h+3&&y+height>b.y-3);
    const place=candidates.find(fits);if(place)[bx,by]=place;
    const tx=clamp(px,bx,bx+width),ty=clamp(py,by,by+height);
    c.lineWidth=selected?1.6:1;c.strokeStyle=color;c.beginPath();c.moveTo(px,py);c.lineTo(tx,ty);c.stroke();
    c.fillStyle=color;c.beginPath();c.arc(px,py,selected?3.7:2.3,0,TAU);c.fill();
    c.fillStyle=selected?'rgba(39,42,35,.96)':'rgba(15,38,44,.93)';
    c.beginPath();if(c.roundRect)c.roundRect(bx,by,width,height,4);else c.rect(bx,by,width,height);
    c.fill();c.strokeStyle=selected?'#edc183':'rgba(150,190,179,.68)';c.stroke();
    c.textBaseline='middle';c.font='600 '+(compact?10:12)+'px sans-serif';c.fillStyle=selected?'#ffe0a9':'#e9f3e9';
    c.fillText(d.name,bx+7,by+(compact?9:11.5));
    c.fillStyle='#d5e0d6';c.font=(compact?9:10)+'px sans-serif';c.fillText(details,bx+7,by+(compact?21:26.5));
    if(d.transit){c.fillStyle='#f7d199';c.fillText(d.transit+' en route',bx+7,by+height-(compact?7:8));}
    markerHits.push({id:d.id,x:bx,y:by,w:width,h:height,px,py});
  }
 }
 // Route geometry is schematic. Elapsed time and arrival come from the operations model.
 function transferPaths(c){
   if(!state.transfers.length)return;
   const [west,east]=[-27,50];
   const path=(a,b)=>{
     const points=[a.stage];
     if(a.id==='civic'||b.id==='civic'){
       const crossing=a.id==='market'||b.id==='market'?east:west;
       const northFirst=a.id==='civic';
       const fromStreet=northFirst?-32:31,toStreet=northFirst?31:-32;
       points.push([a.stage[0],fromStreet],[crossing,fromStreet],[crossing,toStreet],[b.stage[0],toStreet]);
     }else points.push([a.stage[0],31],[b.stage[0],31]);
     points.push(b.stage);
     return points.map(([x,z])=>project(pt(x,z,1.1)));
   };
   c.save();c.lineJoin='round';c.lineCap='round';
   for(const move of state.transfers){
     const a=districtStations.find(d=>d.id===move.from),b=districtStations.find(d=>d.id===move.to);
     const pts=path(a,b), lengths=pts.slice(1).map((p,i)=>Math.hypot(p[0]-pts[i][0],p[1]-pts[i][1]));
     let remaining=unit((state.progress*60-move.at)/(move.eta-move.at))*lengths.reduce((v,l)=>v+l,0);
     let token=pts.at(-1);
     for(let i=0;i<lengths.length;i++){
       if(remaining<=lengths[i]&&lengths[i]>.01){
         const mix=remaining/lengths[i],p=pts[i],q=pts[i+1];
         token=[p[0]+(q[0]-p[0])*mix,p[1]+(q[1]-p[1])*mix];break;
       }
       remaining-=lengths[i];
     }
     c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));
     c.setLineDash([]);c.strokeStyle='rgba(10,33,38,.82)';c.lineWidth=3.6;c.stroke();
     c.setLineDash([4,3]);c.strokeStyle='#edc586';c.lineWidth=1.6;c.stroke();c.setLineDash([]);
     const [x,y]=token,rad=4.8;c.beginPath();c.moveTo(x,y-rad);c.lineTo(x+rad,y);c.lineTo(x,y+rad);c.lineTo(x-rad,y);c.closePath();
     c.fillStyle='#ffe4a7';c.fill();c.strokeStyle='#354f50';c.lineWidth=1.3;c.stroke();
   }
   c.restore();
 }
 function overlays(c){
  if(state.districts){transferPaths(c);renderStations(c);return;}
  markerHits=[];
  const f=eventState.flood,q=eventState.queue,r=eventState.response,t=clock*.0017;
  if(f>.25)pulse(c,-27,river(-27),6.7,t,'#efb46e');if(q>.18)pulse(c,35.5,26.5,2.2,t+.8,'#edcf83');if(r>.08)pulse(c,-39.8,19.3,6.1,t+1.7,'#b9e8ce');
  const marks=[{label:'Civic hall',point:pt(-13,-22,14.5),tone:'#e3dcb8',priority:1},{label:'Service center',point:pt(36,22,7.95),tone:'#e9c986',priority:2}];
  if(w>=615)marks.push({label:'West bridge',point:pt(-27,river(-27),6.7),tone:f>.25?'#efb46e':'#b4d3c2',priority:3});
  if(w<380)marks.splice(1);
  const boxes=[];c.font=`500 ${w>580?11:10}px system-ui, sans-serif`;c.textBaseline='middle';
  for(const m of marks){const [sx,sy]=project(m.point);const tw=c.measureText(m.label).width+17;const bh=w>580?22:18;
   let bx=clamp(sx-tw*.5,4,w-tw-4),by=sy-17-bh; if(by<5||by>h-2||sx<0||sx>w)continue;
   if(boxes.some(b=>bx<b[0]+b[2]+4&&bx+tw>b[0]-4&&by<b[1]+b[3]+4&&by+bh>b[1]-4))continue;boxes.push([bx,by,tw,bh]);
   c.beginPath();c.moveTo(sx,sy-1);c.lineTo(sx,by+bh);c.lineWidth=1;c.strokeStyle=m.tone;c.stroke();
   c.beginPath();c.roundRect?.(bx,by,tw,bh,3);if(!c.roundRect)c.rect(bx,by,tw,bh);c.fillStyle='rgba(29,48,47,.94)';c.fill();c.strokeStyle='rgba(213,216,185,.30)';c.lineWidth=.75;c.stroke();c.fillStyle=m.tone;c.fillText(m.label,bx+8.5,by+bh*.51);}
 }
 function draw(now){frame=0;if(ended||!w||!h)return;
  const animate=state.playing&&!reduced?.matches&&!owner.hidden;
  if(animate&&lastTime)clock+=Math.min(96,now-lastTime);lastTime=now;
  if(dirty||!animate||now-lastRender>=40){if(dirty)build();ctx.setTransform(1,0,0,1,0,0);ctx.drawImage(surface,0,0);ctx.setTransform(dpr,0,0,dpr,0,0);overlays(ctx);lastRender=now;}
  if(animate)schedule();}
 function schedule(){if(!ended&&!frame&&!owner.hidden)frame=win.requestAnimationFrame(draw);}
 function update(values){const previous=metrics(),p=state.playing, previousTime=state.progress;set(values);const next=metrics();
  if(previousTime!==state.progress||!eventState||['flood','queue','response'].some(key=>next[key]!==previous[key]))dirty=true;
  if(p!==state.playing)lastTime=0;schedule();}
 function rotate(degrees){yaw+=Number(degrees)*RAD||0;dirty=true;schedule();}
 function zoomBy(factor){const val=Number(factor);if(Number.isFinite(val)&&val>0){zoom=clamp(zoom*val,.65,2.25);dirty=true;schedule();}}
 function resetView(){yaw=-34*RAD;pitch=35*RAD;zoom=1;dirty=true;schedule();}
 function hitMarker(e){
  const r=canvas.getBoundingClientRect();
  const x=(e.clientX-(r.left||0))*w/(r.width||w),y=(e.clientY-(r.top||0))*h/(r.height||h);
  return markerHits.find(b=>(x>=b.x-2&&x<=b.x+b.w+2&&y>=b.y-2&&y<=b.y+b.h+2)||Math.hypot(x-b.px,y-b.py)<8);
 }
 function down(e){if(e.pointerType==='mouse'&&e.button!==0)return;
  tap=!pointers.size&&onSelectDistrict?{id:e.pointerId,x:e.clientX,y:e.clientY,target:hitMarker(e)?.id}:null;
  pointers.set(e.pointerId,[e.clientX,e.clientY]);canvas.setPointerCapture?.(e.pointerId);canvas.style.cursor='grabbing';
  if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a[0]-b[0],a[1]-b[1]);}}
 function move(e){const prev=pointers.get(e.pointerId);
  if(!prev){if(!pointers.size)canvas.style.cursor=onSelectDistrict&&hitMarker(e)?'pointer':'grab';return;}
  if(tap&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)>6)tap=null;
  pointers.set(e.pointerId,[e.clientX,e.clientY]);
  if(pointers.size===1){yaw-=(e.clientX-prev[0])*.007;pitch=clamp(pitch+(e.clientY-prev[1])*.0035,22*RAD,63*RAD);dirty=true;schedule();}
  else if(pointers.size===2){const [a,b]=[...pointers.values()],dist=Math.hypot(a[0]-b[0],a[1]-b[1]);if(pinch>3&&dist>3)zoomBy(dist/pinch);pinch=dist;}}
 function up(e){
  const select=tap?.id===e.pointerId&&tap.target&&e.type==='pointerup'&&Math.hypot(e.clientX-tap.x,e.clientY-tap.y)<=6&&hitMarker(e)?.id===tap.target;
  const target=tap?.target;tap=null;pointers.delete(e.pointerId);
  if(pointers.size<2)pinch=0;if(!pointers.size)canvas.style.cursor='grab';
  if(select)onSelectDistrict?.(target);
 }
 function wheel(e){if(e.ctrlKey||e.metaKey)return;e.preventDefault();zoomBy(Math.exp(-clamp(e.deltaY,-150,150)*.0016));}
 function visibility(){lastTime=0;if(!owner.hidden)schedule();}
 const listeners=[[canvas,'pointerdown',down],[canvas,'pointermove',move],[canvas,'pointerup',up],[canvas,'pointercancel',up],[canvas,'lostpointercapture',up],[canvas,'wheel',wheel,{passive:false}],[owner,'visibilitychange',visibility],[win,'resize',resize]];
 for(const [target,type,handler,opts] of listeners)target.addEventListener(type,handler,opts);reduced?.addEventListener?.('change',schedule);
 const observer=win.ResizeObserver?new win.ResizeObserver(resize):null;observer?.observe(canvas);set(initial);resize();schedule();
 return { update,rotate,zoomBy,resetView,destroy(){if(ended)return;ended=true;win.cancelAnimationFrame(frame);observer?.disconnect();
  for(const [target,type,handler,opts] of listeners)target.removeEventListener(type,handler,opts);reduced?.removeEventListener?.('change',schedule);pointers.clear();canvas.style.touchAction=previousTouch;canvas.style.cursor=previousCursor;surface.width=surface.height=1;}};
}
