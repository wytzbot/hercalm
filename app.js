// CONFIG
const IS_SAMSUNG_BUILD = true; // Set false for Amazon to hide ads

// SWEET DAILY MESSAGES
const SWEET_MESSAGES = [
  "Your body is doing amazing work today. Be gentle with yourself 💗",
  "Cramps don't define you. You're stronger than you feel right now.",
  "Rest is productive. Healing is not lazy. You deserve comfort.",
  "This too shall pass. Breathe. You’ve survived 100% of your worst days.",
  "Your period is not a weakness. It's a monthly reminder of your power.",
  "Drink water, breathe deep, and remember: you're not alone in this.",
  "It's OK to cancel plans. It's OK to stay in bed. Your body comes first."
];

// 20 FAQs
const FAQS = [
  {q:"Why are cramps worse at night?",a:"Prostaglandins peak at night + lying flat reduces pelvic blood flow. Use a pillow under knees + heat 20 mins before bed."},
  {q:"Can I exercise on day 1?",a:"Yes. Gentle yoga/walking reduces cramps. Avoid inversions if flow is heavy. Rest if you need — listen to your body."},
  {q:"What foods stop cramps fast?",a:"Ginger tea, dark chocolate 70%+, banana, salmon. Magnesium works in 20 mins. Avoid coffee, chips, alcohol."},
  {q:"When should I worry about pain?",a:"See a doctor if: pain stops you from work 2+ days, soak a pad in 1hr, or have fever. Normal cramps shouldn’t need ER."},
  {q:"Does birth control help cramps?",a:"Often yes. Hormonal BC thins uterine lining = less prostaglandins. Talk to your doctor. This app isn’t medical advice."},
  {q:"Why do I get diarrhea on my period?",a:"Prostaglandins affect bowels too. Eat bananas, rice, toast. Avoid coffee. It’s normal but annoying."},
  {q:"Is it normal to feel sad before my period?",a:"Yes. Estrogen drops = serotonin drops. PMDD is real. Track moods here. See doctor if it ruins your life 2 weeks/month."},
  {q:"Can orgasms help cramps?",a:"Science says yes. Orgasms release endorphins + oxytocin = natural painkillers. Uterine contractions also help shed lining."},
  {q:"Why am I so bloated?",a:"Progesterone slows digestion. Estrogen drops = water retention. Drink water, eat potassium: banana, avocado. Avoid salt."},
  {q:"How much blood loss is too much?",a:"Soaking 1 pad/tampon per hour for 2+ hours = call doctor. Clots larger than a quarter = check with OB-GYN."},
  {q:"Can I swim on my period?",a:"Yes! Use tampon or menstrual cup. Water pressure slows flow temporarily. No, sharks won’t smell you."},
  {q:"Why do I crave chocolate?",a:"Magnesium drops before period. Dark chocolate has magnesium. Your body is smart. Listen to it."},
  {q:"Do heating pads cause infertility?",a:"No. Safe 20-min use on low heat is fine. Don’t sleep with it or use on bare skin. Burns are the only risk."},
  {q:"What is endometriosis?",a:"When uterine tissue grows outside uterus. Causes severe pain. If OTC meds don’t touch your pain, see a doctor."},
  {q:"Can stress make cramps worse?",a:"100%. Stress = cortisol = more prostaglandins = worse cramps. Use the Breathe tool here. It works."},
  {q:"Why is my period late?",a:"Stress, weight change, travel, illness. Pregnancy. Take a test if sexually active. Track cycles here to see patterns."},
  {q:"Are period apps safe for data?",a:"HerCalm stores everything on YOUR phone. We can’t see it. If you delete app, data is gone. No cloud."},
  {q:"What’s the best position to sleep?",a:"Fetal position with pillow between knees. Or on back with pillow under knees. Takes pressure off pelvis."},
  {q:"Can I take ibuprofen + use heat?",a:"Yes. They work differently. Ibuprofen blocks prostaglandins. Heat relaxes muscles. Combo is safe for most."},
  {q:"Will cramps get better with age?",a:"Often yes. After 1st pregnancy or in your 30s, many women report less pain. Secondary causes can worsen it — track & check."}
];

// NAVIGATION
function nav(page) {
  document.querySelectorAll('.container > div').forEach(d => d.classList.add('hidden'));
  document.getElementById(page).classList.remove('hidden');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navMap = {home:0,tracker:1,guide:2,mood:3};
  if(navMap[page]!==undefined) document.querySelectorAll('.nav-item')[navMap[page]].classList.add('active');
  window.scrollTo(0,0);
}

// AFFILIATE TRACKING
function trackAffiliate(product) {
  const links = {
    'yoga-mat': 'https://amazon.com/dp/B0XXXXX?tag=yourtag-20',
    'heat-pad': 'https://amazon.com/dp/B0XXXXX?tag=yourtag-20',
    'tea-bundle': 'https://amazon.com/dp/B0XXXXX?tag=yourtag-20',
    'ginger-tea': 'https://amazon.com/dp/B0XXXXX?tag=yourtag-20'
  };
  window.open(links[product] || '#', '_blank');
}

// DAILY SWEET MESSAGE - Shows once per 24hrs
function checkDailyMessage() {
  const lastShown = localStorage.getItem('hercalm_lastMsg');
  const now = Date.now();
  if (!lastShown || now - lastShown > 86400000) { // 24hrs
    const msg = SWEET_MESSAGES[Math.floor(Math.random() * SWEET_MESSAGES.length)];
    document.getElementById('messageText').textContent = msg;
    document.getElementById('dailyMessage').classList.remove('hidden');
  }
}
function closeDailyMessage() {
  localStorage.setItem('hercalm_lastMsg', Date.now());
  document.getElementById('dailyMessage').classList.add('hidden');
}

// YOGA FLOW
let yogaInterval, yogaSec = 360, yogaRunning = false;
const yogaPoses = [
  {name:"Child's Pose",desc:"Knees wide. Forehead to mat. Breathe into back. 60s"},
  {name:"Cat-Cow",desc:"Hands/knees. Inhale drop belly. Exhale round spine. 60s"},
  {name:"Reclined Twist",desc:"Lie on back. Drop knees right, look left. 30s each. 60s"},
  {name:"Supine Butterfly",desc:"Soles together. Knees fall out. Hands on belly. 60s"},
  {name:"Legs Up Wall",desc:"Butt to wall. Legs up. Drains pelvis. 60s"},
  {name:"Savasana",desc:"Lie flat. Palms up. Melt into floor. 60s"}
];
function toggleYoga() {
  if(yogaRunning){clearInterval(yogaInterval);document.getElementById('yogaBtn').textContent='Resume Flow';yogaRunning=false;return}
  yogaRunning = true; document.getElementById('yogaBtn').textContent='Pause';
  yogaInterval = setInterval(()=>{
    yogaSec--;
    document.getElementById('yogaTimer').textContent = `${Math.floor(yogaSec/60)}:${String(yogaSec%60).padStart(2,'0')}`;
    document.getElementById('yogaProgress').style.width = `${100-(yogaSec/360)*100}%`;
    let idx = 5-Math.floor(yogaSec/60);
    if(yogaPoses[idx]){document.getElementById('poseName').textContent=yogaPoses[idx].name;document.getElementById('poseDesc').textContent=yogaPoses[idx].desc}
    if(yogaSec<=0){clearInterval(yogaInterval);document.getElementById('yogaBtn').textContent='Flow Complete!';yogaRunning=false;yogaSec=360}
  },1000);
}

// BREATHING
let breatheRunning = false;
function toggleBreathe() {
  if(breatheRunning){breatheRunning=false;document.getElementById('breatheBtn').textContent='Resume';return}
  breatheRunning = true; document.getElementById('breatheBtn').textContent='Pause';
  const cycle = [{text:'Breathe In',dur:4000},{text:'Hold',dur:7000},{text:'Breathe Out',dur:8000}];
  let i=0; const run=()=>{
    if(!breatheRunning)return;
    document.getElementById('breatheTimer').textContent=cycle[i].text;
    document.getElementById('breatheInstruction').textContent=i===0?'Through nose':i===1?'Relax shoulders':'Through mouth like sigh';
    document.getElementById('breatheProgress').style.width=`${(i+1)/3*100}%`;
    setTimeout(()=>{i=(i+1)%3;run()},cycle[i].dur);
  }; run();
}

// HEAT TIMER
let heatInterval, heatSec=1200, heatRunning=false;
function toggleHeat() {
  if(heatRunning){clearInterval(heatInterval);document.getElementById('heatBtn').textContent='Resume Heat';heatRunning=false;return}
  heatRunning=true; document.getElementById('heatBtn').textContent='Pause Timer';
  heatInterval=setInterval(()=>{
    heatSec--;
    document.getElementById('heatTimer').textContent=`${Math.floor(heatSec/60)}:${String(heatSec%60).padStart(2,'0')}`;
    if(heatSec<=0){clearInterval(heatInterval);alert('Heat done! Remove pad for 20 mins.');heatRunning=false;heatSec=1200;document.getElementById('heatBtn').textContent='Start 20-Min Heat'}
  },1000);
}

// ACUPRESSURE
function startPointTimer(seconds, id) {
  let sec=seconds; const el=document.getElementById(id+'Timer'); el.style.display='block';
  const int=setInterval(()=>{
    sec--; el.textContent=`${Math.floor(sec/60)}:${String(sec%60).padStart(2,'0')}`;
    if(sec<=0){clearInterval(int);el.textContent='Done! Release.';setTimeout(()=>el.style.display='none',2000)}
  },1000);
}

// TRACKER
let selectedSymptoms=[];
function toggleSymptom(el){
  el.classList.toggle('active');
  const sym=el.textContent;
  if(selectedSymptoms.includes(sym))selectedSymptoms=selectedSymptoms.filter(s=>s!==sym);
  else selectedSymptoms.push(sym);
}
function saveLog(){
  const logs=JSON.parse(localStorage.getItem('hercalm_logs')||'[]');
  logs.unshift({date:new Date().toLocaleDateString(),level:document.getElementById('painLevel').value,symptoms:selectedSymptoms,note:document.getElementById('painNote').value});
  localStorage.setItem('hercalm_logs',JSON.stringify(logs.slice(0,60)));
  document.getElementById('painNote').value='';selectedSymptoms=[];document.querySelectorAll('#symptomBadges.badge').forEach(b=>b.classList.remove('active'));
  loadHistory(); alert('Saved! 💗');
}
function loadHistory(){
  const logs=JSON.parse(localStorage.getItem('hercalm_logs')||'[]');
  document.getElementById('historyList').innerHTML=logs.length?logs.map(l=>
    `<div style="border-bottom:1px solid #F3F4F6;padding:8px 0"><strong>${l.date}</strong> - Pain: ${l.level}/10<br><span style="font-size:12px;color:var(--gray)">${l.symptoms.join(', ')||'No symptoms'}</span>${l.note?`<br><em style="font-size:12px">"${l.note}"</em>`:''}</div>`
  ).join(''):'No logs yet.';
}

// MOOD CHECK - NEW TOOL
let currentMood=0;
function setMood(val,el){
  currentMood=val;
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));
  el.classList.add('active');
  const msgs=['','Sending you a hug 🤗','Bad days happen. Tomorrow is new 💗','Neutral is OK too','You\'re doing great!','Yesss! Protect this energy ✨'];
  document.getElementById('moodMessage').textContent=msgs[val];
}
function saveMood(){
  if(!currentMood){alert('Tap an emoji first!');return}
  const moods=JSON.parse(localStorage.getItem('hercalm_moods')||'[]');
  moods.unshift({date:new Date().toLocaleDateString(),mood:currentMood});
  localStorage.setItem('hercalm_moods',  localStorage.setItem('hercalm_moods',JSON.stringify(moods.slice(0,30)));
  loadMoods();
  document.querySelectorAll('.mood-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('moodMessage').textContent='Saved! Check your pattern below 💗';
  currentMood=0;
}
function loadMoods(){
  const moods=JSON.parse(localStorage.getItem('hercalm_moods')||'[]');
  const emojis=['','😭','😔','😐','🙂','😊'];
  document.getElementById('moodHistory').innerHTML=moods.length?moods.slice(0,7).map(m=>
    `<div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #F3F4F6">
      <span>${m.date}</span><span style="font-size:20px">${emojis[m.mood]}</span>
    </div>`
  ).join(''):'No mood logs yet.';
}

// CALM SOUNDS - NEW TOOL
let soundInterval, soundSec=0;
function playSound(type) {
  clearInterval(soundInterval);
  const durations={rain:300,waves:300,white:600};
  soundSec=durations[type];
  const timerEl=document.getElementById(type+'Timer');
  timerEl.style.display='block';
  document.querySelectorAll('#sounds.timer').forEach(t=>{if(t!==timerEl)t.style.display='none'});

  soundInterval=setInterval(()=>{
    soundSec--;
    timerEl.textContent=`${Math.floor(soundSec/60)}:${String(soundSec%60).padStart(2,'0')}`;
    if(soundSec<=0){
      clearInterval(soundInterval);
      timerEl.textContent='Done. Feel better? 💗';
      setTimeout(()=>timerEl.style.display='none',3000);
    }
  },1000);

  // Vibrate pattern if supported - feels like actual sound pulse
  if(navigator.vibrate) navigator.vibrate([200,100,200]);
}

// FAQ SYSTEM
function toggleFAQ(el) {
  const answer = el.querySelector('.faq-answer');
  const isHidden = answer.classList.contains('hidden');
  document.querySelectorAll('.faq-answer').forEach(a => a.classList.add('hidden'));
  if(isHidden) answer.classList.remove('hidden');
}

function loadFAQs(){
  document.getElementById('faqList').innerHTML = FAQS.map(f=>
    `<div class="faq-item" onclick="toggleFAQ(this)">
      <strong>${f.q}</strong>
      <p class="faq-answer hidden">${f.a}</p>
    </div>`
  ).join('');
}

// INIT - Runs on app load
document.addEventListener('DOMContentLoaded',()=>{
  loadHistory();
  loadMoods();
  loadFAQs();
  checkDailyMessage();

  // Hide Samsung ads if Amazon build
  if(!IS_SAMSUNG_BUILD) document.getElementById('samsungAdSlot').style.display='none';

  // Register service worker
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  }
});

// PWA Install prompt
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();window.deferredPrompt=e;});
