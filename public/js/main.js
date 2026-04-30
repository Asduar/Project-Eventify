const userData = localStorage.getItem('eventify_user');
if (!userData) window.location.href = '/login.html';
else document.getElementById('displayUsername').innerText = JSON.parse(userData).username;

document.getElementById('btnLogout').addEventListener('click', () => {
    localStorage.removeItem('eventify_user');
    window.location.href = '/login.html';
});

let calendarInstance = null;

window.switchTab = function(sectionId) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(sectionId).classList.add('active');
    event.currentTarget.classList.add('active');

    const titles = {
        'dashboard': 'Kalender Acara',
        'organization': 'Daftar Organisasi Kampus',
        'room': 'Manajemen Ruangan',
        'attendee': 'Daftar Peserta Event'
    };
    document.getElementById('pageTitle').innerText = titles[sectionId];

    if (sectionId === 'dashboard' && calendarInstance) {
        setTimeout(() => calendarInstance.updateSize(), 100);
    }
    
    if (sectionId === 'organization') fetchOrganizations();
    if (sectionId === 'room') fetchRooms();
    if (sectionId === 'attendee') fetchAttendees();
};

async function fetchEvents() {
    try {
        const res = await fetch('/events');
        const data = await res.json();
        return data.map(ev => ({
            id: ev.id, title: ev.title, start: `${ev.date}T${ev.time}`,
            extendedProps: { description: ev.description, location: ev.location, type: ev.type },
            color: ev.type === 'Rapat' ? '#ff9f89' : '#3498db'
        }));
    } catch (e) { return []; }
}

document.addEventListener('DOMContentLoaded', async function() {
    const calendarEl = document.getElementById('calendar');
    calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' },
        events: await fetchEvents(),
        eventDisplay: 'block', displayEventTime: true,
        eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
        
        eventClick: function(info) {
            document.getElementById('modalTitle').innerText = info.event.title;
            document.getElementById('modalTime').innerText = info.event.start.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
            document.getElementById('modalLocation').innerText = info.event.extendedProps.location;
            document.getElementById('modalDescription').innerText = info.event.extendedProps.description;
            document.getElementById('btnDelete').dataset.id = info.event.id;
            window.currentSelectedEvent = info.event; 
            document.getElementById('modalOverlay').style.display = 'block';
            document.getElementById('eventModal').style.display = 'block';
        }
    });
    calendarInstance.render();
});

const closeModal = () => { document.getElementById('modalOverlay').style.display = 'none'; document.getElementById('eventModal').style.display = 'none'; };
document.getElementById('btnClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', closeModal);

document.getElementById('btnDelete').addEventListener('click', async function() {
    if(confirm('Hapus acara?')) {
        await fetch(`/events/${this.dataset.id}`, { method: 'DELETE' });
        window.location.reload();
    }
});

document.getElementById('btnEdit').addEventListener('click', function() {
    closeModal();
    const evt = window.currentSelectedEvent;
    document.getElementById('eventId').value = evt.id;
    document.getElementById('title').value = evt.title;
    document.getElementById('date').value = evt.start.toISOString().split('T')[0];
    document.getElementById('time').value = evt.start.toTimeString().split(' ')[0];
    document.getElementById('location').value = evt.extendedProps.location;
    document.getElementById('type').value = evt.extendedProps.type;
    document.getElementById('description').value = evt.extendedProps.description || '';
    document.querySelector('#addEventForm button').innerText = 'Simpan Perubahan';
});

document.getElementById('addEventForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('eventId').value;
    const payload = {
        title: document.getElementById('title').value, date: document.getElementById('date').value,
        time: document.getElementById('time').value, location: document.getElementById('location').value,
        type: document.getElementById('type').value, description: document.getElementById('description').value
    };
    await fetch(id ? `/events/${id}` : '/events', {
        method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    window.location.reload();
});


async function fetchOrganizations() {
    try {
        const res = await fetch('/organizations');
        const data = await res.json();
        const tbody = document.getElementById('orgTableBody');
        tbody.innerHTML = '';
        if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Kosong</td></tr>';
        
        data.forEach((org, i) => {
            tbody.innerHTML += `<tr><td>${i+1}</td><td><strong>${org.name}</strong></td><td>${org.contact_email}</td><td>${org.description || '-'}</td></tr>`;
        });
    } catch (e) { console.error(e); }
}

document.getElementById('orgForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
        name: document.getElementById('orgName').value,
        contact_email: document.getElementById('orgEmail').value,
        description: document.getElementById('orgDesc').value
    };
    await fetch('/organizations', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    document.getElementById('orgForm').reset();
    fetchOrganizations();
});

async function fetchRooms() {
    try {
        const res = await fetch('/rooms');
        const data = await res.json();
        const tbody = document.getElementById('roomTableBody');
        tbody.innerHTML = '';
        if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada ruangan.</td></tr>';
        
        data.forEach((room, i) => {
            tbody.innerHTML += `<tr><td>${i+1}</td><td><strong>${room.room_name}</strong></td><td>${room.building}</td><td>${room.capacity} Orang</td></tr>`;
        });
    } catch (e) { console.error(e); }
}

document.getElementById('roomForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
        room_name: document.getElementById('roomName').value,
        building: document.getElementById('roomBuilding').value,
        capacity: document.getElementById('roomCapacity').value
    };
    await fetch('/rooms', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    document.getElementById('roomForm').reset();
    fetchRooms();
});

async function fetchAttendees() {
    try {
        const res = await fetch('/attendees');
        const data = await res.json();
        const tbody = document.getElementById('attendeeTableBody');
        tbody.innerHTML = '';
        if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Belum ada peserta terdaftar.</td></tr>';
        
        data.forEach((att, i) => {
            tbody.innerHTML += `<tr><td>${i+1}</td><td><strong>${att.student_name}</strong></td><td>${att.nim}</td><td>ID Event: ${att.eventId}</td></tr>`;
        });
    } catch (e) { console.error(e); }
}

document.getElementById('attendeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const payload = {
        student_name: document.getElementById('attName').value,
        nim: document.getElementById('attNim').value,
        eventId: document.getElementById('attEventId').value
    };
    await fetch('/attendees', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    document.getElementById('attendeeForm').reset();
    fetchAttendees();
});