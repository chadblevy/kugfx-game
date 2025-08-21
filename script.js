const zones = [
  { id: 1, name: "Zone 1", code: "alpha", unlocked: true },
  { id: 2, name: "Zone 2", code: "bravo", unlocked: false },
  { id: 3, name: "Zone 3", code: "charlie", unlocked: false },
];

const badgeList = document.getElementById('badge-list');
const unlockBtn = document.getElementById('unlock-btn');
const unlockInput = document.getElementById('unlock-code');

// Render inventory badges
function renderBadges() {
  badgeList.innerHTML = '';
  zones.forEach(zone => {
    const li = document.createElement('li');
    li.textContent = `${zone.name} ${zone.unlocked ? '✅' : '🔒'}`;
    badgeList.appendChild(li);
  });
}

// Unlock zone when code is correct
unlockBtn.addEventListener('click', () => {
  const code = unlockInput.value.trim().toLowerCase();
  const zone = zones.find(z => z.code === code);
  if (zone && !zone.unlocked) {
    zone.unlocked = true;
    alert(`${zone.name} unlocked!`);
    renderBadges();
  } else {
    alert('Invalid code or already unlocked.');
  }
  unlockInput.value = '';
});

// Initialize badges on load
renderBadges();
