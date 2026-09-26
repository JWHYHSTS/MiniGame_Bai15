/* Simplified elastic 2D frame model for a game. Not an engineering design tool.
   Road and alloy members resist axial load + bending. Cables are tension-only.
   Units are internal game units. No required triangle or template matching. */
const Bridge = (()=>{
 const materials={road:{price:.32,EA:180000,EI:1200000,axial:1300,moment:12000,weight:.012,max:180},steel:{price:.20,EA:500000,EI:6500000,axial:2800,moment:25000,weight:.008,max:340},cable:{price:.11,EA:240000,EI:0,axial:1900,moment:Infinity,weight:.002,max:540}};
 const terrains=[
 {label:'Vực thẳng · Hai bờ',start:[280,320],end:[920,320],anchors:[[280,460],[920,460]],obstacles:[],platforms:[],load:75,convoy:1,tip:'Hai bờ cùng cao. Có thể dùng khung phía dưới, giàn phía trên hoặc phối hợp vật liệu.',route:[[280,320],[440,320],[600,320],[760,320],[920,320]]},
 {label:'Đảo giữa · Hai nhịp độc lập',start:[160,300],end:[1040,300],anchors:[[540,300],[660,300],[540,450],[660,450]],obstacles:[],platforms:[{x:540,y:300,w:120}],load:85,convoy:1,tip:'Đảo giữa là điểm tựa cố định. Tận dụng đoạn đường có sẵn trên đảo để giảm vật liệu.',route:[[160,300],[280,300],[410,300],[540,300],[660,300],[790,300],[920,300],[1040,300]]},
 {label:'Bậc cao · Cầu lên dốc',start:[200,410],end:[1000,230],anchors:[[200,520],[1000,360]],obstacles:[],platforms:[],load:80,convoy:1,tip:'Hai bờ lệch cao 180 đơn vị. Chia độ dốc thành các đoạn êm để xe leo được.',route:[[200,410],[360,374],[520,338],[680,302],[840,266],[1000,230]]},
 {label:'Trạm treo · Neo trên cao',start:[180,350],end:[1020,350],anchors:[[360,140],[840,140]],obstacles:[],platforms:[],load:100,convoy:1,tip:'Cáp chịu kéo: treo mặt cầu lên các neo cao. Cáp đặt dưới mặt cầu thường không đỡ được lực nén.',route:[[180,350],[320,350],[460,350],[600,350],[740,350],[880,350],[1020,350]]},
 {label:'Mỏm đá · Đường vòng trên cao',start:[180,390],end:[1020,390],anchors:[[420,470],[780,470],[600,160]],obstacles:[{x:520,y:340,w:160,h:230}],platforms:[],load:90,convoy:1,tip:'Không đặt thanh xuyên khối đá. Hãy nâng mặt đường vượt đỉnh đá, rồi chống hoặc treo cầu.',route:[[180,390],[320,350],[460,290],[600,290],[740,290],[880,350],[1020,390]]},
 {label:'Tiếp tế · Ba xe đồng thời',start:[160,400],end:[1040,280],anchors:[[400,480],[800,440],[600,140]],obstacles:[{x:550,y:470,w:100,h:100}],platforms:[],load:90,convoy:3,tip:'Ba xe tạo tải ở nhiều vị trí cùng lúc. Phối hợp neo thấp, neo cao và đường dốc để tối ưu.',route:[[160,400],[300,380],[440,360],[580,340],[720,320],[880,300],[1040,280]]}
 ];
 function setup(i){const t=terrains[i];return [t.start,t.end,...t.anchors].map((p,j)=>({x:p[0],y:p[1],fixed:true,label:j===0?'S':j===1?'F':'N'+(j-1)}));}
 const length=(a,b)=>Math.hypot(b.x-a.x,b.y-a.y);
 const cost=(nodes,edges)=>edges.reduce((sum,e)=>sum+(e.free?0:length(nodes[e.a],nodes[e.b])*materials[e.type].price),0);
 function inside(p,r,pad=0){return p.x>r.x-pad&&p.x<r.x+r.w+pad&&p.y>r.y-pad&&p.y<r.y+r.h+pad;}
 function blocked(a,b,map){const n=Math.ceil(length(a,b)/5);for(let i=1;i<n;i++){const p={x:a.x+(b.x-a.x)*i/n,y:a.y+(b.y-a.y)*i/n};if(map.obstacles.some(r=>inside(p,r,3)))return true;}return false;}
 function validPoint(p,map){return p.x>=map.start[0]&&p.x<=map.end[0]&&p.y>=95&&p.y<=550&&!map.obstacles.some(r=>inside(p,r,8));}
 function freeEdges(i,nodes){return terrains[i].platforms.map(p=>({a:nodes.findIndex(n=>n.x===p.x&&n.y===p.y),b:nodes.findIndex(n=>n.x===p.x+p.w&&n.y===p.y),type:'road',free:true}));}
 function route(nodes,edges,map){const adj=nodes.map(()=>[]);edges.forEach((e,j)=>{if(e.type!=='road')return;const a=nodes[e.a],b=nodes[e.b];if(Math.abs(a.y-b.y)>Math.abs(a.x-b.x)*.72||blocked(a,b,map))return; // driveable slopes only
 if(a.x<b.x)adj[e.a].push({to:e.b,e:j,d:length(a,b)});else if(b.x<a.x)adj[e.b].push({to:e.a,e:j,d:length(a,b)});
 });const dist=nodes.map(()=>Infinity),prev=[];dist[0]=0;[...nodes.keys()].sort((a,b)=>nodes[a].x-nodes[b].x).forEach(a=>{for(const v of adj[a])if(dist[a]+v.d<dist[v.to]){dist[v.to]=dist[a]+v.d;prev[v.to]={a,e:v.e};}});if(!Number.isFinite(dist[1]))return null;const seg=[];let curr=1;while(curr!==0){const p=prev[curr];seg.unshift({a:p.a,b:curr,edge:p.e,len:length(nodes[p.a],nodes[curr])});curr=p.a;}let total=0;seg.forEach(s=>{s.offset=total;total+=s.len;});return{segments:seg,total};}
 function locate(path,d){for(const s of path.segments){if(d<=s.offset+s.len)return{...s,u:Math.max(0,(d-s.offset)/s.len)};}return{...path.segments.at(-1),u:1};}
 // Matrix assembly in global coordinates for a planar frame element.
 function element(a,b,mat,cableActive=true,boost=1){const L=length(a,b),c=(b.x-a.x)/L,s=(b.y-a.y)/L,EA=mat.EA*boost*(cableActive?1:0),EI=mat.EI*boost;
 const k=EA/L,v=12*EI/L**3,w=6*EI/L**2,r=4*EI/L,z=2*EI/L;
 const local=[[k,0,0,-k,0,0],[0,v,w,0,-v,w],[0,w,r,0,-w,z],[-k,0,0,k,0,0],[0,-v,-w,0,v,-w],[0,w,z,0,-w,r]];
 const T=[[c,s,0,0,0,0],[-s,c,0,0,0,0],[0,0,1,0,0,0],[0,0,0,c,s,0],[0,0,0,-s,c,0],[0,0,0,0,0,1]],global=Array.from({length:6},()=>new Float64Array(6));
 for(let i=0;i<6;i++)for(let j=0;j<6;j++)for(let u=0;u<6;u++)for(let v=0;v<6;v++)global[i][j]+=T[u][i]*local[u][v]*T[v][j];
 return{L,c,s,local,T,global};}
 function solve(A,b){const n=b.length;for(let k=0;k<n;k++){let p=k;for(let i=k+1;i<n;i++)if(Math.abs(A[i][k])>Math.abs(A[p][k]))p=i;if(Math.abs(A[p][k])<1e-12)return null;if(p!==k){[A[k],A[p]]=[A[p],A[k]];[b[k],b[p]]=[b[p],b[k]];}for(let i=k+1;i<n;i++){const f=A[i][k]/A[k][k];if(!f)continue;A[i][k]=0;for(let j=k+1;j<n;j++)A[i][j]-=f*A[k][j];b[i]-=f*b[k];}}const x=new Float64Array(n);for(let i=n-1;i>=0;i--){let v=b[i];for(let j=i+1;j<n;j++)v-=A[i][j]*x[j];x[i]=v/A[i][i];}return x;}
 function simulate(nodes,edges,map,path,d,boost=false){const nd=nodes.length*3,active=edges.map(()=>true);let u=new Float64Array(nd),elements=[];const free=[];nodes.forEach((n,i)=>{if(!n.fixed)for(let k=0;k<3;k++)free.push(3*i+k);});
 for(let iter=0;iter<8;iter++){
 const K=Array.from({length:nd},()=>new Float64Array(nd)),F=new Float64Array(nd);elements=edges.map((e,j)=>{const el=element(nodes[e.a],nodes[e.b],materials[e.type],active[j],boost?1.3:1),ix=[e.a*3,e.a*3+1,e.a*3+2,e.b*3,e.b*3+1,e.b*3+2];for(let a=0;a<6;a++)for(let b=0;b<6;b++)K[ix[a]][ix[b]]+=el.global[a][b];const weight=materials[e.type].weight*el.L;F[e.a*3+1]+=weight/2;F[e.b*3+1]+=weight/2;return{...el,ix};});
 for(let car=0;car<map.convoy;car++){const p=d-car*110;if(p<0||p>path.total)continue;const q=locate(path,p);F[q.a*3+1]+=map.load*(1-q.u);F[q.b*3+1]+=map.load*q.u; // Additional interior bending sag is evaluated below.
 }
 const A=free.map(i=>Float64Array.from(free,j=>K[i][j]+(i===j?1e-7:0))),f=Float64Array.from(free,i=>F[i]),res=solve(A,f);if(!res)return{ok:false,reason:'Kết cấu mất ổn định. Hãy nối khung với các neo cố định.',displacements:u,stress:[]};u=new Float64Array(nd);free.forEach((j,k)=>u[j]=res[k]);let changed=false;
 edges.forEach((e,j)=>{if(e.type!=='cable')return;const el=elements[j],extension=(u[e.b*3]-u[e.a*3])*el.c+(u[e.b*3+1]-u[e.a*3+1])*el.s;const on=extension>=-1e-6;if(on!==active[j]){active[j]=on;changed=true;}});if(!changed)break;
 }
 const stress=edges.map((e,j)=>{const el=elements[j],v=el.T.map(row=>row.reduce((s,a,k)=>s+a*u[el.ix[k]],0)),forces=el.local.map(row=>row.reduce((s,a,k)=>s+a*v[k],0));const mat=materials[e.type];return Math.max(Math.abs(forces[0])/mat.axial,Math.abs(forces[2])/mat.moment,Math.abs(forces[5])/mat.moment);});
 let maxDisp=0,critical=-1;nodes.forEach((n,i)=>{const z=Math.hypot(u[i*3],u[i*3+1]);if(z>maxDisp){maxDisp=z;critical=i;}});let maxStress=Math.max(0,...stress),badEdge=stress.indexOf(maxStress),reason='';
 if(maxDisp>32)reason=`Cầu võng quá mức gần ${nodes[critical]?.label||'điểm nối'}. Thử thêm điểm tựa, giàn đỡ hoặc cáp treo.`;
 else if(maxStress>1)reason=`Một thanh ${edges[badEdge]?.type==='cable'?'cáp':edges[badEdge]?.type==='steel'?'hợp kim':'mặt đường'} vượt tải. Hãy phân tán lực hoặc đổi kết cấu.`;
 // Check road slope + local beam sag where each vehicle is actually located.
 const cars=[];for(let car=0;car<map.convoy;car++){const p=d-car*110;if(p<0){cars.push({x:map.start[0]+p,y:map.start[1],angle:0});continue;}if(p>path.total){cars.push({x:map.end[0]+p-path.total,y:map.end[1],angle:0});continue;}const q=locate(path,p),a=nodes[q.a],b=nodes[q.b],ax=a.x+u[q.a*3],ay=a.y+u[q.a*3+1],bx=b.x+u[q.b*3],by=b.y+u[q.b*3+1];const localSag=map.load*q.len**3/(192*materials.road.EI)*(16*q.u*q.u*(1-q.u)*(1-q.u));const x=ax+(bx-ax)*q.u,y=ay+(by-ay)*q.u+localSag,angle=Math.atan2(by-ay,bx-ax);cars.push({x,y,angle});if(!reason&&Math.abs(angle)>.72)reason='Mặt cầu đang quá dốc sau khi chịu tải. Hãy điều chỉnh đường xe chạy.';if(!reason&&map.obstacles.some(r=>inside({x,y},r,5)||inside({x,y:y-18},r,7)))reason='Xe chạm khối đá. Cần nâng hoặc đổi hướng mặt đường.';}
 return{ok:!reason,reason,displacements:u,stress,maxDisp,maxStress,badEdge,critical,cars};}
 function award(spent,math=400){return{build:Math.max(0,Math.round(1000*(1-spent/820))),total:math+Math.max(0,Math.round(1000*(1-spent/820)))};}
 function example(i){const map=terrains[i],nodes=setup(i),edges=freeEdges(i,nodes);const node=(x,y)=>{let j=nodes.findIndex(n=>Math.hypot(n.x-x,n.y-y)<1);if(j<0){j=nodes.length;nodes.push({x,y,fixed:false,label:'P'+(j-setup(i).length+1)});}return j;};const add=(a,b,type)=>{if(a===b||edges.some(e=>(e.a===a&&e.b===b)||(e.a===b&&e.b===a)))return;edges.push({a,b,type});};const road=map.route.map(p=>node(...p));for(let j=0;j<road.length-1;j++)add(road[j],road[j+1],'road');
 if(i===1){add(road[2],4,'steel');add(road[5],5,'steel');}
 else if(i===3){for(const a of road){if(nodes[a].fixed)continue;add(a,nodes[a].x<600?2:3,'cable');}add(road[3],2,'cable');add(road[3],3,'cable');}
 else if(i===4||i===5){const top=nodes.findIndex(n=>n.fixed&&n.y<200);for(const a of road){if(nodes[a].fixed)continue;if(length(nodes[a],nodes[top])<535&&!blocked(nodes[a],nodes[top],map))add(a,top,'cable');
 for(let j=2;j<nodes.length;j++)if(nodes[j].fixed&&nodes[j].y>300&&length(nodes[a],nodes[j])<330&&!blocked(nodes[a],nodes[j],map))add(a,j,'steel');
 }}else{ // Under-deck continuous truss, with lower bank anchors when available.
 const lower=road.map(a=>node(nodes[a].x,nodes[a].y+100));for(let j=0;j<road.length-1;j++){if(nodes[road[j]].fixed&&nodes[road[j+1]].fixed)continue;add(lower[j],lower[j+1],'steel');add(road[j],lower[j+1],'steel');add(road[j+1],lower[j+1],'steel');add(road[j],lower[j],'steel');}for(const a of lower)for(let b=0;b<setup(i).length;b++)if(length(nodes[a],nodes[b])<170)add(a,b,'steel');}
 return{nodes,edges};}
 return{materials,terrains,setup,length,cost,inside,blocked,validPoint,freeEdges,route,locate,simulate,award,example};
})();
if(typeof module!=='undefined')module.exports=Bridge;
