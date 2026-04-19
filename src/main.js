import './style.css';

// === SKIBIDI NAME GENERATOR ===
const prefixes = [
  'Skibidi', 'Sigma', 'Gyatt', 'Ohio', 'Mewing', 'Fanum Tax',
  'Grimace Shake', 'Brainrot', 'Rizz', 'No Cap', 'Sus', 'Alpha',
  'Delulu', 'Slay', 'Bussin', 'Lit', 'Vibe Check', 'Yeet',
  'Ratio', 'NPC', 'Goated', 'Based', 'Cringe', 'Oof',
  'Drip', 'Lowkey', 'Highkey', 'Deadass', 'Simp', 'W',
  'L', 'Bing Chilling', 'Amogus', 'Jellyfish', 'Goofy Ahh',
  'Sussy Baka', 'Ice Spice', 'Baby Gronk', 'Livvy Dunne',
  'Duke Dennis', 'Kai Cenat', 'Hawk Tuah', 'Glaze',
];

const names = [
  'Lenka', 'Lenička', 'Lenulinka', 'Lenuše', 'Lenísek',
  'Lenčí', 'Lenďa', 'Lena', 'Leňour', 'Lenkorino',
  'Lenkoid', 'Lenkosaurus', 'Lenkinator', 'Lenkovice',
  'Lenkuška', 'Leniščka', 'Lenčura', 'Lentáček',
];

const suffixes = [
  '', '', '', '', // empty suffixes are common (weighted)
  'Rizzlerka', 'Boss', 'Queen', 'Goat', 'Sensei',
  'Ultra', 'Deluxe', 'Supreme', 'Fr Fr', 'No Cap',
  'XL', 'Pro Max', 'Turbo', '3000', 'Prime',
  'Vibes', 'Core', 'Maxxing', 'Era',
];

const emojis = [
  '🚽', '😤', '🎤', '🍑', '🌀', '🦷', '😈', '💜', '🧠', '👁️',
  '🦅', '🔥', '💀', '🐺', '🪬', '🏆', '✨', '👑', '💅', '🤯',
  '🫠', '🥶', '🤡', '😎', '🦈', '🎭', '⚡', '🌶️', '🧊', '💎',
];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

let idCounter = 0;

function generateNickname() {
  const prefix = randomItem(prefixes);
  const name = randomItem(names);
  const suffix = randomItem(suffixes);
  const emoji = randomItem(emojis);
  const text = suffix ? `${emoji} ${prefix} ${name} ${suffix}` : `${emoji} ${prefix} ${name}`;
  idCounter++;
  return { id: `gen-${idCounter}`, text };
}

function generateBatch(count = 8) {
  const batch = [];
  const seen = new Set();
  while (batch.length < count) {
    const nick = generateNickname();
    if (!seen.has(nick.text)) {
      seen.add(nick.text);
      batch.push(nick);
    }
  }
  return batch;
}

// === ORIGINAL STARTER NICKNAMES ===
const starterNicknames = [
  { id: 'n1', text: '🚽 Skibidi Lenka' },
  { id: 'n2', text: '😤 Sigma Lenulinka' },
  { id: 'n3', text: '🎤 Lenka Rizzlerka' },
  { id: 'n4', text: '🍑 Gyatt Lenička' },
  { id: 'n5', text: '🌀 Ohio Boss Lenka' },
  { id: 'n6', text: '🦷 Mewing Lenka' },
  { id: 'n7', text: '😈 Fanum Tax Lenka' },
  { id: 'n8', text: '💜 Grimace Shake Lenka' },
  { id: 'n9', text: '🧠 Brainrot Lenka' },
  { id: 'n10', text: '👁️ Lenka Delulu' },
  { id: 'n11', text: '🦅 No Cap Lenka' },
  { id: 'n12', text: '🔥 Rizz Goddess Lenka' },
  { id: 'n13', text: '💀 Sus Lenka' },
  { id: 'n14', text: '🐺 Alpha Lenka Fr Fr' },
  { id: 'n15', text: '🪬 Bereal Lenka' },
  { id: 'n16', text: '🏆 Goat Lenka' },
];

// === DRAG & DROP ===
let draggingCard = null;

function createCard(nickname) {
  const card = document.createElement('div');
  card.classList.add('nickname-card');
  card.setAttribute('draggable', 'true');
  card.setAttribute('data-id', nickname.id);
  card.textContent = nickname.text;

  card.addEventListener('dragstart', (e) => {
    draggingCard = card;
    setTimeout(() => card.classList.add('dragging'), 0);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', nickname.id);
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
    draggingCard = null;
  });

  return card;
}

function setupDropzone(zone) {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    zone.classList.add('dropzone-active');

    if (draggingCard) {
      const afterElement = getDragAfterElement(zone, e.clientX, e.clientY);
      if (afterElement == null) {
        zone.appendChild(draggingCard);
      } else {
        zone.insertBefore(draggingCard, afterElement);
      }
    }
  });

  zone.addEventListener('dragleave', (e) => {
    if (!zone.contains(e.relatedTarget)) {
      zone.classList.remove('dropzone-active');
    }
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.classList.remove('dropzone-active');
  });
}

function getDragAfterElement(container, x, y) {
  const draggableElements = [
    ...container.querySelectorAll('.nickname-card:not(.dragging)'),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offsetX = x - box.left - box.width / 2;
      const offsetY = y - box.top - box.height / 2;
      const offset = Math.abs(offsetX) < box.width ? offsetX : offsetY;
      if (offset < 0 && offset > closest.offset) {
        return { offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// === INIT ===
function init() {
  const bank = document.getElementById('nickname-bank');
  const generateBtn = document.getElementById('generate-btn');

  // Populate bank with a mix of random nicknames and some classics
  const initialNicks = [
    ...starterNicknames.sort(() => 0.5 - Math.random()).slice(0, 8),
    ...generateBatch(8)
  ];
  
  initialNicks.forEach((nick) => {
    bank.appendChild(createCard(nick));
  });

  // Setup all dropzones (tier rows + bank)
  document.querySelectorAll('[data-dropzone="true"]').forEach(setupDropzone);

  // Generate button - adds new random nicknames to the bank
  generateBtn.addEventListener('click', () => {
    const newNicks = generateBatch(6);
    newNicks.forEach((nick) => {
      const card = createCard(nick);
      card.style.animation = 'popIn 0.3s ease-out';
      bank.appendChild(card);
    });

    // Button animation
    generateBtn.classList.add('btn-clicked');
    setTimeout(() => generateBtn.classList.remove('btn-clicked'), 300);
  });
}

init();
