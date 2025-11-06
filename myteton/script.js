// 🗺️ Map & UI Elements
const map = document.getElementById('park-map');
const mapContainer = document.getElementById('map-container');
const entryForm = document.getElementById('entry-form');
const categorySelect = document.getElementById('category');
const animalSelect = document.getElementById('animal');
const photoInput = document.getElementById('photo-input');
const notesInput = document.getElementById('notes');

let clickX, clickY;

// 🦓 Animal Data by Category
const animalsByCategory = {
  mammals: [
    'Badgers', 'Beaver', 'Bison', 'Black Bear', 'Chipmunks', 'Elk',
    'Golden Manteled Ground Squirrels', 'Grizzly Bear', 'Long-Tailed Weasels',
    'Moose', 'Mountain Lion', 'Muskrat', 'Mule Deer', 'Pikas', 'Pine Martens',
    'Pronghorn', 'Red Squirrels', 'River Otter', 'Uinta Ground Squirrels',
    'Wolf', 'Wolverines', 'Yellow-Bellied Marmots'
  ],
  birds: [
    'American White Pelican', 'Bald Eagle', 'Black-Billed Magpie', 'Chickadee',
    "Clark's Nutcracker", 'Goldeneye', 'Great-Horned Owl', 'Grey Jay', 'Osprey',
    'Pine Grosbeak', 'Raven', 'Sandhill Crane', 'Trumpeter Swan'
  ],
  reptiles: [
    'Bullsnake', 'Gartersnake', 'Northern Rubber Boa', 'Nothern Sagebrush Lizard',
    'Valley Gartersnake'
  ],
  fish: [
    'Brown Trout', 'Green Sucker', 'Leatherside Chub', 'Longnose Dace',
    'Mountain Sucker', 'Mountain Whitefish', 'Paiute Sculpin', 'Rainbow Trout',
    'Redside Shiner', 'Snake River Fine Spotted Cutthroat Trout', 'Speckled Dace',
    'Utah Chub', 'Utah Sucker', 'Yellowstone Cutthroat Trout'
  ]
};

// 💾 Local Storage Helpers
function saveSightings(sightings) {
  localStorage.setItem('sightings', JSON.stringify(sightings));
}

function loadSightings() {
  return JSON.parse(localStorage.getItem('sightings')) || [];
}

// 📍 Add map pin (with tooltip)
function addMapPin(x, y, animals, notes) {
  const pin = document.createElement('img');
  pin.src = 'img/pin.png'; // Universal icon
  pin.className = 'map-pin';
  pin.style.left = `${x}%`;
  pin.style.top = `${y}%`;

  // Tooltip container
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.innerHTML = `
    <strong>${animals.join(', ')}</strong><br>
    ${notes ? notes : '<em>No notes added</em>'}
  `;
  pin.appendChild(tooltip);

  // Show tooltip on hover
  pin.addEventListener('mouseenter', () => tooltip.classList.add('visible'));
  pin.addEventListener('mouseleave', () => tooltip.classList.remove('visible'));

  mapContainer.appendChild(pin);
}

// 📍 Map click → show form
map.addEventListener('click', (e) => {
  const rect = map.getBoundingClientRect();
  clickX = ((e.clientX - rect.left) / rect.width) * 100;
  clickY = ((e.clientY - rect.top) / rect.height) * 100;

  entryForm.classList.remove('hidden');
  entryForm.classList.add('visible');
});

// 🧩 Populate animal dropdown
categorySelect.addEventListener('change', () => {
  const category = categorySelect.value;
  animalSelect.innerHTML = '<option value="">-- Select Animal --</option>';

  if (category && animalsByCategory[category]) {
    animalsByCategory[category].forEach(animal => {
      const option = document.createElement('option');
      option.value = animal;
      option.textContent = animal;
      animalSelect.appendChild(option);
    });
  }
});

// 🧹 Clear the form
function clearForm() {
  categorySelect.value = '';
  animalSelect.innerHTML = '<option value="">-- Select Animal --</option>';
  photoInput.value = '';
  notesInput.value = '';
}

// 💾 Save new entry
document.getElementById('save-entry').addEventListener('click', () => {
  const animal = animalSelect.value;
  const notes = notesInput.value;
  const photo = photoInput.files[0] ? photoInput.files[0].name : null;

  if (!animal) {
    alert('Please choose an animal.');
    return;
  }

  const sightings = loadSightings();
  const newSighting = { x: clickX, y: clickY, animals: [animal], notes, photo };

  sightings.push(newSighting);
  saveSightings(sightings);
  addMapPin(clickX, clickY, [animal], notes);

  // Hide form with fade-out
  entryForm.classList.remove('visible');
  entryForm.classList.add('hidden');
  clearForm();
});

// 🚀 Load existing pins
window.addEventListener('DOMContentLoaded', () => {
  const sightings = loadSightings();
  sightings.forEach(s => addMapPin(s.x, s.y, s.animals, s.notes));
});

// ❌ Click outside form → close it
document.addEventListener('click', (e) => {
  const isClickInsideForm = entryForm.contains(e.target);
  const isClickOnMap = map.contains(e.target);

  if (!isClickInsideForm && !isClickOnMap && entryForm.classList.contains('visible')) {
    entryForm.classList.remove('visible');
    entryForm.classList.add('hidden');
    clearForm();
  }
});

document.getElementById('clear-entries').addEventListener('click', () => {
  // Confirm with the user before deleting
  if (confirm('Are you sure you want to clear all entries?')) {
    // Clear saved data
    localStorage.removeItem('sightings');

    // Remove all pins from the map
    const icons = document.querySelectorAll('.animal-icon');
    icons.forEach(icon => icon.remove());

    alert('All entries have been cleared!');
  }
});
document.getElementById('clear-entries').addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all entries?')) {
    // 1. Remove all saved sightings
    localStorage.removeItem('sightings');

    // 2. Remove all pins/icons from the map
    document.querySelectorAll('.animal-icon').forEach(icon => icon.remove());

    // 3. Reset and hide the form (if it exists)
    const form = document.getElementById('animal-form');
    if (form) {
      form.reset();
      form.style.display = 'none';
    }

    // 4. Alert confirmation
    alert('All entries have been cleared!');
  }
});

