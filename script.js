// --- CONFIG ---
// Tip: use percentages so the hotspots scale with the image.
// Example coordinates are placeholders – replace with your real rooms.

const zones = [
  // id, name, description, rect (percent), unlock code, badge (emoji or image), prerequisite id
  {
    id: "lobby",
    name: "Lobby — Orientation",
    desc: "Welcome to the studio. Read the course intro and watch the Week 1 overview.",
    rect: { x: 2, y: 60, w: 10, h: 25 },
    code: null,          // first zone is unlocked by default
    badge: "🪪",         // ID badge
    prereq: null
  },
  {
    id: "bullpen",
    name: "Bullpen — Kinetic Typography",
    desc: "Client brief: 15–20s kinetic type piece. AE + Illustrator. Due Week 4.",
    rect: { x: 16, y: 55, w: 12, h: 30 },
    code: "CODE-KINETIC-2024",
    badge: "⌨️",
    prereq: "lobby"
  },
  {
    id: "printer",
    name: "Print Room — Prop Branding",
    desc: "Design & produce a prop label/packaging. Deliver a physical mockup + short demo clip.",
    rect: { x: 32, y: 52, w: 12, h: 30 },
    code: "CODE-PROP-2024",
    badge: "🧾",
    prereq: "bullpen"
  },
  {
    id: "break",
    name: "Break Room — Team Workshop",
    desc: "Team Quest: quick logo jam (30 min). Optional XP boost.",
    rect: { x: 48, y: 58, w: 10, h: 22 },
    code: "CODE-TEAM-1",
    badge: "☕",
    prereq: "printer"
  },
  {
    id: "collage",
    name: "Drafting Room — Collage/Abstract",
    desc: "20–30s expressive animation from found/created imagery.",
    rect: { x: 60, y: 50, w: 12, h: 30 },
    code: "CODE-COLLAGE-2024",
    badge: "📎",
    prereq: "break"
  },
  {
    id: "studio",
    name: "Studio — Screen Graphics",
    desc: "Phone/computer interface; timed loop or interactive prototype.",
    rect: { x: 74, y: 45, w: 12, h: 30 },
    code: "CODE-SCREENS-2024",
    badge: "🖥️",
    prereq: "collage"
  },
  {
    id: "board",
    name: "Board Room — Data Viz (Diegetic)",
    desc: "15–20s infographic animation framed in-world (news/weather/corporate).",
    rect: { x: 88, y: 40, w: 12, h: 30 },
    code: "CODE-DATAVIZ-2024",
    badge: "📊",
    prereq: "studio"
  },
  {
    id: "office",
    name: "Main Office — Final Reel",
    desc: "Curated, polished reel of the semester’s best work.",
    rect: { x: 100, y: 38, w: 12, h: 30 },
    code: "CODE-FINAL-2024",
    badge: "🏆",
    prereq: "board"
  },
];

// XP per zone (optional visual)
const xpMap = {
  lobby: 0,
  bullpen: 100,
  printer: 150,
  break: 50,
  collage: 150,
  studio: 150,
  board: 150,
  office: 200
};

// --- STATE / STORAGE ---
const qs = new URLSearchParams(location.search);
const userId = qs.get("id") || "default"; // allow ?id=firstname to keep separate saves on same device
const STORAGE_KEY = `gfm_progress_${userId}`;

function loadProgress(){
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // default: only lobby unlocked
    const base = { unlocked: { lobby: true }, badges: [], current: "lobby" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(base));
    return base;
  }
  try { return JSON.parse(raw); } catch { return { unlocked:{ lobby:true }, badges:[], current:"lobby" }; }
}
function saveProgress(p){ localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); }

let progress = loadProgress();

// --- DOM HOOKS ---
const hotspotsEl = document.getElementById('hotspots');
const playerEl   = document.getElementById('player');
const badgeShelf = document.getElementById('badgeShelf');
const progressList = document.getElementById('progressList');
const zoneDialog = document.getElementById('zoneDialog');
const zoneTitle  = document.getElementById('zoneTitle');
const zoneDesc   = document.getElementById('zoneDesc');
const zoneStatus = document.getElementById('zoneStatus');
const dialogClose= document.getElementById('dialogClose');
const codeDialog = document.getElementById('codeDialog');
const codeForm   = document.getElementById('codeForm');
const codeInput  = document.getElementById('codeInput');
const enterCodeBtn = document.getElementById('enterCodeBtn');
const resetBtn   = document.getElementById('resetBtn');
const levelReadout = document.getElementById('levelReadout');

// --- RENDER ---
function renderHotspots(){
  hotspotsEl.innerHTML = '';
  zones.forEach(z => {
    const {x,y,w,h} = z.rect;
    const unlocked = !!progress.unlocked[z.id] || z.id === 'lobby';
    const d = document.createElement('div');
    d.className = 'hotspot';
    d.dataset.locked = unlocked ? "false" : "true";
    d.style.left = x + '%';
    d.style.top = y + '%';
    d.style.width = w + '%';
    d.style.height = h + '%';

    const btn = document.createElement('button');
    btn.setAttribute('aria-label', z.name);
    btn.addEventListener('click', () => onZoneClick(z, unlocked));
    d.appendChild(btn);
    hotspotsEl.appendChild(d);
  });
}

function onZoneClick(z, unlocked){
  zoneTitle.textContent = z.name;
  zoneDesc.textContent = z.desc;
  if (unlocked) {
    zoneStatus.innerHTML = `<span style="color:var(--good)">Unlocked</span> · Worth ${xpMap[z.id]||0} XP`;
    setCurrent(z.id);
  } else {
    zoneStatus.innerHTML = `<span style="color:var(--warn)">Locked</span> · Complete previous task & enter code`;
  }
  zoneDialog.showModal();
}

function setCurrent(id){
  progress.current = id;
  saveProgress(progress);
  movePlayerTo(id);
  renderProgressList();
}

function movePlayerTo(id){
  const z = zones.find(z => z.id === id);
  if (!z) return;
  // place marker roughly at center-top of the zone
  const cx = z.rect.x + z.rect.w/2;
  const cy = z.rect.y + 2; // a touch above
  playerEl.style.left = cx + '%';
  playerEl.style.top  = cy + '%';

  // auto-scroll map so the marker is in view
  const wrap = document.querySelector('.mapWrap');
  const img  = document.getElementById('mapImg');
  const pxX  = (cx/100) * img.clientWidth;
  wrap.scrollTo({ left: Math.max(0, pxX - wrap.clientWidth*0.45), behavior:'smooth' });
}

function renderBadges(){
  badgeShelf.innerHTML = '';
  zones.forEach(z => {
    const earned = progress.unlocked[z.id];
    const el = document.createElement('div');
    el.className = 'badge' + (earned ? '' : ' locked');
    // Use emoji or swap in your own <img src="assets/badges/...png">
    el.textContent = z.badge || '🏅';
    el.title = earned ? `${z.name} badge` : `${z.name} (locked)`;
    badgeShelf.appendChild(el);
  });
}

function renderProgressList(){
  const totalXP = Object.entries(progress.unlocked)
    .filter(([id,val]) => id in xpMap && val)
    .reduce((sum,[id]) => sum + xpMap[id], 0);
  progressList.innerHTML = zones.map(z => {
    const done = !!progress.unlocked[z.id];
    return `<li class="${done ? 'done':''}">${z.name}${done ? ` — +${xpMap[z.id]||0} XP` : ''}</li>`;
  }).join('');
  levelReadout.textContent = `Level: ${calcLevel(totalXP)} · ${totalXP} XP`;
}

function calcLevel(xp){
  if (xp >= 900) return 'Senior Designer';
  if (xp >= 600) return 'Designer';
  if (xp >= 300) return 'Junior Designer';
  return 'Apprentice';
}

// --- UNLOCK BY CODE ---
enterCodeBtn.addEventListener('click', () => {
  codeInput.value = '';
  codeDialog.showModal();
});

codeForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const code = (codeInput.value || '').trim();
  if (!code) return;

  // find the first locked zone whose code matches and whose prereq is met
  const match = zones.find(z => !progress.unlocked[z.id] && z.code && z.code === code && prereqMet(z));
  if (match) {
    progress.unlocked[match.id] = true;
    // record badge (optional)
    if (!progress.badges.includes(match.id)) progress.badges.push(match.id);
    saveProgress(progress);
    renderHotspots(); renderBadges(); renderProgressList();
    setCurrent(match.id);
    codeDialog.close();
  } else {
    // gentle fail
    alert("Code not valid yet. Make sure you've completed the previous task or check the code.");
  }
});

function prereqMet(z){
  if (!z.prereq) return true;
  return !!progress.unlocked[z.prereq];
}

// Close dialogs
document.getElementById('dialogClose').addEventListener('click', () => zoneDialog.close());
document.getElementById('resetBtn').addEventListener('click', () => {
  if (confirm('Reset your progress?')) {
    localStorage.removeItem(STORAGE_KEY);
    progress = loadProgress();
    renderHotspots(); renderBadges(); renderProgressList(); movePlayerTo(progress.current);
  }
});

// --- INIT ---
renderHotspots();
renderBadges();
renderProgressList();
movePlayerTo(progress.current);

// Accessibility: close dialogs with Esc
[zoneDialog, codeDialog].forEach(dlg=>{
  dlg.addEventListener('cancel', (e)=> e.preventDefault()); // keep styling consistent
});
