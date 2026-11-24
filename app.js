// INDUSTRYWISE front-end demo. Sensor values below are synthetic until connected to real hardware/API.
const toastEl=document.getElementById('toast');
function toast(msg){toastEl.textContent=msg;toastEl.classList.add('show');setTimeout(()=>toastEl.classList.remove('show'),2600)}
document.getElementById('scheduleBtn').addEventListener('click',()=>toast('Inspection added to the demo maintenance queue.'));
document.getElementById('viewAllBtn').addEventListener('click',()=>toast('Showing all available demo events.'));
document.getElementById('exportBtn').addEventListener('click',()=>{const report={project:'INDUSTRYWISE',generatedAt:new Date().toISOString(),notice:'Synthetic demonstration telemetry',fleetHealth:94.8,activeMachines:'12/14',anomalies:3,assets:[{id:'M-04',health:96},{id:'P-02',health:78},{id:'R-01',health:99}]};const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));a.download='industrywise-demo-report.json';a.click();URL.revokeObjectURL(a.href);toast('Demo report exported.')});
document.querySelectorAll('.machine-chip').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.machine-chip').forEach(x=>x.classList.remove('selected'));b.classList.add('selected');const name=b.dataset.machine;const tip=document.getElementById('machineTooltip');tip.style.display='block';tip.innerHTML=name+'<span>ASSET SELECTED · DEMO DATA</span>';toast(name+' selected in digital twin.')}));
document.querySelectorAll('.view-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.view-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');if(window.setSceneView)window.setSceneView(b.dataset.view)}));
const canvas=document.getElementById('telemetryChart'),ctx=canvas.getContext('2d');
function drawChart(){const dpr=window.devicePixelRatio||1,w=canvas.clientWidth,h=120;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);for(let y=10;y<h;y+=27){ctx.strokeStyle='#20323a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke()}function line(color,base,amp,phase){ctx.beginPath();for(let x=0;x<w;x++){const v=base+Math.sin(x*.035+phase)*amp+Math.sin(x*.11+phase)*amp*.22+(Math.random()-.5)*2.4;if(x===0)ctx.moveTo(x,v);else ctx.lineTo(x,v)}ctx.strokeStyle=color;ctx.lineWidth=1.7;ctx.stroke()}line('#36d6c2',55,13,1);line('#ffbd59',29,8,2.4)}
drawChart();window.addEventListener('resize',drawChart);
let vib=4.2,temp=68.4;setInterval(()=>{vib=Math.max(3.5,Math.min(5.1,vib+(Math.random()-.5)*.12));temp=Math.max(66,Math.min(72,temp+(Math.random()-.5)*.18));document.getElementById('vibrationValue').innerHTML=vib.toFixed(1)+' <i>mm/s</i>';document.getElementById('temperatureValue').innerHTML=temp.toFixed(1)+' <i>°C</i>';drawChart()},3000);
// Three.js digital twin
(function initScene(){const host=document.getElementById('scene3d');if(!window.THREE){host.innerHTML='<div style="padding:30px;color:#9bb">Three.js could not load. Check your internet connection.</div>';return}
const scene=new THREE.Scene();scene.fog=new THREE.Fog(0x0c171d,12,28);const camera=new THREE.PerspectiveCamera(37,host.clientWidth/host.clientHeight,.1,100);camera.position.set(7,6,9);const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(host.clientWidth,host.clientHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;host.appendChild(renderer.domElement);
scene.add(new THREE.HemisphereLight(0xa4e8e1,0x17222a,2));const key=new THREE.DirectionalLight(0x9cefe1,2.2);key.position.set(5,9,6);scene.add(key);const fill=new THREE.PointLight(0x24bda9,18,15);fill.position.set(-5,3,-3);scene.add(fill);
const mat=(c,m=0.55,r=.35)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r});
const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,14),mat(0x13242a,.35,.8));floor.rotation.x=-Math.PI/2;floor.position.y=-.16;scene.add(floor);
const grid=new THREE.GridHelper(20,30,0x28524f,0x1b343a);grid.position.y=-.145;scene.add(grid);
function box(x,y,z,sx,sy,sz,material){const o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),material);o.position.set(x,y,z);scene.add(o);return o}
const steel=mat(0x526b72),dark=mat(0x17272d),cyan=mat(0x27cbb5,.65,.25),yellow=mat(0xb9823b),rubber=mat(0x101719,.1,.8);
function cylinder(x,y,z,rad,len,material,rot){const o=new THREE.Mesh(new THREE.CylinderGeometry(rad,rad,len,32),material);o.position.set(x,y,z);if(rot)o.rotation.z=rot;scene.add(o);return o}
const belt=box(0,.12,1.6,6,.18,1.05,dark);for(let i=0;i<2;i++){cylinder(-2.55,.27,1.6,.19,1.1,steel,Math.PI/2);cylinder(2.55,.27,1.6,.19,1.1,steel,Math.PI/2)}
for(let i=0;i<8;i++){const roller=cylinder(-2.2+i*.63,.27,1.6,.09,1.05,steel,Math.PI/2)}
for(let i=0;i<5;i++){const crate=box(-1.8+i*.86,.47,1.6,.45,.48,.45,mat(i===3?0x98723c:0x315b60));}
const motorGroup=new THREE.Group();scene.add(motorGroup);motorGroup.position.set(-1.9,.65,-1.1);
const motorBody=new THREE.Mesh(new THREE.CylinderGeometry(.57,.57,1.45,48),steel);motorBody.rotation.z=Math.PI/2;motorGroup.add(motorBody);
const motorCap=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,.16,48),dark);motorCap.rotation.z=Math.PI/2;motorCap.position.x=.78;motorGroup.add(motorCap);
const rotor=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.22,32),cyan);rotor.rotation.z=Math.PI/2;rotor.position.x=.94;motorGroup.add(rotor);
for(let i=0;i<12;i++){const fin=new THREE.Mesh(new THREE.BoxGeometry(.08,.15,1.2),dark);fin.position.set(0,0,0);fin.rotation.x=i*Math.PI/6;motorGroup.add(fin)}
box(-1.9,.18,-1.1,1.8,.22,1.15,dark);
for(let x of [-2.45,-1.35])box(x,.31,-1.1,.15,.35,.75,steel);
// pump housing and pipes
const pump=box(1.55,.62,-1.05,1.15,1.05,1.05,yellow);const pumpTop=cylinder(1.55,1.25,-1.05,.25,.5,steel);pumpTop.rotation.x=Math.PI/2;
const pipe=cylinder(2.35,.75,-1.05,.13,1.05,cyan,Math.PI/2);
for(let x of [-3,3]){box(x,.5,-3,.28,1,.28,steel);box(x,.08,-3,.75,.16,.75,dark)}
// robotic arm
const robot=new THREE.Group();scene.add(robot);robot.position.set(3.3,.05,-2.7);const base=new THREE.Mesh(new THREE.CylinderGeometry(.62,.7,.3,32),dark);base.position.y=.15;robot.add(base);
const joint1=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.8,24),yellow);joint1.position.y=.65;robot.add(joint1);
const arm1=new THREE.Mesh(new THREE.BoxGeometry(.24,1.55,.25),steel);arm1.position.set(.15,1.35,0);arm1.rotation.z=-.38;robot.add(arm1);
const joint2=new THREE.Mesh(new THREE.SphereGeometry(.24,24,24),cyan);joint2.position.set(.43,2.05,0);robot.add(joint2);
const arm2=new THREE.Mesh(new THREE.BoxGeometry(.2,1.05,.2),yellow);arm2.position.set(.68,2.45,0);arm2.rotation.z=.4;robot.add(arm2);
const tip=box(.9,2.85,0,.35,.12,.12,cyan);robot.add(tip);
const beacon=new THREE.Mesh(new THREE.SphereGeometry(.11,20,20),new THREE.MeshBasicMaterial({color:0x5ce0a0}));beacon.position.set(-1.9,1.55,-1.1);scene.add(beacon);
const ring=new THREE.Mesh(new THREE.TorusGeometry(.83,.018,8,80),cyan);ring.position.set(-1.9,.7,-1.1);ring.rotation.x=Math.PI/2;scene.add(ring);
let mode='orbit',drag=false,px=0,py=0,angle=0;host.addEventListener('pointerdown',e=>{drag=true;px=e.clientX;py=e.clientY});window.addEventListener('pointerup',()=>drag=false);window.addEventListener('pointermove',e=>{if(drag){angle+=(e.clientX-px)*.008;camera.position.x=9*Math.sin(angle);camera.position.z=9*Math.cos(angle);camera.position.y=Math.max(2.8,Math.min(9,camera.position.y+(e.clientY-py)*.025));camera.lookAt(0,.6,0);px=e.clientX;py=e.clientY}});
window.setSceneView=(v)=>{mode=v;if(v==='top'){camera.position.set(0,12,.01)}else if(v==='reset'){angle=0;camera.position.set(7,6,9)}else{camera.position.set(7,6,9)}camera.lookAt(0,.6,0)};
function animate(t){requestAnimationFrame(animate);motorGroup.rotation.x=0;rotor.rotation.x=t*.003;robot.rotation.y=Math.sin(t*.0006)*.22;beacon.material.color.setHSL(.42+Math.sin(t*.003)*.015,.65,.58);renderer.render(scene,camera)}animate(0);
new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h)}).observe(host);
})();