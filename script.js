// Select trash items and bins
const trashItems = document.querySelectorAll(".trash");
const bins = document.querySelectorAll(".bin");

// Add drag event listeners to trash items
trashItems.forEach((item) => {
    item.addEventListener("dragstart", dragStart);
    item.addEventListener("dragend", dragEnd);
});

// Add drag event listeners to bins
bins.forEach((bin) => {
    bin.addEventListener("dragover", dragOver);
    bin.addEventListener("drop", drop);
});

// Sound effects
const correctSound = new Audio("Sounds/ding.mp3");
const wrongSound = new Audio("Sounds/oomph.mp3");

// Score variables
let score = 0;
const sortedCounts = { plastic: 0, paper: 0, metal: 0, glass: 0 };
const totalTrashCounts = {
    plastic: document.querySelectorAll('[id^="plastic"]').length,
    paper: document.querySelectorAll('[id^="paper"]').length,
    metal: document.querySelectorAll('[id^="metal"]').length,
    glass: document.querySelectorAll('[id^="glass"]').length
};

// Function to update score
function updateScore(points) {
    score += points;
    document.getElementById("score").textContent = score;
}

// Drag functions
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
}

function dragEnd(event) {
    event.target.classList.remove("dragging");
}

// Allow dropping
function dragOver(event) {
    event.preventDefault();
}

// Drop function
function drop(event) {
    event.preventDefault();

    const trashId = event.dataTransfer.getData("text/plain");
    const trashItem = document.getElementById(trashId);

    if (!trashItem) {
        console.error("Error: Trash item not found!");
        return;
    }

    // Extract type from ID (e.g., "plastic_1" -> "plastic")
    const trashType = trashId.split("_")[0];

    // Get the correct bin (handle case where target is bin image)
    const bin = event.target.closest(".bin");

    if (!bin) {
        console.error("Error: Bin not found!");
        return;
    }

    const binId = bin.id;

    console.log(`Dropped ${trashId} into ${binId}`);

    // Check if dropped into the correct bin
    if (binId.startsWith(trashType)) { 
        bin.appendChild(trashItem); 
        correctSound.play(); 
        bin.classList.add("success-bin");

        updateScore(1);
        sortedCounts[trashType]++;

        // Create or update the info box
        let infoBox = bin.querySelector(".info-box");
        if (!infoBox) {
            infoBox = document.createElement("div");
            infoBox.classList.add("info-box");
            bin.appendChild(infoBox);
        }

        // Set split info text (1st part for 1st item, 2nd part for 2nd item)
        const materialInfo = {
            plastic: ["Plastic takes hundreds of years to decompose.", "Recycling helps reduce pollution!"],
            paper: ["Paper is made from trees.", "Recycling saves forests and reduces waste."],
            metal: ["Metal is highly recyclable.", "It can be melted and reused many times."],
            glass: ["Glass is 100% recyclable.", "It can be reused without losing quality."]
        };

        // Show different info based on the count
        const infoIndex = sortedCounts[trashType] - 1; // 0 for first item, 1 for second item
        infoBox.textContent = materialInfo[trashType][infoIndex] || "Unknown material.";
        infoBox.style.display = "block";

        console.log(`Info Box Displayed: ${infoBox.textContent}`);

        // Hide info box after 3 seconds
        setTimeout(() => {
            infoBox.style.display = "none";
        }, 3000);

        // Bonus for sorting all of one type
        if (sortedCounts[trashType] === totalTrashCounts[trashType]) {
            updateScore(5);
            alert(`Bonus! You sorted all ${trashType} items!`);
        }

        // Remove trash after animation
        setTimeout(() => {
            bin.classList.remove("success-bin");
            trashItem.remove();
        }, 500);
    } else {
        // Incorrect bin
        wrongSound.play();
        bin.classList.add("error-bin");
        updateScore(-1);

        setTimeout(() => {
            bin.classList.remove("error-bin");
        }, 1000);
    }
}
