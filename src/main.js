import './style.css';

const nicknames = [
  { id: 'n1', text: '🚽 Skibidi Lenka', emoji: '🚽' },
  { id: 'n2', text: '😤 Sigma Lenulinka', emoji: '😤' },
  { id: 'n3', text: '🎤 Lenka Rizzlerka', emoji: '🎤' },
  { id: 'n4', text: '🍑 Gyatt Lenička', emoji: '🍑' },
  { id: 'n5', text: '🌀 Ohio Boss Lenka', emoji: '🌀' },
  { id: 'n6', text: '🦷 Mewing Lenka', emoji: '🦷' },
  { id: 'n7', text: '😈 Fanum Tax Lenka', emoji: '😈' },
  { id: 'n8', text: '💜 Grimace Shake Lenka', emoji: '💜' },
  { id: 'n9', text: '🧠 Brainrot Lenka', emoji: '🧠' },
  { id: 'n10', text: '👁️ Lenka Delulu', emoji: '👁️' },
  { id: 'n11', text: '🦅 No Cap Lenka', emoji: '🦅' },
  { id: 'n12', text: '🔥 Rizz Goddess Lenka', emoji: '🔥' },
  { id: 'n13', text: '💀 Sus Lenka', emoji: '💀' },
  { id: 'n14', text: '🐺 Alpha Lenka Fr Fr', emoji: '🐺' },
  { id: 'n15', text: '🪬 Bereal Lenka', emoji: '🪬' },
  { id: 'n16', text: '🏆 Goat Lenka', emoji: '🏆' },
];

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
      // Prefer horizontal positioning but fall back to vertical
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

function init() {
  const bank = document.getElementById('nickname-bank');

  // Populate bank with nickname cards
  nicknames.forEach((nick) => {
    bank.appendChild(createCard(nick));
  });

  // Setup all dropzones (tier rows + bank)
  document.querySelectorAll('[data-dropzone="true"]').forEach(setupDropzone);
}

init();
