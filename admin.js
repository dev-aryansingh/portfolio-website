const API = 'http://localhost:5000';

let allMessages    = [];
let currentFilter  = 'all';
let dailyChart     = null;
let hourlyChart    = null;
let pendingDeleteId = null;
let replyTargetId   = null;

// ─── Login ────────────────────────────────────────────────────────────────────
document.getElementById('loginBtn').addEventListener('click', handleLogin);
document.getElementById('adminPassword').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
});

async function handleLogin() {
    const password = document.getElementById('adminPassword').value.trim();
    const btnText  = document.getElementById('loginBtnText');
    const spinner  = document.getElementById('loginSpinner');
    const errorBox = document.getElementById('loginError');

    if (!password) return;

    btnText.style.display  = 'none';
    spinner.style.display  = 'inline-block';
    errorBox.style.display = 'none';

    try {
        const res  = await fetch(`${API}/admin/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ password })
        });
        const data = await res.json();

        if (res.ok && data.token) {
            sessionStorage.setItem('adminToken', data.token);
            showDashboard();
        } else {
            showLoginError();
        }
    } catch {
        showLoginError('Server unreachable. Is it running?');
    } finally {
        btnText.style.display = 'inline';
        spinner.style.display = 'none';
    }
}

function showLoginError(msg = 'Invalid password') {
    const errorBox = document.getElementById('loginError');
    errorBox.innerHTML     = `<i class="fa-solid fa-circle-exclamation"></i> ${msg}`;
    errorBox.style.display = 'block';
}

// ─── Show Dashboard ───────────────────────────────────────────────────────────
function showDashboard() {
    document.getElementById('loginPage').style.display     = 'none';
    document.getElementById('dashboardPage').style.display = 'flex';
    loadMessages();
}

// ─── Logout ───────────────────────────────────────────────────────────────────
document.getElementById('logoutBtn').addEventListener('click', () => {
    sessionStorage.removeItem('adminToken');
    document.getElementById('dashboardPage').style.display = 'none';
    document.getElementById('loginPage').style.display     = 'flex';
    document.getElementById('adminPassword').value = '';
});

// ─── Sidebar Navigation ───────────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', e => {
        e.preventDefault();
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const section = item.dataset.section;
        document.getElementById('sectionTitle').textContent =
            section === 'overview' ? 'Overview' : 'Messages';
        document.getElementById('overviewSection').style.display  = section === 'overview' ? 'block' : 'none';
        document.getElementById('messagesSection').style.display  = section === 'messages'  ? 'block' : 'none';
    });
});

// ─── Refresh ──────────────────────────────────────────────────────────────────
document.getElementById('refreshBtn').addEventListener('click', loadMessages);

// ─── Load Messages ────────────────────────────────────────────────────────────
async function loadMessages() {
    const token = sessionStorage.getItem('adminToken');

    try {
        const res = await fetch(`${API}/admin/messages`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 401) {
            sessionStorage.removeItem('adminToken');
            document.getElementById('dashboardPage').style.display = 'none';
            document.getElementById('loginPage').style.display     = 'flex';
            return;
        }

        allMessages = await res.json();
        updateStats(allMessages);
        renderCharts(allMessages);
        applyFilter();
        updateUnreadBadge();

    } catch (err) {
        console.error('Failed to load messages:', err);
    }
}

// ─── Stats ────────────────────────────────────────────────────────────────────
function updateStats(messages) {
    const now     = new Date();
    const today   = now.toDateString();
    const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);

    const unreadCount = messages.filter(m => !m.read).length;
    const todayCount  = messages.filter(m => new Date(m.createdAt).toDateString() === today).length;
    const uniqueCount = new Set(messages.map(m => m.email.toLowerCase())).size;

    animateCount('totalMessages',  messages.length);
    animateCount('unreadMessages', unreadCount);
    animateCount('todayMessages',  todayCount);
    animateCount('uniqueSenders',  uniqueCount);
}

function animateCount(elId, target) {
    const el  = document.getElementById(elId);
    const dur = 600;
    const step = (timestamp, startTime) => {
        const progress = Math.min((timestamp - startTime) / dur, 1);
        el.textContent = Math.floor(progress * target);
        if (progress < 1) requestAnimationFrame(t => step(t, startTime));
        else el.textContent = target;
    };
    requestAnimationFrame(t => step(t, t));
}

function updateUnreadBadge() {
    const unread = allMessages.filter(m => !m.read).length;
    const badge  = document.getElementById('sidebarUnread');
    if (unread > 0) {
        badge.textContent    = unread;
        badge.style.display  = 'inline-block';
    } else {
        badge.style.display  = 'none';
    }
}

// ─── Filter ───────────────────────────────────────────────────────────────────
document.getElementById('filterAll').addEventListener('click', () => {
    currentFilter = 'all';
    document.getElementById('filterAll').classList.add('active');
    document.getElementById('filterUnread').classList.remove('active');
    applyFilter();
});

document.getElementById('filterUnread').addEventListener('click', () => {
    currentFilter = 'unread';
    document.getElementById('filterUnread').classList.add('active');
    document.getElementById('filterAll').classList.remove('active');
    applyFilter();
});

function applyFilter() {
    const filtered = currentFilter === 'unread'
        ? allMessages.filter(m => !m.read)
        : allMessages;

    const q = document.getElementById('searchInput').value.toLowerCase();
    const searched = q
        ? filtered.filter(m =>
            m.name.toLowerCase().includes(q) ||
            m.email.toLowerCase().includes(q) ||
            m.message.toLowerCase().includes(q))
        : filtered;

    renderTable(searched);
}

// ─── Search ───────────────────────────────────────────────────────────────────
document.getElementById('searchInput').addEventListener('input', applyFilter);

// ─── Charts ───────────────────────────────────────────────────────────────────
function renderCharts(messages) {
    renderDailyChart(messages);
    renderHourlyChart(messages);
}

function renderDailyChart(messages) {
    const days   = [];
    const counts = {};

    for (let i = 13; i >= 0; i--) {
        const d   = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        days.push(key);
        counts[key] = 0;
    }

    messages.forEach(m => {
        const key = new Date(m.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
        if (counts[key] !== undefined) counts[key]++;
    });

    const ctx = document.getElementById('messagesChart').getContext('2d');
    if (dailyChart) dailyChart.destroy();

    dailyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels:   days,
            datasets: [{
                label:           'Messages',
                data:            days.map(d => counts[d]),
                backgroundColor: 'rgba(46, 204, 113, 0.3)',
                borderColor:     'rgba(46, 204, 113, 0.9)',
                borderWidth:     1,
                borderRadius:    6,
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.4)', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

function renderHourlyChart(messages) {
    const hours  = Array.from({ length: 24 }, (_, i) => `${i}:00`);
    const counts = new Array(24).fill(0);
    messages.forEach(m => { counts[new Date(m.createdAt).getHours()]++; });

    const ctx = document.getElementById('hourlyChart').getContext('2d');
    if (hourlyChart) hourlyChart.destroy();

    hourlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels:   hours,
            datasets: [{
                label:           'Messages',
                data:            counts,
                borderColor:     'rgba(46, 204, 113, 0.9)',
                backgroundColor: 'rgba(46, 204, 113, 0.08)',
                borderWidth:     2,
                pointRadius:     3,
                pointBackgroundColor: 'rgba(46, 204, 113, 1)',
                fill:    true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 9 }, maxTicksLimit: 12 }, grid: { color: 'rgba(255,255,255,0.05)' } },
                y: { beginAtZero: true, ticks: { color: 'rgba(255,255,255,0.4)', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.05)' } }
            }
        }
    });
}

// ─── Render Table ─────────────────────────────────────────────────────────────
function renderTable(messages) {
    const tbody = document.getElementById('messagesTableBody');
    document.getElementById('messageCount').textContent =
        `${messages.length} message${messages.length !== 1 ? 's' : ''}`;

    if (messages.length === 0) {
        tbody.innerHTML = `<tr class="empty-row"><td colspan="7">No messages found</td></tr>`;
        return;
    }

    tbody.innerHTML = messages.map((m, i) => `
        <tr class="fade-in ${!m.read ? 'unread-row' : ''}" style="animation-delay:${i * 0.03}s">
            <td class="row-num">${i + 1}</td>
            <td>
                <span class="status-badge ${m.read ? 'read' : 'unread'}">
                    ${m.read
                        ? '<i class="fa-solid fa-envelope-open"></i> Read'
                        : '<i class="fa-solid fa-envelope"></i> Unread'}
                </span>
            </td>
            <td><strong>${escHtml(m.name)}</strong></td>
            <td><span class="sender-email">${escHtml(m.email)}</span></td>
            <td><div class="msg-preview" title="${escHtml(m.message)}">${escHtml(m.message)}</div></td>
            <td class="date-cell">${formatDate(m.createdAt)}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn reply-btn" title="Reply" onclick="openReply('${m._id}')">
                        <i class="fa-solid fa-reply"></i>
                    </button>
                    <button class="action-btn read-btn" title="${m.read ? 'Mark Unread' : 'Mark Read'}" onclick="toggleRead('${m._id}', ${m.read})">
                        <i class="fa-solid ${m.read ? 'fa-envelope' : 'fa-envelope-open'}"></i>
                    </button>
                    <button class="action-btn delete-btn" title="Delete" onclick="openDelete('${m._id}', '${escHtml(m.name)}')">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ─── Toggle Read/Unread ───────────────────────────────────────────────────────
async function toggleRead(id, isCurrentlyRead) {
    const token = sessionStorage.getItem('adminToken');
    try {
        await fetch(`${API}/admin/messages/${id}/read`, {
            method:  'PATCH',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ read: !isCurrentlyRead })
        });
        await loadMessages();
    } catch (err) {
        console.error('Toggle read error:', err);
    }
}

// ─── Delete ───────────────────────────────────────────────────────────────────
function openDelete(id, name) {
    pendingDeleteId = id;
    document.getElementById('deleteName').textContent     = name;
    document.getElementById('deleteModal').style.display  = 'flex';
}

document.getElementById('closeDeleteModal').addEventListener('click', closeDeleteModal);
document.getElementById('cancelDelete').addEventListener('click', closeDeleteModal);

function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    pendingDeleteId = null;
}

document.getElementById('confirmDelete').addEventListener('click', async () => {
    if (!pendingDeleteId) return;
    const token = sessionStorage.getItem('adminToken');

    try {
        await fetch(`${API}/admin/messages/${pendingDeleteId}`, {
            method:  'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        closeDeleteModal();
        await loadMessages();
    } catch (err) {
        console.error('Delete error:', err);
    }
});

// Close modal on overlay click
document.getElementById('deleteModal').addEventListener('click', e => {
    if (e.target === document.getElementById('deleteModal')) closeDeleteModal();
});

// ─── Reply ────────────────────────────────────────────────────────────────────
function openReply(id) {
    const msg = allMessages.find(m => m._id === id);
    if (!msg) return;

    replyTargetId = id;
    document.getElementById('replyName').textContent      = msg.name;
    document.getElementById('replyEmail').textContent     = msg.email;
    document.getElementById('originalMessage').textContent = msg.message;
    document.getElementById('replyMessage').value         = '';
    document.getElementById('replyModal').style.display   = 'flex';
    document.getElementById('replyMessage').focus();
}

document.getElementById('closeModal').addEventListener('click',  closeReplyModal);
document.getElementById('cancelReply').addEventListener('click', closeReplyModal);

function closeReplyModal() {
    document.getElementById('replyModal').style.display = 'none';
    replyTargetId = null;
}

document.getElementById('replyModal').addEventListener('click', e => {
    if (e.target === document.getElementById('replyModal')) closeReplyModal();
});

document.getElementById('sendReply').addEventListener('click', async () => {
    const body    = document.getElementById('replyMessage').value.trim();
    const btnText = document.getElementById('replyBtnText');
    const spinner = document.getElementById('replySpinner');
    const token   = sessionStorage.getItem('adminToken');

    if (!body) return;

    btnText.style.display = 'none';
    spinner.style.display = 'inline-block';

    try {
        const res = await fetch(`${API}/admin/reply`, {
            method:  'POST',
            headers: {
                'Content-Type':  'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ messageId: replyTargetId, replyText: body })
        });

        const data = await res.json();

        if (res.ok) {
            closeReplyModal();
            await loadMessages();
        } else {
            alert('Failed to send reply: ' + data.message);
        }
    } catch (err) {
        alert('Server error while sending reply.');
        console.error(err);
    } finally {
        btnText.style.display = 'inline-flex';
        spinner.style.display = 'none';
    }
});

// ─── Export CSV ───────────────────────────────────────────────────────────────
document.getElementById('exportCSV').addEventListener('click', () => {
    const rows = [
        ['#', 'Name', 'Email', 'Message', 'Status', 'Date']
    ];

    const data = currentFilter === 'unread'
        ? allMessages.filter(m => !m.read)
        : allMessages;

    data.forEach((m, i) => {
        rows.push([
            i + 1,
            `"${m.name.replace(/"/g, '""')}"`,
            m.email,
            `"${m.message.replace(/"/g, '""')}"`,
            m.read ? 'Read' : 'Unread',
            formatDate(m.createdAt)
        ]);
    });

    const csv     = rows.map(r => r.join(',')).join('\n');
    const blob    = new Blob([csv], { type: 'text/csv' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href        = url;
    a.download    = `messages_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function escHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        + ' ' + d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

// ─── Auto-login if session exists ────────────────────────────────────────────
if (sessionStorage.getItem('adminToken')) showDashboard();