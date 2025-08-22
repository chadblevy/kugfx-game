/* -----------------------------------------
   ROOMS
----------------------------------------- */
const ROOMS = [
  { id: 'lobby', name: 'Lobby', image: 'assets/map/lobby.png', scale: 0.8, code: null, badge: '🆔',
    desc: 'Welcome to the Studio. Use codes I give you to reveal rooms.',
    tasks: ['Say hi in class', 'Watch: AE interface basics'] },
  { id: 'cubicle', name: 'Cubicles — Kinetic Type', image: 'assets/map/cubicle.png', scale: 0.7, code: 'kinetic123', badge: '⌨️',
    desc: 'Project 1: Kinetic Typography (15s). Animate type to rhythm/voiceover.',
    tasks: ['Layout in Illustrator', 'Animate in After Effects', 'Export H.264 1080p'] },
  { id: 'printer', name: 'Print Room — Prop Branding', image: 'assets/map/printer_breakroom_drafting.png', scale: 0.6, code: 'prop456', badge: '🧾',
    desc: 'Project 3: Prop Branding. Design a believable in-world brand.',
    tasks: ['Design label', 'Print + apply', 'Upload images or clip'] },
  { id: 'studio', name: 'Studio — Screen Graphics', image: 'assets/map/studio.png', scale: 0.7, code: 'screen654', badge: '🎥',
    desc: 'Project 4: Screen Graphics. Build a phone/computer UI for a scene.',
    tasks: ['Storyboard beats', 'Design UI', 'Deliver loop/demo video'] },
  { id: 'board', name: 'Boardroom — Data Viz + Final', image: 'assets/map/boardroom_office.png', scale: 0.6, code: 'data987', badge: '📊',
    desc: 'Project 5: Data Visualization. Assemble your final reel.',
    tasks: ['Plan charts', 'Animate in AE', 'Compile Final Reel'], finalCode:'final000', finalBadge:'🏆'}
];

/* -----------------------------------------
   STATE
----------------------------------------- */
let unlockedRooms = { lobby: true };
let currentIndex = 0;
let finalAwarded = false;

/* -----------------------------------------
   DOM ELEMENTS
----------------------------------------- */
const mapStrip = document.getElementById('mapStrip');
const badgeShelf = document.getElementById('badgeShelf');
const codeInput = document.getElementById('codeInput');
const unlockBtn = document.getElementById('unlockBtn');

const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

const dialogEl = document.getElementById('roomDialog');
const dialogTitle = document.getElementById('roomTitle');
const dialogDesc  = document.getElementById('roomDesc');
const dialogTasks = document.getElementById('roomTasks');
const dialogClose = document.getElementById('dialogClose');

/* -----------------------------------------
   RENDER MAP
----------------------------------------- */
function renderMap() {
  mapStrip.innerHTML = '';
  ROOMS.forEach(room => {
    const slide = document.createElement('section');
    slide.className = 'slide';
    slide.dataset.room = room.id;

    // Create room image with individual scaling
    const img = document.createElement('img');
    img.src = room.image;
    img.className = 'roomImage';
    img.style.transform = `scale(${room.scale})`;
    img.style.transformOrigin = 'center center';
    slide.appendChild(img);

    // Title label
    const title = document.createElement('div');
    title.className = 'slideTitle';
    title.textContent = room.name;
    slide.appendChild(title);

    // Lock overlay
    const overlay = document.createElement('div');
    overlay.className = 'lockOverlay';
    overlay.style.opacity = unlockedRooms[room.id] ? '0' : '1';
    overlay.innerHTML = `<span class="tag">Locked</span><span class="tag">Enter code to unlock</span>`;
    slide.appendChild(overlay);

    // NPC for modal trigger
    const npc = document.createElement('div');
    npc.className = 'npc';
    npc.textContent = '👨‍🏫';
    npc.title = 'Talk to Creative Director';
    npc.addEventListener('click', () => {
      if (unlockedRooms[room.id]) openRoomModal(room);
    });
    slide.appendChild(npc);

    mapStrip.appendChild(slide);
  });
}

/* -----------------------------------------
   BADGES
----------------------------------------- */
function renderBadges() {
  badgeShelf.innerHTML = '';
  ROOMS.forEach(room => {
    if (unlockedRooms[room.id]) {
      const li = document.createElement('li');
      li.innerHTML = `<span class="badgeEmoji">${room.badge}</span><span class="badgeName">${room.name}</span>`;
      badgeShelf.appendChild(li);
    }
  });
  if (finalAwarded) {
    const li = document.createElement('li');
    li.innerHTML = `<span class="badgeEmoji">🏆</span><span class="badgeName">Final Reel</span>`;
    badgeShelf.appendChild(li);
  }
}

/* -----------------------------------------
   NAVIGATION
----------------------------------------- */
function goToIndex(idx) {
  currentIndex = Math.max(0, Math.min(idx, ROOMS.length -1));
  mapStrip.style.transform = `translateX(-${currentIndex * 100}%)`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.disabled = currentIndex === ROOMS.length -1;
}

prevBtn.addEventListener('click', () => goToIndex(currentIndex-1));
nextBtn.addEventListener('click', () => goToIndex(currentIndex+1));

/* -----------------------------------------
   MODAL
----------------------------------------- */
function openRoomModal(room) {
  dialogTitle.textContent = room.name;
  dialogDesc.textContent = room.desc;
  dialogTasks.innerHTML = room.tasks?.length
    ? `<ul class="taskList">${room.tasks.map(t=>`<li>${t}</li>`).join('')}</ul>`
    : '';
  dialogEl.showModal();
}

dialogClose.addEventListener('click', () => dialogEl.close());

/* -----------------------------------------
   UNLOCK CODE
----------------------------------------- */
unlockBtn.addEventListener('click', () => {
  const code = codeInput.value.trim();
  if (!code) return;

  const room = ROOMS.find(r => r.code === code);
  if (room) {
    unlockedRooms[room.id] = true;
    renderMap();
    renderBadges();
    goToIndex(ROOMS.findIndex(r=>r.id===room.id));
    openRoomModal(room);
    codeInput.value = '';
    return;
  }

  const last = ROOMS[ROOMS.length-1];
  if (code === last.finalCode) {
    finalAwarded = true;
    renderBadges();
    openRoomModal({ name:'Final Reel', desc:'Congrats! Trophy awarded.', tasks:['Submit your final reel'] });
    codeInput.value = '';
    return;
  }

  alert('Invalid code.');
});

/* -----------------------------------------
   INIT
----------------------------------------- */
function init() {
  renderMap();
  renderBadges();
  goToIndex(0);
}

init();
