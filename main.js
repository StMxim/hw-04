const API_URL = 'https://jsonplaceholder.typicode.com/users';
const usersContainer = document.getElementById('users');
const fetchBtn = document.getElementById('fetchBtn');
const fetchMoreBtn = document.getElementById('fetchMoreBtn');
const limitInput = document.getElementById('limit');

let currentPage = 1;
let totalUsers = 10; // JSONPlaceholder has 10 users
let usersPerPage = parseInt(limitInput.value, 10);

function renderUsers(users) {
    users.forEach(user => {
        const div = document.createElement('div');
        div.className = 'user-card';
        div.innerHTML = `<b>Name:</b> ${user.name}<br><b>Email:</b> ${user.email}<br><b>Company:</b> ${user.company.name}`;
        usersContainer.appendChild(div);
    });
}

function clearUsers() {
    usersContainer.innerHTML = '';
}

function updateFetchMoreBtn() {
    const totalPages = Math.ceil(totalUsers / usersPerPage);
    if (currentPage < totalPages) {
        fetchMoreBtn.style.display = 'inline-block';
        fetchMoreBtn.disabled = false;
    } else {
        fetchMoreBtn.style.display = 'inline-block';
        fetchMoreBtn.disabled = true;
        fetchMoreBtn.textContent = 'No more users';
    }
}

async function fetchUsers(page = 1, limit = 5) {
    const res = await fetch(`${API_URL}?_page=${page}&_limit=${limit}`);
    const data = await res.json();
    return data;
}

fetchBtn.addEventListener('click', async () => {
    usersPerPage = parseInt(limitInput.value, 10) || 5;
    if (!usersPerPage || usersPerPage < 1) {
        limitInput.value = 5;
        usersPerPage = 5;
    }
    currentPage = 1;
    clearUsers();
    const users = await fetchUsers(currentPage, usersPerPage);
    renderUsers(users);
    fetchBtn.textContent = 'FETCH USERS';
    fetchMoreBtn.textContent = 'FETCH MORE USERS';
    updateFetchMoreBtn();
});

fetchMoreBtn.addEventListener('click', async () => {
    currentPage++;
    const users = await fetchUsers(currentPage, usersPerPage);
    if (users.length > 0) {
        renderUsers(users);
        updateFetchMoreBtn();
    } else {
        fetchMoreBtn.disabled = true;
        fetchMoreBtn.textContent = 'No more users';
    }
});

limitInput.addEventListener('input', () => {
    fetchBtn.textContent = 'FETCH USERS';
    fetchMoreBtn.style.display = 'none';
}); 