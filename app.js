// CONFIG: Set to false for Amazon builds to hide ads
const IS_SAMSUNG_BUILD = true;

// NAVIGATION
function nav(page) {
  document.querySelectorAll('.container > div').forEach(d => d.classList.add('hidden'));
  document.getElementById(page).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if(page==='home') document.querySelectorAll('.nav-item')[0].classList.add('active');
  if(page==='tracker') document.querySelectorAll('.nav-item')[1].classList.add('active');
  if(page==='guide') document.querySelectorAll('.nav-item')[2].classList.add('active');
  window.scrollTo(0,0);
}

// AFFILIATE TRACKING
function trackAffiliate(product) {
  // Replace these with your real Amazon Associate links
  const links = {
    'yoga-mat': 'https://amazon.com/your-affiliate-link',
    'heat-pad': 'https://amazon.com/your-affiliate-link',
    'period-kit': 'https://amazon.com/your-affiliate-link'
  };
  window.open(links[product] || '#', '_blank');
}

// YOGA FLOW
let yogaInterval, yogaSec = 360, yogaRunning = false;
const yogaPoses = [
  {name:"Child's Pose",desc:"Knees wide. Forehead to mat. Arms forward. Breathe into your back. 60s"},
  {name:"Cat-Cow",desc:"On hands/knees. Inhale: drop belly, look up. Exhale: round spine. Slow. 60s"},
  {name:"Reclined Twist",desc:"Lie on back. Drop knees to right, look left. 30s each side. 60s total"},
  {name:"Supine Butterfly",desc:"Soles of feet together. Knees fall out. Hands on belly. 60s"},
  {name:"Legs Up Wall",desc:"Butt close to wall. Legs straight up. Drains pelvis. 60s"},
  {name:"Savasana",desc:"Lie flat. Palms up. Let your body melt. You did it. 60s"}
];
function toggleYoga() {
  if(yogaRunning){clearInterval(yogaInterval);document.getElementById('yogaBtn').textContent='Resume Flow';yogaRunning=false;return}
  yogaRunning = true;
  document.getElementById('yogaBtn').textContent='Pause';
  yogaInterval = setInterval(()=>{
    yogaSec--;
    let min=Math.floor(yogaSec/60),sec=yogaSec%60;
    document.getElementById('yogaTimer').textContent=`${min}:${String(sec).padStart(2,'0')}`;
    document.getElementById('yogaProgress').style.width=`${100-(yogaSec/360)*100}%`;
    let poseIdx=5-Math.floor(yogaSec/60);
    if(yogaPoses[poseIdx]){
      document.getElementById('poseName').textContent=yogaPoses[poseIdx].name;
      document.getElementById('poseDesc').textContent=yogaPoses[poseIdx].desc;
    }
    if(yogaSec<=0){clearInterval(yogaInterval);document.getElementById('yogaBtn').textContent='Flow Complete!';yogaRunning=false;yogaSec=360}
  },1000);
}

// BREATHING
let breatheInterval, breatheRunning = false;
function toggleBreathe() {
  if(breatheRunning){clearInterval(breatheInterval);document.getElementById('breatheBtn').textContent='Resume';breatheRunning=false;return}
  breatheRunning = true;
  document.getElementById('breatheBtn').textContent='Pause';
  const cycle = [
    {text:'Breathe In',dur:4000},{text:'Hold',dur:7000},{text:'Breathe Out Slow',dur:8000}
  ];
  let i=0;
  const runCycle=()=>{
    if(!breatheRunning)return;
    document.getElementById('breatheTimer').textContent=cycle[i].text;
    document.getElementById('breatheInstruction').textContent=i===0?'Through your nose':i===1?'Keep shoulders relaxed':'Through your mouth, like a sigh';
    document.getElementById('breatheProgress').style.width=`${(i+1)/3*100}%`;
    setTimeout(()=>{i=(i+1)%3;runCycle()},cycle[i].dur);
  };
  runCycle();
}

// HEAT TIMER
let heatInterval, heatSec=1200, heatRunning=false;
function toggleHeat() {
  if(heatRunning){clearInterval(heatInterval);document.getElementById('heatBtn').textContent='Resume Heat';heatRunning=false;return}
  heatRunning=true;
  document.getElementById('heatBtn').textContent='Pause Timer';
  heatInterval=setInterval(()=>{
    heatSec--;
    let min=Math.floor(heatSec/60),sec=heatSec%60;
    document.getElementById('heatTimer').textContent=`${min}:${String(sec).padStart(2,'0')}`;
    if(heatSec<=0){clearInterval(heatInterval);alert('Heat time done! Remove pad for 20 mins.');heatRunning=false;heatSec=1200;document.getElementById('heatBtn').textContent='Start 20-Min Heat'}
  },1000);
}

// ACUPRESSURE TIMERS
function startPointTimer(seconds, id) {
  let sec=seconds;
  const el=document.getElementById(id+'Timer');
  el.style.display='block';
  const int=setInterval(()=>{
    sec--;
    el.textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
    if(sec<=0){clearInterval(int);el.textContent='Done! Release slowly.';setTimeout(()=>el.style.display='none',2000)}
  },1000);
}

// TRACKER
let selectedSymptoms=[];
function toggleSymptom(el){
  el.style.background=el.style.background?'': 'var(--pink)';
  el.style.color=el.style.color?'': 'white';
  const sym=el.textContent;
  if(selectedSymptoms.includes(sym))selectedSymptoms=selectedSymptoms.filter(s=>s!==sym);
  else selectedSymptoms.push(sym);
}
function saveLog(){
  const level=document.getElementById('painLevel').value;
  const note=document.getElementById('painNote').value;
  const logs=JSON.parse(localStorage.getItem('hercalm_logs')||'[]');
  logs.unshift({date:new Date().toLocaleDateString(),level,symptoms:selectedSymptoms,note});
  localStorage.setItem('hercalm_logs',JSON.stringify(logs.slice(0,60)));
  document.getElementById('painNote').value='';
  selectedSymptoms=[];document.querySelectorAll('#tracker.badge').forEach(b=>{b.style.background='';b.style.color=''});
  loadHistory();
  alert('Saved! Check back tomorrow to see your pattern.');
}
function loadHistory(){
  const logs=JSON.parse(localStorage.getItem('hercalm_logs')||'[]');
  document.getElementById('historyList').innerHTML=logs.length?logs.map(l=>
    `<div style="border-bottom:1px solid #F3F4F6;padding:8px 0">
      <strong>${l.date}</strong> - Pain: ${l.level}/10<br>
      <span style="font-size:12px;color:var(--gray)">${l.symptoms.join(', ')||'No symptoms logged'}</span>
      ${l.note?`<br><em style="font-size:12px">"${l.note}"</em>`:''}
    </div>`
  ).join(''):'No logs yet. Start tracking to see patterns.';
}

// INIT
document.addEventListener('DOMContentLoaded',()=>{
  loadHistory();
  // Hide ads if not Samsung build
  if(!IS_SAMSUNG_BUILD)document.getElementById('samsungAdSlot').style.display='none';
});

// PWA Install
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.deferredPrompt=e});
