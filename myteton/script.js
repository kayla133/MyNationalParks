const map = document.getElementById('park-map');
map.addEventListener('click', (e) => {
  const rect = map.getBoundingClientRect();
  const x = ((e.clientX - rect.left) / rect.width) * 100;
  const y = ((e.clientY - rect.top) / rect.height) * 100;
  console.log(`Clicked at ${x.toFixed(2)}%, ${y.toFixed(2)}%`);
});

const animalsByCategory = {
  mammals: [
    'Badgers',
    'Beaver',
    'Bison',
    'Black Bear',
    'Chipmunks',
    'Elk',
    'Golden Manteled Ground Squirrels',
    'Grizzly Bear',
    'Long-Tailed Weasels',
    'Moose',
    'Mountain Lion',
    'Muskrat',
    'Mule Deer',
    'Pikas',
    'Pine Martens',
    'Pronghorn',
    'Red Squirrels',
    'River Otter',
    'Uinta Ground Squirrels',
    'Wolf',
    'Wolverines',
    'Yellow-Bellied Marmots'
  ],

  birds: [
    'American White Pelican',
    'Bald Eagle',
    'Black-Billed Magpie',
    'Chickadee',
    "Clark's Nutcracker",
    'Goldeneye',
    'Great-Horned Owl',
    'Grey Jay',
    'Osprey',
    'Pine Grosbeak',
    'Raven',
    'Sandhill Crane',
    'Trumpeter Swan'
  ],
  reptiles: [
    'Bullsnake',
    'Gartersnake',
    'Northern Rubber Boa',
    'Nothern Sagebrush Lizard',
    'Valley Gartersnake'
  ],

  fish: [
    'Brown Trout',
    'Green Sucker',
    'Leatherside Chub',
    'Longnose Dace',
    'Moutain Sucker',
    'Mountain Whitefish',
    'Paiute Sculpin',
    'Rainbow Trout',
    'Redside Shiner',
    'Snake River Fine Spotted Cutthroat Trout',
    'Speckled Dace',
    'Utah Chub',
    'Utah Sucker',
    'Yellowstone Cutthroat Trout'
  ]

};



function saveSightings(sightings) {
  localStorage.setItem('sightings', JSON.stringify(sightings));
}

function loadSightings() {
  return JSON.parse(localStorage.getItem('sightings')) || [];
}

function addAnimalIcon(x, y, animal) {
  const icon = document.createElement('img');
  icon.src = `icons/${animal.toLowerCase()}.png`;
  icon.className = 'animal-icon';
  icon.style.left = `${x}%`;
  icon.style.top = `${y}%`;
  document.getElementById('map-container').appendChild(icon);
}



window.addEventListener('DOMContentLoaded', () => {
  const sightings = loadSightings();
  sightings.forEach(s => {
    s.animals.forEach(animal => addAnimalIcon(s.x, s.y, animal));
  });
});



