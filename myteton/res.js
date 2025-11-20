let selectedBox = null;

const boxes = document.querySelectorAll(".box");
const modal = document.getElementById("reservationModal");
const closeModal = document.getElementById("closeModal");
const form = document.getElementById("reservationForm");

const toggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

const typeSelect = document.getElementById("type");

// Single list of types
const types = ["Camping", "Lodging", "Food", "Attraction", "Other"];

// Populate the dropdown
typeSelect.innerHTML = '<option value="">-- Select Type --</option>';
types.forEach(type => {
    const option = document.createElement("option");
    option.value = type;
    option.textContent = type;
    typeSelect.appendChild(option);
});

// Mobile menu toggle
toggle.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});

// Function to reset a box to its default state
function clearBox(box) {
    box.innerHTML = `Enter Reservation Info`;
    // Remove a class or attribute that marks it as "filled"
    box.classList.remove('filled'); 
}

// Function to handle the click event on a box
function handleBoxClick(box) {
    // Check if the box is already filled
    if (box.classList.contains('filled')) {
        // Find the 'X' element (the close icon for deletion) within the box
        const closeIcon = box.querySelector('.close-entry');

        // Check if the click target or any of its parents is the close icon
        if (event.target === closeIcon) {
            clearBox(box);
            // Stop the event from propagating further if the 'X' was clicked
            event.stopPropagation();
            return;
        } else {
            // Block the modal from opening if the box is filled and the 'X' wasn't clicked
            return; 
        }
    }

    // If not filled, open the modal
    selectedBox = box;
    modal.style.display = "block";
}

// Open modal when clicking a box, now using the new handler
boxes.forEach(box => {
    box.addEventListener("click", () => handleBoxClick(box));
});

// Close modal
closeModal.addEventListener("click", () => {
    modal.style.display = "none";
});

// Function to format YYYY-MM-DD to MM/DD/YYYY
function formatDate(dateString) {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
}

// Save reservation info to the clicked box
form.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const type = typeSelect.value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const notes = document.getElementById("notes").value;
    const photoInput = document.getElementById("photo-input");

    const formattedStart = formatDate(startDate);
    const formattedEnd = formatDate(endDate);
    
    // Function to update the box content
    const updateBoxContent = (photoHtml) => {
        selectedBox.innerHTML = `
            <div style="padding: 10px; width: 100%; height: 100%; box-sizing: border-box; position: relative;">
                <div style="font-size: 20px; font-weight: bold; line-height: 1.2;">
                    ${name}
                    <span class="close-entry" style="float: right; font-size: 24px; cursor: pointer;">&times;</span>
                </div>
                <div style="font-size: 18px; margin-bottom: 5px;">${type}</div>
                <div style="font-size: 16px; margin-bottom: 10px;">
                    ${formattedStart} - ${formattedEnd}
                </div>
                <div style="display: flex; gap: 10px; align-items: flex-start;">
                    ${photoHtml}
                    <div style="font-size: 14px; flex-grow: 1; overflow: hidden; max-height: 80px;">
                        <strong>Notes:</strong> ${notes}
                    </div>
                </div>
            </div>
        `;
        // Mark the box as filled after successful submission
        selectedBox.classList.add('filled');
        modal.style.display = "none";
        form.reset();
    };

    // Check if a photo was uploaded
    if (photoInput.files.length > 0) {
        const file = photoInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const photoSrc = e.target.result;
            const photoHtml = `<img src="${photoSrc}" alt="Reservation Photo" style="width: 80px; height: 80px; object-fit: cover; border: 2px solid #3e5e3c;">`;
            updateBoxContent(photoHtml);
        };

        reader.readAsDataURL(file);

    } else {
        // Placeholder HTML if no photo is uploaded
        const photoHtml = `
            <div style="width: 80px; height: 80px; border: 2px solid #3e5e3c; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #3e5e3c;">
                <span style="transform: rotate(45deg); position: absolute;">&times;</span>
                <span style="transform: rotate(-45deg); position: absolute;">&times;</span>
            </div>`;
        updateBoxContent(photoHtml);
    }
});

// Close modal when clicking outside
window.addEventListener("click", e => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});