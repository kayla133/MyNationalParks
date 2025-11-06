// 🗺️ Map & UI Elements
const map = document.getElementById('park-map');
const mapContainer = document.getElementById('map-container');
const entryForm = document.getElementById('entry-form');
const categorySelect = document.getElementById('category');
const animalSelect = document.getElementById('animal');
const photoInput = document.getElementById('photo-input');
const notesInput = document.getElementById('notes');
const locationInput = documnet.getElementById('location');
const clearButton = document.getElementById('clear-entries');

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
const saveSightings = (sightings) => localStorage.setItem('sightings', JSON.stringify(sightings));
const loadSightings = () => JSON.parse(localStorage.getItem('sightings')) || [];

// 🧹 Clear Form
function clearForm() {
  locationInput.value = '';
  categorySelect.value = '';
  animalSelect.innerHTML = '<option value="">-- Select Animal --</option>';
  photoInput.value = '';
  notesInput.value = '';
}

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

// 📍 Map click → show form
map.addEventListener('click', (e) => {
  const rect = map.getBoundingClientRect();
  clickX = ((e.clientX - rect.left) / rect.width) * 100;
  clickY = ((e.clientY - rect.top) / rect.height) * 100;
  entryForm.classList.remove('hidden');
  entryForm.classList.add('visible');
});

// 💾 Add a pin with popup
function addAnimalPin(x, y, animals, notes, photoFile) {
  const icon = document.createElement('img');
  icon.src = 'img/pin.png'; // same icon for all entries
  icon.className = 'animal-icon';
  icon.style.left = `${x}%`;
  icon.style.top = `${y}%`;

  icon.dataset.animal = animals.join(', ');
  icon.dataset.notes = notes || 'No notes';
  icon.dataset.photo = photoFile ? URL.createObjectURL(photoFile) : null;

  icon.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent map click

    // Remove existing popup
    const existing = document.querySelector('.sighting-popup');
    if (existing) existing.remove();

    const popup = document.createElement('div');
    popup.className = 'sighting-popup';

    let photoHTML = icon.dataset.photo ? `<img src="${icon.dataset.photo}" alt="Photo" style="max-width:150px; display:block; margin-top:5px;">` : '';

    popup.innerHTML = `
      <strong>Animal:</strong> ${icon.dataset.animal}<br>
      <strong>Notes:</strong> ${icon.dataset.notes}<br>
      ${photoHTML}
      <button class="close-popup">Close</button>
    `;

    document.body.appendChild(popup);

    // Close button
    popup.querySelector('.close-popup').addEventListener('click', () => popup.remove());
  });

  mapContainer.appendChild(icon);
}

// 💾 Save new entry
document.getElementById('save-entry').addEventListener('click', () => {
  const animal = animalSelect.value;
  const notes = notesInput.value;
  const photoFile = photoInput.files[0] || null;

  if (!animal) {
    alert('Please choose an animal.');
    return;
  }

  const sightings = loadSightings();
  const newSighting = { x: clickX, y: clickY, animals: [animal], notes, photoFileName: photoFile ? photoFile.name : null };
  sightings.push(newSighting);
  saveSightings(sightings);

  addAnimalPin(clickX, clickY, [animal], notes, photoFile);

  // Hide & reset form
  entryForm.classList.remove('visible');
  entryForm.classList.add('hidden');
  clearForm();
});

// 🚀 Load existing pins
window.addEventListener('DOMContentLoaded', () => {
  const sightings = loadSightings();
  sightings.forEach(s => {
    addAnimalPin(s.x, s.y, s.animals, s.notes, null); // photo not persisted yet
  });
});

// ❌ Close form if click outside
document.addEventListener('click', (e) => {
  if (!entryForm.contains(e.target) && !map.contains(e.target) && entryForm.classList.contains('visible')) {
    entryForm.classList.remove('visible');
    entryForm.classList.add('hidden');
    clearForm();
  }

  // Close popup if click outside
  const popup = document.querySelector('.sighting-popup');
  if (popup && !popup.contains(e.target)) popup.remove();
});

// 🧹 Clear all entries
clearButton.addEventListener('click', () => {
  if (confirm('Are you sure you want to clear all entries?')) {
    localStorage.removeItem('sightings');
    document.querySelectorAll('.animal-icon').forEach(icon => icon.remove());
    clearForm();
    alert('All entries cleared!');
  }
});
