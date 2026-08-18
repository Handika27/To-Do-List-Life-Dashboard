// --- 1. THEME & GREETING SETUP ---
const themeToggleBtn = document.getElementById('theme-toggle');
const userNameDisplay = document.getElementById('user-name-display');
const alarmSound = new Audio('https://assets.mixkit.co/active_storage/sfx/989/989-preview.mp3');

// Initialize Theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
});

// Initialize Custom Name
let userName = localStorage.getItem('userName') || 'Handika';
userNameDisplay.textContent = userName;

userNameDisplay.addEventListener('click', () => {
    const newName = prompt("Enter your name:");
    if (newName && newName.trim() !== "") {
        userName = newName.trim();
        userNameDisplay.textContent = userName;
        localStorage.setItem('userName', userName);
    }
});

// Update Time, Date, and Greeting
function updateDateTime() {
    const now = new Date();
    
    // Time
    document.getElementById('current-time').textContent = now.toLocaleTimeString('en-US', { hour12: false });
    
    // Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = now.toLocaleDateString('en-US', options);
    
    // Greeting
    const hour = now.getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    
    document.getElementById('greeting-message').innerHTML = `${greeting}, <span id="user-name-display" style="cursor:pointer;" title="Click to change name">${userName}</span>`;
    
    // Re-attach listener after innerHTML update
    document.getElementById('user-name-display').addEventListener('click', () => {
        const newName = prompt("Enter your name:");
        if (newName && newName.trim() !== "") {
            userName = newName.trim();
            localStorage.setItem('userName', userName);
            updateDateTime();
        }
    });
}
setInterval(updateDateTime, 1000);
updateDateTime();

// --- 2. FOCUS TIMER ---
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isTimerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');

function updateTimerDisplay() {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

btnStart.addEventListener('click', () => {
    if (!isTimerRunning) {
        isTimerRunning = true;
        // --- BEEP SAAT START ---
        alarmSound.play();
        setTimeout(() => { 
            alarmSound.pause(); 
            alarmSound.currentTime = 0; 
        }, 1000);

        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateTimerDisplay();
            } else {
                clearInterval(timerInterval);
                isTimerRunning = false;
                // --- BEEP SAAT SELESAI (00:00) ---
                alarmSound.play();
                setTimeout(() => {
                    alarmSound.pause();
                    alarmSound.currentTime = 0;
                }, 3000);
                
                alert("Focus session complete!");
            }
        }, 1000);
    }
});

btnStop.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
});

btnReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timeLeft = 25 * 60;
    updateTimerDisplay();
});
updateTimerDisplay();

// --- 3. TO-DO LIST ---
let tasks = JSON.parse(localStorage.getItem('ccse_tasks')) || [];
const taskInput = document.getElementById('task-input');
const btnAddTask = document.getElementById('btn-add-task');
const taskList = document.getElementById('task-list');

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        const contentDiv = document.createElement('div');
        contentDiv.className = `task-content ${task.done ? 'done' : ''}`;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.done;
        checkbox.addEventListener('change', () => toggleTask(index));
        
        const span = document.createElement('span');
        span.textContent = task.text;
        
        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(span);
        
        const actionsDiv = document.createElement('div');
        
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'btn btn-secondary';
        editBtn.style.marginRight = '5px';
        editBtn.style.padding = '5px 10px';
        editBtn.addEventListener('click', () => editTask(index));
        
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        
        li.appendChild(contentDiv);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);
    });
    localStorage.setItem('ccse_tasks', JSON.stringify(tasks));
}

function addTask() {
    const text = taskInput.value.trim();
    if (text === '') return;
    
    // Challenge: Prevent duplicate tasks
    if (tasks.some(t => t.text.toLowerCase() === text.toLowerCase())) {
        alert("This task already exists!");
        return;
    }
    
    tasks.push({ text, done: false });
    taskInput.value = '';
    renderTasks();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    renderTasks();
}

function editTask(index) {
    const newText = prompt("Edit task:", tasks[index].text);
    if (newText !== null && newText.trim() !== '') {
        // Prevent duplicate when editing
        if (tasks.some((t, i) => i !== index && t.text.toLowerCase() === newText.trim().toLowerCase())) {
            alert("This task already exists!");
            return;
        }
        tasks[index].text = newText.trim();
        renderTasks();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    renderTasks();
}

btnAddTask.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});
renderTasks();

// --- 4. QUICK LINKS ---
let links = JSON.parse(localStorage.getItem('links')) || [];
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const btnAddLink = document.getElementById('btn-add-link');
const linksContainer = document.getElementById('links-container');

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach((link, index) => {
        const linkElem = document.createElement('a');
        linkElem.href = link.url;
        linkElem.target = '_blank';
        linkElem.className = 'link-tag';
        linkElem.textContent = link.name;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.innerHTML = '&times;';
        deleteBtn.className = 'delete-link';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent opening the link when deleting
            deleteLink(index);
        });
        
        linkElem.appendChild(deleteBtn);
        linksContainer.appendChild(linkElem);
    });
    localStorage.setItem('links', JSON.stringify(links));
}

function addLink() {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();
    
    if (name === '' || url === '') return;
    
    // Simple fix for URL without http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    links.push({ name, url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    renderTasks(); // To clear task input focus if any
    renderLinks();
}

function deleteLink(index) {
    links.splice(index, 1);
    renderLinks();
}

btnAddLink.addEventListener('click', addLink);
renderLinks();