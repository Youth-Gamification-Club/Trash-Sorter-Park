// Select all trash items and bins
const trashItems = document.querySelectorAll('.trash');
const bins = document.querySelectorAll('.bin');

// Trash item info
const trashInfo = {
    plastic_1: "Plastic bottles are recyclable and can be turned into new bottles or clothing!",
    plastic_2: "Plastic bags should be recycled at special drop-off locations, not in regular bins.",
    paper_1: "Paper bags are biodegradable and easily recyclable into new paper products.",
    paper_2: "Recycling paper saves energy and reduces the need for cutting down trees.",
    metal_1: "Metal cans are highly recyclable and can be endlessly reused without losing quality.",
    metal_2: "Recycling aluminum cans saves up to 95% of the energy needed to produce new ones.",
    glass_1: "Glass bottles can be recycled infinitely without losing quality.",
    glass_2: "Glass jars are perfect for recycling or repurposing as storage containers."
};

// Add drag event listeners to trash items
trashItems.forEach(item => {
    item.addEventListener('dragstart', dragStart);
    item.addEventListener('dragend', dragEnd);
});

// Add drag event listeners to bins
bins.forEach(bin => {
    bin.addEventListener('dragover', dragOver);
    bin.addEventListener('drop', drop);
});

// Select the audio elements for the sound effects
const correctSound = new Audio('Sounds/ding.mp3');
const wrongSound = new Audio('Sounds/oomph.mp3');

// Score and tracking variables
let score = 0;
var sortedCounts = {
    plastic: 0,
    paper: 0,
    metal: 0,
    glass: 0
};
const totalTrashCounts = {
    plastic: document.querySelectorAll('[id^="plastic"]').length,
    paper: document.querySelectorAll('[id^="paper"]').length,
    metal: document.querySelectorAll('[id^="metal"]').length,
    glass: document.querySelectorAll('[id^="glass"]').length
};

// Update score on the scoreboard
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

// Dragging functions
function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

// Dropping functions
function dragOver(event) {
    event.preventDefault(); // Allows dropping
}

// Show info modal
function showInfo(trashId) {
    const modal = document.getElementById('info-modal');
    const infoText = document.getElementById('info-text');
    infoText.textContent = trashInfo[trashId] || "No information available.";
    modal.classList.remove('hidden');
}

// Close modal
document.getElementById('close-info').addEventListener('click', () => {
    document.getElementById('info-modal').classList.add('hidden');
});

// Drag-and-drop logic
document.querySelectorAll('.trash').forEach(item => {
    item.addEventListener('dragend', (event) => {
        const trashId = event.target.id;
        const binId = event.target.closest('.bin')?.id;
        
        if (binId && isCorrectBin(trashId, binId)) {
            updateScore(10); // Assume `updateScore` handles score
            showInfo(trashId); // Show information
        }
    });
});

// Helper function to check if the trash is in the correct bin
function isCorrectBin(trashId, binId) {
    // Add logic to match trash items to bins
    const binMapping = {
        plastic_1: "plastic-bin",
        plastic_2: "plastic-bin",
        paper_1: "paper-bin",
        paper_2: "paper-bin",
        metal_1: "metal-bin",
        metal_2: "metal-bin",
        glass_1: "glass-bin",
        glass_2: "glass-bin"
    };
    return binMappin

function drop(event) {
    event.preventDefault();
    const trashId = event.dataTransfer.getData('text/plain');
    const trashItem = document.getElementById(trashId);

    // Extract the trash type (e.g., "plastic_1" -> "plastic")
    const trashType = trashId.split('_')[0];

    // Get the bin's id, ensuring we select the parent bin container if an image is the target
    const bin = event.target.classList.contains('bin') ? event.target : event.target.closest('.bin');
    const binId = bin.id;

    // Check if the bin matches the trash type
    if (binId.startsWith(trashType)) { // Match "plastic" with "plastic-bin"
        // Correct bin: add trash to bin, play correct sound, and give success feedback
        bin.appendChild(trashItem); // Add the trash to the bin
        correctSound.play(); // Play correct sound (ding)
        bin.classList.add('success-bin'); // Add green glow

        // Update score for correct sort
        updateScore(1);

        // Track sorted items
        sortedCounts[trashType]++;
        console.log(`Sorted ${trashType}: ${sortedCounts[trashType]}/${totalTrashCounts[trashType]}`);

        // Check if all items of the current type have been sorted
        if (sortedCounts[trashType] === totalTrashCounts[trashType]) {
            // Award bonus points for sorting all items of this type
            updateScore(5);
            alert(`Bonus! You sorted all ${trashType} items!`);
        }

        // Remove trash item after a short delay
        setTimeout(() => {
            bin.classList.remove('success-bin'); // Reset glow
            trashItem.remove(); // Remove the trash item from the DOM
        }, 500); // Remove trash after 500ms for a smoother transition
    } else {
        // Incorrect bin: show error feedback
        wrongSound.play(); // Play wrong sound (oomph)
        bin.classList.add('error-bin'); // Add red glow
        updateScore(-1); // Deduct score for incorrect sort
        setTimeout(() => {
            bin.classList.remove('error-bin'); // Reset glow
        }, 1000); // The red aura will stay for 1 second
    }
}
