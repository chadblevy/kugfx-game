// Game state
const rooms = [
  { name: "Lobby", code: null, unlocked: true },
  { name: "Cubicles", code: "kinetic123", unlocked: false },
  { name: "Printing Room", code: "prop456", unlocked: false },
  { name: "Break Room", code: "break789", unlocked: false },
  { name: "Collage Room", code: "collage321", unlocked: false },
  { name: "Studio", code: "screen654", unlocked: false },
  { name: "Board Room", code: "data987", unlocked: false },
  { name: "Main Office", code: "final000", unlocked: false },
];

const inventory = [];

const inventoryList = document.getElementById("inventory-list");
const codeInput = document.getElementById("code-input");
const submitCode = document.getElementById("submit-code");

// Add items to inventory visually
function updateInventory() {
  inventoryList.innerHTML = "";
  inventory.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    inventoryList.appendChild(li);
  });
}

// Unlock room function
function unlockRoom(code) {
  const room = rooms.find(r => r.code === code);
  if (room && !room.unlocked) {
    room.unlocked = true;
    inventory.push(`${room.name} Badge`);
    updateInventory();
    alert(`🎉 ${room.name} is now unlocked!`);
  } else {
    alert("Invalid code or room already unlocked.");
  }
}

// Event listener for code submission
submitCode.addEventListener("click", () => {
  const code = codeInput.value.trim();
  if (code) {
    unlockRoom(code);
    codeInput.value = "";
  }
});
