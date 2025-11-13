// res.js

// Get reference to the select element
const siteSelect = document.getElementById('camp-site');

// List of available campsites
const campingSites = [
  'Gros Ventre Campground',
  'Jenny Lake Campground',
  'Signal Mountain Campground',
  'Colter Bay Campground',
  'Colter Bay Tent Village',
  'Lizard Creek Campground',
  'Headwaters Campground'
];

// Populate the dropdown
campingSites.forEach(site => {
  const option = document.createElement('option');
  option.value = site;
  option.textContent = site;
  siteSelect.appendChild(option);
});

// Optional: Handle user selection
siteSelect.addEventListener('change', () => {
  const selectedSite = siteSelect.value;
});
