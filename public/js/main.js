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
        'attendee': 'Daftar Peserta Event',
        'profile': 'Profil Saya'
    };
    document.getElementById('pageTitle').innerText = titles[sectionId];

    if (sectionId === 'dashboard' && calendarInstance) {
        setTimeout(() => calendarInstance.updateSize(), 100);
    }
    
    if (sectionId === 'organization') fetchOrganizations();
    if (sectionId === 'room') fetchRooms();         
    if (sectionId === 'attendee') fetchAttendees(); 
    if (sectionId === 'profile') loadProfileData(); 
};

async function loadDropdowns() {
    try {
        const [orgRes, roomRes] = await Promise.all([fetch('/organizations'), fetch('/rooms')]);
        const orgs = await orgRes.json();
        const rooms = await roomRes.json();

        const orgSelect = document.getElementById('organizationId');
        orgSelect.innerHTML = '<option value="">Pilih Organisasi</option>';
        orgs.forEach(o => orgSelect.innerHTML += `<option value="${o.id}">${o.name}</option>`);

        const roomSelect = document.getElementById('roomId');
        roomSelect.innerHTML = '<option value="">Pilih Ruangan</option>';
        rooms.forEach(r => roomSelect.innerHTML += `<option value="${r.id}">${r.room_name} (${r.building})</option>`);
    } catch (e) { console.error("Gagal memuat dropdown", e); }
}

async function fetchEvents() {
    try {
        const res = await fetch('/events');
        const data = await res.json();
        window.allEventsData = data.map(ev => ({
            id: ev.id, title: ev.title, start: `${ev.date}T${ev.time}`,
            extendedProps: { 
                description: ev.description, type: ev.type, organizationId: ev.organizationId, roomId: ev.roomId,
                orgName: ev.Organization ? ev.Organization.name : '-',
                roomName: ev.Room ? `${ev.Room.room_name} - ${ev.Room.building}` : '-'
            },
            color: ev.type === 'Rapat' ? '#ff9f89' : '#3498db'
        }));
        
        return window.allEventsData;
        return data.map(ev => ({
            id: ev.id, title: ev.title, start: `${ev.date}T${ev.time}`,
            extendedProps: { 
                description: ev.description, 
                type: ev.type,
                organizationId: ev.organizationId,
                roomId: ev.roomId,
                orgName: ev.Organization ? ev.Organization.name : '-',
                roomName: ev.Room ? `${ev.Room.room_name} - ${ev.Room.building}` : '-'
            },
            color: ev.type === 'Rapat' ? '#ff9f89' : '#3498db'
        }));
    } catch (e) { return []; }
}

window.searchCalendar = function() {
    if (!calendarInstance) return;
    
    const input = document.getElementById('searchEvent').value.toLowerCase();
    
    const filteredEvents = window.allEventsData.filter(ev => 
        ev.title.toLowerCase().includes(input) || 
        ev.extendedProps.orgName.toLowerCase().includes(input) || 
        ev.extendedProps.roomName.toLowerCase().includes(input)
    );
    
    calendarInstance.removeAllEventSources();
    calendarInstance.addEventSource(filteredEvents);
};

document.addEventListener('DOMContentLoaded', async function() {
    loadDropdowns(); 
    
    const calendarEl = document.getElementById('calendar');
    calendarInstance = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: { left: 'prev,next today', center: 'title', right: 'dayGridMonth,listMonth' },
        buttonText: { prev: '<', next: '>' },
        events: await fetchEvents(),
        eventDisplay: 'block', displayEventTime: true,
        eventTimeFormat: { hour: '2-digit', minute: '2-digit', hour12: false },
        
        eventClick: function(info) {
            const props = info.event.extendedProps;
            document.getElementById('modalTitle').innerText = info.event.title;
            document.getElementById('modalTime').innerText = info.event.start.toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'});
            
            document.getElementById('modalOrg').innerText = props.orgName;
            document.getElementById('modalLocation').innerText = props.roomName;
            document.getElementById('modalDescription').innerText = props.description || '-';
            
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
    document.getElementById('type').value = evt.extendedProps.type;
    document.getElementById('description').value = evt.extendedProps.description || '';
    
    document.getElementById('organizationId').value = evt.extendedProps.organizationId;
    document.getElementById('roomId').value = evt.extendedProps.roomId;
    
    document.querySelector('#addEventForm button').innerText = 'Simpan Perubahan';
});

document.getElementById('addEventForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('eventId').value;
    const payload = {
        title: document.getElementById('title').value, 
        date: document.getElementById('date').value,
        time: document.getElementById('time').value, 
        type: document.getElementById('type').value, 
        description: document.getElementById('description').value,
        organizationId: document.getElementById('organizationId').value,
        roomId: document.getElementById('roomId').value
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
        if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Kosong</td></tr>';
        
        data.forEach((org, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td><strong>${org.name}</strong></td>
                    <td>${org.contact_email}</td>
                    <td>${org.description || '-'}</td>
                    <td>
                        <button onclick="editOrg(${org.id}, '${org.name}', '${org.contact_email}', '${org.description || ''}')" style="background:#f39c12; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                        <button onclick="deleteOrg(${org.id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

window.deleteOrg = async function(id) {
    if (confirm('Yakin ingin menghapus organisasi ini?')) {
        await fetch(`/organizations/${id}`, { method: 'DELETE' });
        fetchOrganizations();
    }
};

window.editOrg = function(id, name, email, desc) {
    document.getElementById('orgId').value = id;
    document.getElementById('orgName').value = name;
    document.getElementById('orgEmail').value = email;
    document.getElementById('orgDesc').value = desc;
    
    const btn = document.getElementById('btnSubmitOrg');
    btn.innerText = 'Simpan';
    btn.style.backgroundColor = '#f39c12';
};

document.getElementById('orgForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('orgId').value;
    const payload = {
        name: document.getElementById('orgName').value,
        contact_email: document.getElementById('orgEmail').value,
        description: document.getElementById('orgDesc').value
    };
    
    const url = id ? `/organizations/${id}` : '/organizations';
    const method = id ? 'PUT' : 'POST';

    await fetch(url, {
        method: method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    
    document.getElementById('orgForm').reset();
    document.getElementById('orgId').value = '';
    const btn = document.getElementById('btnSubmitOrg');
    btn.innerText = 'Tambah';
    btn.style.backgroundColor = '#3498db';
    
    fetchOrganizations();
});

async function fetchRooms() {
    try {
        const res = await fetch('/rooms');
        const data = await res.json();
        const tbody = document.getElementById('roomTableBody');
        tbody.innerHTML = '';
        if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada ruangan.</td></tr>';
        
        data.forEach((room, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td><strong>${room.room_name}</strong></td>
                    <td>${room.building}</td>
                    <td>${room.capacity} Orang</td>
                    <td>
                        <button onclick="editRoom(${room.id}, '${room.room_name}', '${room.building}', ${room.capacity})" style="background:#f39c12; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                        <button onclick="deleteRoom(${room.id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

window.deleteRoom = async function(id) {
    if (confirm('Hapus ruangan ini?')) {
        await fetch(`/rooms/${id}`, { method: 'DELETE' });
        fetchRooms();
    }
};

window.editRoom = function(id, name, building, capacity) {
    document.getElementById('roomId').value = id;
    document.getElementById('roomName').value = name;
    document.getElementById('roomBuilding').value = building;
    document.getElementById('roomCapacity').value = capacity;
    
    const btn = document.getElementById('btnSubmitRoom');
    btn.innerText = 'Simpan'; btn.style.backgroundColor = '#f39c12';
};

document.getElementById('roomForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('roomId').value;
    const payload = {
        room_name: document.getElementById('roomName').value,
        building: document.getElementById('roomBuilding').value,
        capacity: document.getElementById('roomCapacity').value
    };
    await fetch(id ? `/rooms/${id}` : '/rooms', {
        method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    
    document.getElementById('roomForm').reset(); document.getElementById('roomId').value = '';
    const btn = document.getElementById('btnSubmitRoom');
    btn.innerText = 'Tambah'; btn.style.backgroundColor = '#3498db';
    fetchRooms();
});

async function fetchAttendees() {
    try {
        const evRes = await fetch('/events');
        const events = await evRes.json();
        const evSelect = document.getElementById('attEventId');
        evSelect.innerHTML = '<option value="">Pilih Acara</option>';
        events.forEach(ev => evSelect.innerHTML += `<option value="${ev.id}">${ev.title}</option>`);

        const res = await fetch('/attendees');
        const data = await res.json();
        const tbody = document.getElementById('attendeeTableBody');
        tbody.innerHTML = '';
        if(data.length === 0) return tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Belum ada peserta.</td></tr>';
        
        data.forEach((att, i) => {
            const eventName = att.Event ? att.Event.title : 'Acara telah dihapus';
            
            tbody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td><strong>${att.student_name}</strong></td>
                    <td>${att.nim}</td>
                    <td>${eventName}</td>
                    <td>
                        <button onclick="editAttendee(${att.id}, '${att.student_name}', '${att.nim}', ${att.eventId})" style="background:#f39c12; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Edit</button>
                        <button onclick="deleteAttendee(${att.id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">Hapus</button>
                    </td>
                </tr>`;
        });
    } catch (e) { console.error(e); }
}

window.deleteAttendee = async function(id) {
    if (confirm('Hapus peserta ini?')) {
        await fetch(`/attendees/${id}`, { method: 'DELETE' });
        fetchAttendees();
    }
};

window.editAttendee = function(id, name, nim, eventId) {
    document.getElementById('attId').value = id;
    document.getElementById('attName').value = name;
    document.getElementById('attNim').value = nim;
    document.getElementById('attEventId').value = eventId;
    
    const btn = document.getElementById('btnSubmitAtt');
    btn.innerText = 'Simpan'; btn.style.backgroundColor = '#f39c12';
};

document.getElementById('attendeeForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const id = document.getElementById('attId').value;
    const payload = {
        student_name: document.getElementById('attName').value,
        nim: document.getElementById('attNim').value,
        eventId: document.getElementById('attEventId').value
    };
    await fetch(id ? `/attendees/${id}` : '/attendees', {
        method: id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    
    document.getElementById('attendeeForm').reset(); document.getElementById('attId').value = '';
    const btn = document.getElementById('btnSubmitAtt');
    btn.innerText = 'Daftar'; btn.style.backgroundColor = '#3498db';
    fetchAttendees();
});

function loadProfileData() {
    const user = JSON.parse(localStorage.getItem('eventify_user'));
    document.getElementById('profId').value = user.id;
    document.getElementById('profUsername').value = user.username;
    document.getElementById('profEmail').value = user.email;
    document.getElementById('profPassword').value = ''; 
}

document.getElementById('profileForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const id = document.getElementById('profId').value;
    const payload = {
        username: document.getElementById('profUsername').value,
        email: document.getElementById('profEmail').value
    };

    const newPassword = document.getElementById('profPassword').value;
    if (newPassword.trim() !== '') {
        payload.password = newPassword;
    }

    try {
        const response = await fetch(`/users/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert('Profil berhasil diperbarui!');
            
            const currentUser = JSON.parse(localStorage.getItem('eventify_user'));
            currentUser.username = payload.username;
            currentUser.email = payload.email;
            localStorage.setItem('eventify_user', JSON.stringify(currentUser));
            
            document.getElementById('displayUsername').innerText = payload.username;
            document.getElementById('profPassword').value = ''; 
        } else {
            const errorData = await response.json();
            alert(`Gagal memperbarui profil: ${errorData.message}`);
        }
    } catch (error) {
        console.error(error);
        alert('Terjadi kesalahan pada server.');
    }
});
window.searchTable = function(inputId, tableBodyId) {
    const input = document.getElementById(inputId).value.toLowerCase();
    const rows = document.getElementById(tableBodyId).getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        if (rows[i].cells.length <= 1) continue;

        const rowText = rows[i].innerText.toLowerCase();
        if (rowText.includes(input)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
};