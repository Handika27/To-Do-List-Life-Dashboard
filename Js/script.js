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
let userName = localStorage.getItem('userName') || 'Champion!';
if (userNameDisplay) userNameDisplay.textContent = userName;

// Update Time, Date, and Greeting
function updateDateTime() {
    const now = new Date();
    
    // Time
    const timeElem = document.getElementById('current-time');
    if (timeElem) timeElem.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    
    // Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateElem = document.getElementById('current-date');
    if (dateElem) dateElem.textContent = now.toLocaleDateString('en-US', options);
    
    // Greeting
    const hour = now.getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    
    const greetingElem = document.getElementById('greeting-message');
    if (greetingElem) {
        greetingElem.innerHTML = `${greeting}, <span id="user-name-display" style="cursor:pointer;" title="Click to change name">${userName}</span>`;
        
        // Re-attach listener after innerHTML update
        document.getElementById('user-name-display').addEventListener('click', () => {
            const newName = prompt("Enter your name:", userName);
            if (newName && newName.trim() !== "") {
                userName = newName.trim();
                localStorage.setItem('userName', userName);
                updateDateTime();
            }
        });
    }
}
setInterval(updateDateTime, 1000);
updateDateTime();

// --- 2. FOCUS TIMER (Dengan Fitur Popup Klik) ---
let timerInterval;
let customMinutes = 25; // Menyimpan durasi waktu yang disetel user
let timeLeft = customMinutes * 60; // Konversi ke detik
let isTimerRunning = false;

const timerDisplay = document.getElementById('timer-display');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnReset = document.getElementById('btn-reset');

function updateTimerDisplay() {
    if (!timerDisplay) return;
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${m}:${s}`;
}

// Fitur: Mengklik angka timer untuk mengatur waktu
if (timerDisplay) {
    timerDisplay.style.cursor = 'pointer'; // Memastikan kursor berubah jadi tangan
    timerDisplay.title = 'Click to set timer';
    
    timerDisplay.addEventListener('click', () => {
        if (isTimerRunning) {
            alert("Pause timer terlebih dahulu untuk mengubah waktu!");
            return;
        }

        let userInput = prompt("Masukkan waktu timer baru (dalam menit):", customMinutes);

        if (userInput !== null) {
            let parsedMinutes = parseInt(userInput);
            if (!isNaN(parsedMinutes) && parsedMinutes > 0) {
                customMinutes = parsedMinutes; // Simpan pengaturan terbaru
                timeLeft = customMinutes * 60; // Update sisa waktu
                updateTimerDisplay();
            } else {
                alert("Mohon masukkan angka yang valid!");
            }
        }
    });
}

if (btnStart) {
    btnStart.addEventListener('click', () => {
        if (!isTimerRunning) {
            isTimerRunning = true;
            
            // --- BEEP SAAT START (Tetap 1 detik) ---
            alarmSound.play();
            setTimeout(() => { 
                alarmSound.pause(); 
                alarmSound.currentTime = 0; 
            }, 1000);

            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                    
                    // --- REVISI: MULAI BEEP SAAT SISA 3 DETIK (00:03) ---
                    if (timeLeft === 3) {
                        alarmSound.currentTime = 0;
                        alarmSound.play();
                    }

                } else {
                    // --- SAAT WAKTU HABIS (00:00) ---
                    clearInterval(timerInterval);
                    isTimerRunning = false;
                    
                    // Langsung matikan suara secara paksa
                    alarmSound.pause();
                    alarmSound.currentTime = 0;

                    // Trik: Gunakan jeda 10 milidetik agar layar sempat berubah 
                    // menjadi "00:00" sebelum terblokir oleh popup alert
                    setTimeout(() => {
                        alert("Focus session complete!");
                    }, 10);
                }
            }, 1000);
        }
    });
}

if (btnStop) {
    btnStop.addEventListener('click', () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        
        // REVISI: Pastikan suara ikut mati jika user menekan Pause 
        // saat timer berada di detik 00:02 atau 00:01
        alarmSound.pause();
        alarmSound.currentTime = 0;
    });
}

if (btnReset) {
    btnReset.addEventListener('click', () => {
        clearInterval(timerInterval);
        isTimerRunning = false;
        
        // REVISI: Pastikan suara ikut mati saat di-Reset
        alarmSound.pause();
        alarmSound.currentTime = 0;
        
        // Kembali ke waktu yang terakhir disetel user
        timeLeft = customMinutes * 60;
        updateTimerDisplay();
    });
}

updateTimerDisplay();

// --- 3. TO-DO LIST ---
let tasks = JSON.parse(localStorage.getItem('ccse_tasks')) || [];
const taskInput = document.getElementById('task-input');
const btnAddTask = document.getElementById('btn-add-task');
const taskList = document.getElementById('task-list');

function renderTasks() {
    if (!taskList) return;
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

if (btnAddTask) {
    btnAddTask.addEventListener('click', addTask);
}
if (taskInput) {
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
}
renderTasks();

// --- 4. QUICK LINKS ---
let links = JSON.parse(localStorage.getItem('links')) || [];
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const btnAddLink = document.getElementById('btn-add-link');
const linksContainer = document.getElementById('links-container');

function renderLinks() {
    if (!linksContainer) return;
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
    // Hapus renderTasks() di sini karena tidak relevan dengan Quick Links
    renderLinks();
}

function deleteLink(index) {
    links.splice(index, 1);
    renderLinks();
}

if (btnAddLink) {
    btnAddLink.addEventListener('click', addLink);
}
renderLinks();