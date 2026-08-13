# To-Do List Life Dashboard

A clean, minimalist, and responsive life dashboard web application built as part of the CodingCamp software engineering fundamental course. This dashboard helps users organize their day completely on the client-side without the need for complex server setups.

## Live Demo
https://handika27.github.io/To-Do-List-Life-Dashboard/

## Features

### Core Requirements (MVP)
* **Dynamic Greeting & Clock:** Displays the current time and a time-based greeting (Morning, Afternoon, Evening).
* **Focus Timer (Pomodoro):** A 25-minute countdown timer with start, stop, and reset functionalities to boost productivity.
* **Task Management:** Add, edit, delete, and strike-through tasks. All data persists seamlessly.
* **Quick Links:** Save and access frequently visited URLs directly from the dashboard.
* **Client-Side Storage:** Utilizes the browser's Local Storage API so all data remains saved even after refreshing or closing the browser.

### Implemented Challenges
* **Light / Dark Mode:** Integrated theme toggle that remembers the user's preference via Local Storage.
* **Custom User Name:** Users can click their name on the greeting card to personalize the dashboard.
* **Prevent Duplicate Tasks & Links:** Basic validation to ensure the to-do list remains organized without redundant entries.
* **Fully Responsive Design:** Optimized layout for both desktop and mobile screens.

## Technologies Used
* **HTML5:** Semantic structuring.
* **CSS3:** Custom styling, CSS Variables, Flexbox, and CSS Grid for layout management.
* **Vanilla JavaScript:** DOM manipulation and Local Storage integration (No external frameworks/libraries).

## Project Structure
```text
/
│── index.html
│── css/
│   └── style.css
└── js/
    └── script.js