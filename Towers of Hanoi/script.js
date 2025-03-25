// Global variables
let rods = [[], [], []];  // Represents the rods (arrays of disks)
let moveCount = 0;        // Counter for moves
let timer = 0;            // Timer for game duration
let gameInterval;         // Timer interval
let isGameActive = false; // To track if the game is active
let isPaused = false;     // To track if the game is paused
let moveHistory = [];     // Stack to track move history

// Start the game when "Start Game" is clicked
document.getElementById('start-game').addEventListener('click', () => {
    const diskCount = parseInt(document.getElementById('disk-count').value);
    document.getElementById('start-game').classList.add('hidden'); 
    document.getElementById('disk-count').classList.add('hidden');
    document.querySelector("label[for='disk-count']").classList.add('hidden');
    startGame(diskCount);
});


// Pause or resume the game when "Pause" is clicked
document.getElementById('pause-game').addEventListener('click', togglePauseGame);

// Undo last move
document.getElementById('undo-move').addEventListener('click', undoLastMove);

// Restart the game when "Restart" is clicked
document.getElementById('restart-game').addEventListener('click', () => {
    // Reset the game state
    moveCount = 0;
    timer = 0;
    moveHistory = [];
    rods = [[], [], []];  // Clear the rods

    // Reset the UI elements
    document.getElementById('move-count').innerText = `Moves: 0`;
    document.getElementById('timer').innerText = `Time: 0s`;
    document.getElementById('win-message').innerText = '';

    // Reset game control buttons
    isGameActive = false;
    isPaused = false;
    clearInterval(gameInterval);
    
    // Get the selected number of disks and restart the game
    const diskCount = parseInt(document.getElementById('disk-count').value);
    startGame(diskCount);
});

// Quit the game when "Quit" is clicked
document.getElementById('quit-game').addEventListener('click', () => {
    window.location.href = "index.html"; // Redirect to main menu (adjust if needed)
});

// Initialize the game
function startGame(diskCount) {
    rods = [[], [], []]; 
    moveHistory = []; 

    for (let i = diskCount; i > 0; i--) {
        rods[0].push(i);
    }
    
    moveCount = 0;
    document.getElementById('move-count').innerText = `Moves: ${moveCount}`;
    document.getElementById('timer').innerText = `Time: 0s`;
    document.getElementById('win-message').innerText = '';

    isGameActive = true;
    isPaused = false;
    clearInterval(gameInterval);
    startTimer();
    renderGame();
}

// Start the game timer
function startTimer() {
    timer = 0;
    gameInterval = setInterval(() => {
        if (!isPaused) {
            timer++;
            document.getElementById('timer').innerText = `Time: ${timer}s`;
        }
    }, 1000);
}

// Toggle pause and resume
function togglePauseGame() {
    if (!isGameActive) return;

    isPaused = !isPaused;
    document.getElementById('pause-game').innerText = isPaused ? 'Resume' : 'Pause';
}

// Render the game
function renderGame() {
    for (let i = 0; i < 3; i++) {
        const rod = document.getElementById(`rod${i + 1}`);
        rod.innerHTML = ''; // Clear rod content before re-rendering

        rods[i].forEach((disk, index) => {
            const diskElement = document.createElement('div');
            diskElement.classList.add('disk');
            diskElement.style.width = `${disk * 30}px`;
            diskElement.style.height = '20px'; // Ensure each disk has a fixed height
            diskElement.style.backgroundColor = `hsl(${disk * 50}, 80%, 50%)`; // Color disks
            diskElement.dataset.size = disk;
            diskElement.dataset.rod = i;
            diskElement.draggable = isGameActive; // Disable dragging if the game is over

            // Stack disks directly without any gap
            diskElement.style.bottom = `${index * 0}px`; // Remove the gap, so disks are exactly stacked

            // Add event listener for drag
            if (isGameActive) {
                diskElement.addEventListener('dragstart', dragStart);
            }

            rod.appendChild(diskElement);
        });
    }
}

// Drag functions
function allowDrop(event) {
    if (!isGameActive) return;
    event.preventDefault();
}

function dragStart(event) {
    if (isPaused || !isGameActive) return;
    event.dataTransfer.setData("diskSize", event.target.dataset.size);
    event.dataTransfer.setData("fromRod", event.target.dataset.rod);
}

function drop(event) {
    event.preventDefault();
    if (isPaused || !isGameActive) return;

    const diskSize = parseInt(event.dataTransfer.getData("diskSize"));
    const fromRod = parseInt(event.dataTransfer.getData("fromRod"));
    const toRod = parseInt(event.target.id.replace("rod", "")) - 1;

    if (fromRod !== toRod && (rods[toRod].length === 0 || rods[toRod][rods[toRod].length - 1] > diskSize)) {
        rods[fromRod].pop();
        rods[toRod].push(diskSize);
        moveHistory.push({ diskSize, fromRod, toRod });
        moveCount++;
        document.getElementById('move-count').innerText = `Moves: ${moveCount}`;
        checkWinCondition();
        renderGame();
    }
}

// Check for win condition
function checkWinCondition() {
    const totalDisks = rods[0].length + rods[1].length + rods[2].length;

    if (rods[2].length === totalDisks) { 
        clearInterval(gameInterval);
        document.getElementById('win-message').innerText = 'You have won! 🎉';
        isGameActive = false;

        // Save player score (moves, time, and disk count)
        saveScore(parseInt(document.getElementById('disk-count').value), moveCount, timer); // Save moves, time, and selected disk count
    }
}

// Undo last move
function undoLastMove() {
    if (moveHistory.length === 0) return;

    const lastMove = moveHistory.pop();
    rods[lastMove.fromRod].push(lastMove.diskSize);
    rods[lastMove.toRod].pop();

    moveCount--;
    document.getElementById('move-count').innerText = `Moves: ${moveCount}`;
    renderGame();
}

// Disable game after winning
function disableGame() {
    document.getElementById('pause-game').disabled = true;
    document.getElementById('undo-move').disabled = true;

    const disks = document.querySelectorAll('.disk');
    disks.forEach(disk => disk.draggable = false);
}
// Save player score (moves, disk count & time)
function saveScore(diskCount, moves, time) {
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};

    // Create a new entry if it doesn't exist, or update if the time is better
    if (!leaderboard[diskCount] || time < leaderboard[diskCount].time) {
        leaderboard[diskCount] = {
            moves: moves,
            time: time
        };
    }

    // Save the updated leaderboard to localStorage
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    updateLeaderboard();
}
// Update the leaderboard on the screen
function updateLeaderboard() {
    const leaderboardTable = document.querySelector("#leaderboard tbody");
    leaderboardTable.innerHTML = ""; // Clear previous leaderboard entries

    // Retrieve the leaderboard from localStorage
    let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || {};

    // Populate the table with the best times and moves for each number of disks
    Object.keys(leaderboard).sort((a, b) => a - b).forEach(diskCount => {
        let row = leaderboardTable.insertRow();
        row.insertCell(0).innerText = diskCount;  // Number of disks
        row.insertCell(1).innerText = leaderboard[diskCount].moves;  // Number of moves
        row.insertCell(2).innerText = leaderboard[diskCount].time + "s";  // Fastest time in seconds
    });
}
