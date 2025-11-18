let selectedBox = null;

const boxes = document.querySelectorAll(".box");
const modal = document.getElementById("reservationModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("reservationForm");

const toggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

toggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});



// Open modal when user clicks a box
boxes.forEach(box => {
    box.addEventListener("click", () => {
        selectedBox = box;
        modal.style.display = "block";
    });
});

// Close modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Save form info to the clicked box
form.addEventListener("submit", function(event) {
    event.preventDefault();

    let name = document.getElementById("name").value;
    let start = document.getElementById("startDate").value;
    let end = document.getElementById("endDate").value;

    selectedBox.innerHTML = `
        <strong>${name}</strong><br>
        ${start} → ${end}
    `;

    // Close modal
    modal.style.display = "none";

    // Clear form
    form.reset();
});

// Close modal if clicking outside modal content
window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});
