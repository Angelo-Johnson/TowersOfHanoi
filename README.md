Technology Choices:

1. HTML5:
        HTML5 structures the game, providing essential elements such as the disk selection interface, control buttons (Start, Pause, Restart), and the leaderboard display. It ensures cross-browser compatibility and supports accessibility features.

2. CSS3:
        CSS3 styles the application, determining the appearance and positioning of game elements like disks, rods, and buttons. It enables a responsive design that adjusts to different screen sizes, enhancing the user experience.

3. JavaScript (JS):
        JavaScript powers the interactivity and logic of the game, handling user input (drag-and-drop), game mechanics (disk movements and win condition checks), and the timer. It also manages the leaderboard by recording the fastest times and move counts.
        (Libraries: No external libraries are used, relying solely on native JavaScript.)

4.Local Storage (Browser Storage):
        Local Storage stores the leaderboard data, including disk counts and the fastest times. It ensures the leaderboard persists even if the user closes or refreshes the browser.

Application Design:

1. index.html: The primary file that contains the structure of the game, including the user interface elements like buttons and the leaderboard.

2. style.css: The stylesheet that controls the visual layout, including the design of disks, rods, and game controls.

3. script.js: Contains the JavaScript functionality, including:

4. Setting up the game elements.

5. Managing user interactions (drag-and-drop actions).

6. Handling the timer and move count.

7. Checking for game completion.

8. Updating the leaderboard in Local Storage.

The game allows players to choose the number of disks and solve the puzzle by moving disks between rods.
The number of moves and time are tracked, with the fastest time for each disk count stored in the leaderboard.
