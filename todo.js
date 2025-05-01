// Replace with your actual mockapi.io endpoint!
const API_URL = 'https://68135101129f6313e210e6d5.mockapi.io/todos';

const tasksList = document.getElementById('tasksList');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');
const emptyMsg = document.getElementById('emptyMsg');

let tasks = [];
let currentFilter = 'all';

async function fetchTasks() {
    const res = await fetch(API_URL);
    tasks = await res.json();
    renderTasks();
}

async function addTask(title) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, completed: false })
    });
    const newTask = await res.json();
    tasks.push(newTask);
    renderTasks();
}

async function deleteTask(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

async function toggleTask(id, completed) {
    await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed })
    });
    const task = tasks.find(t => t.id === id);
    if (task) task.completed = completed;
    renderTasks();
}

function renderTasks() {
    let filtered = tasks;
    if (currentFilter === 'active') filtered = tasks.filter(t => !t.completed);
    if (currentFilter === 'completed') filtered = tasks.filter(t => t.completed);

    tasksList.innerHTML = '';
    if (filtered.length === 0) {
        emptyMsg.style.display = 'block';
    } else {
        emptyMsg.style.display = 'none';
        filtered.forEach(task => {
            const li = document.createElement('li');
            li.className = 'task-item' + (task.completed ? ' completed' : '');
            li.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="task-title">${task.title}</span>
                <button class="delete-btn" title="Delete">&times;</button>
            `;
            const checkbox = li.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTask(task.id, checkbox.checked));
            li.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
            tasksList.appendChild(li);
        });
    }
    updateStatusBar();
}

function updateStatusBar() {
    const active = tasks.filter(t => !t.completed).length;
    const completed = tasks.filter(t => t.completed).length;
    activeCount.textContent = `Active: ${active}`;
    completedCount.textContent = `Completed: ${completed}`;
}

addTaskBtn.addEventListener('click', () => {
    const title = taskInput.value.trim();
    if (title) {
        addTask(title);
        taskInput.value = '';
        addTaskBtn.disabled = true;
    }
});

taskInput.addEventListener('input', () => {
    addTaskBtn.disabled = taskInput.value.trim().length === 0;
});

taskInput.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !addTaskBtn.disabled) {
        addTaskBtn.click();
    }
});

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

fetchTasks(); 