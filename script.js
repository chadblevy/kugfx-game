// ---------- Zones and Progress ----------
const zones = [
  { id: 'lobby',   name: 'Lobby',       code: null,        badge: '🆔', prereq: null },
  { id: 'bullpen', name: 'Cubicles',    code: 'kinetic123', badge: '⌨️', prereq: 'lobby' },
  { id: 'printer', name: 'Print Room',  code: 'prop456',    badge: '🧾', prereq: 'bullpen' },
  { id: 'break',   name: 'Break Room',  code: 'break789',   badge: '☕', prereq: 'printer' },
  { id: 'collage', name: 'Collage Lab', code: 'collage321', badge: '📎', prereq: 'break' },
  { id: 'studio',  name: 'Studio',      code: 'screen654',  badge: '🎥', prereq: 'collage' },
  { id: 'board',   name: 'Board Room',  code: 'data987',    badge: '📊', prereq: 'studio' },
  { id: 'office',  name: 'Main Office', code: 'final000',   badge: '🏆', prereq: 'board' },
];

const STORAGE_KEY = 'studio_map_progress';
let progress = JSON.parse(localStorage.getItem(STORAGE_KEY)) || { unlocked: { lobby: true }, current: 'lobby' };

// ---------- DOM Elements ----------
const map = document.getElementById('mapImg'); // matches HTML ID
const hotspotContainer = document.getElementById('hotspots');
const player = document.getElementById('player');
const badgeShelf = document.getElementById('badgeShelf');
const codeInput = document.getElementById('codeInput');
const unlockBtn = document.getElementById('enterCodeBtn'); // matches HTML ID
const resetBtn = document.getElementById('resetBtn');

// ---------- Save & Load ----------
function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

// ---------- Render Functions ----------
function renderBadges() {
  badgeShelf.innerHTML = '';
  zones.filter(z => progress.unlocked[z.id]).forEach(z => {
    const li = document.createElement('li');
    li.textContent = `${z.badge} ${z.name}`;
    badgeShelf.appendChild(li);
  });
}

function renderHotspots() {
  hotspotContainer.innerHTML = '';
  zones.forEach(z => {
    const unlocked = !!progress.unlocked[z.id];
    if (!z.rect) return; // skip if rect not defined
    const div = document.createElement('div');
    div.className = 'hotspot' + (unlocked ? '' : ' locked');
    div.style.left  = z.rect.x + '%';
    div.style.top   = z.rect.y + '%';
    div.style.width = z.rect.w + '%';
    div.style.height= z.rect.h + '%';
    div.title = `${z.name} (${unlocked ? 'Unlocked' : 'Locked'})`;
    if (unlocked) {
      div.addEventListener('click', () => moveTo(z.id));
    }
    hotspotContainer.appendChild(div);
  });
}

// ---------- Move Player ----------
function moveTo(id) {
  const z = zones.find(z => z.id === id);
  if (!z || !z.rect) return;
  progress.current = id;
  saveProgress();

  const imgW = map.clientWidth;
  const imgH = map.clientHeight;
  const cx = (z.rect.x + z.rect.w / 2) * imgW / 100;
  const cy = (z.rect.y + z.rect.h / 2) * imgH / 100;

  player.style.left = cx + 'px';
  player.style.top  = cy + 'px';
}

// ---------- Unlock Code Logic ----------
unlockBtn.addEventListener('click', () => {
  const code = codeInput.value.trim();
  const z = zones.find(zone => 
    zone.code === code && 
    !progress.unlocked[zone.id] &&
    (!zone.prereq || progress.unlocked[zone.prereq])
  );

  if (z) {
    progress.unlocked[z.id] = true;
    saveProgress();
    renderHotspots();
    renderBadges();
    moveTo(z.id);
    alert(`Unlocked: ${z.name}!`);
  } else {
    alert('Invalid code or locked.');
  }

  codeInput.value = '';
});

// ---------- Reset Progress ----------
resetBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  progress = { unlocked: { lobby: true }, current: 'lobby' };
  saveProgress();
  renderHotspots();
  renderBadges();
  moveTo('lobby');
});

// ---------- Define Rectangles & Initial Render ----------
map.addEventListener('load', () => {
  const w = 100;
  const h = 60;

  // Example layout: left to right
  zones.forEach((z, i) => {
    z.rect = { x: 5 + i * (w / zones.length), y: 20, w: 8, h: 30 };
  });

  renderHotspots();
  renderBadges();
  moveTo(progress.current);
});

// Trigger manually if image is cached
if (map.complete) {
  map.dispatchEvent(new Event('load'));
}
