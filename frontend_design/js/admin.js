document.addEventListener('DOMContentLoaded', () => {
    // 1. Authenticaton Check
    const token = localStorage.getItem('aromea_token');
    const user = JSON.parse(localStorage.getItem('aromea_user'));

    if (!token || !user || user.role !== 'admin') {
        if(window.showToast) showToast('ACCESS DENIED: Insufficient Clearance.', 'error');
        else alert('ACCESS DENIED: Insufficient Clearance.');
        
        setTimeout(() => window.location.href = 'index.html', 1500);
        return;
    }

    // Set Admin Name
    document.getElementById('admin-name').textContent = user.name || 'Admin_01';

    // 2. Tab Navigation Logic
    const navBtns = document.querySelectorAll('.nav-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons and tabs
            navBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(t => t.classList.remove('active'));

            // Add active class to clicked
            btn.classList.add('active');
            const target = btn.getAttribute('data-tab');
            document.getElementById(target).classList.add('active');
        });
    });

    // 3. Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('aromea_token');
        localStorage.removeItem('aromea_user');
        window.location.href = 'index.html';
    });

    // 4. Data Loading Protocols
    const API_URL = 'http://localhost:5000/api';

    // Helper fetch function
    async function secureFetch(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
        const config = { ...options, headers };
        const res = await fetch(`${API_URL}${endpoint}`, config);
        
        if (res.status === 401 || res.status === 403) {
            if(window.showToast) showToast('Security breach detected. Re-authenticate.', 'error');
            localStorage.clear();
            setTimeout(() => window.location.href = 'index.html', 1500);
            throw new Error('Not authorized');
        }
        
        return res.json();
    }

    // LOAD OVERVIEW (Dashboard Tab)
    async function initDashboard() {
        try {
            const [orders, reservations, users] = await Promise.all([
                secureFetch('/orders/all'),
                secureFetch('/reservations/all'),
                secureFetch('/auth/all')
            ]);
            
            document.getElementById('stat-orders').textContent = orders.length;
            document.getElementById('stat-reservations').textContent = reservations.length;
            document.getElementById('stat-users').textContent = users.length;

            renderOrders(orders);
            renderReservations(reservations);
            renderUsers(users);
        } catch (err) {
            console.error('Core Matrix Loading Error:', err);
        }
    }

    // LOAD MENU AND FEEDBACK
    async function initAux() {
        try {
            const menuData = await fetch(`${API_URL}/menu`).then(r => r.json());
            const feedbackData = await fetch(`${API_URL}/feedback`).then(r => r.json());
            renderMenu(menuData);
            renderFeedback(feedbackData);
        } catch (err) {
            console.error('Aux Matrix Loading Error:', err);
        }
    }

    // RENDER FUNCTIONS
    function renderOrders(orders) {
        const tbody = document.getElementById('orders-tbody');
        tbody.innerHTML = '';
        orders.forEach(o => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${o.order_id}</td>
                <td>${o.customer_name}<br><small style="color:var(--text-muted)">${o.customer_email}</small></td>
                <td>₹${o.total_amount}</td>
                <td><span class="status ${o.payment_mode === 'Online' ? 'confirmed' : 'pending'}">${o.payment_mode || 'COD'}</span></td>
                <td><span class="status ${o.status.toLowerCase()}">${o.status}</span></td>
                <td>${new Date(o.order_date).toLocaleString()}</td>
                <td class="action-btns">
                    <button class="action-btn check" onclick="updateOrderStatus(${o.order_id}, 'delivered')" title="Mark Delivered"><i class="fas fa-check-circle"></i></button>
                    <button class="action-btn delete" onclick="deleteOrder(${o.order_id})" title="Purge Order"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderReservations(reservations) {
        const tbody = document.getElementById('reservations-tbody');
        tbody.innerHTML = '';
        reservations.forEach(r => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${r.reservation_id}</td>
                <td>${r.customer_name || 'Matrix Ghost'}</td>
                <td>${r.date} ${r.time}</td>
                <td>${r.guests} Entity</td>
                <td><span class="status ${r.status.toLowerCase()}">${r.status}</span></td>
                <td class="action-btns">
                     <button class="action-btn check" onclick="updateReservationStatus(${r.reservation_id}, 'confirmed')" title="Confirm Identity"><i class="fas fa-check"></i></button>
                     <button class="action-btn delete" onclick="deleteReservation(${r.reservation_id})" title="Delete Instance"><i class="fas fa-times"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderMenu(items) {
        const tbody = document.getElementById('menu-tbody');
        tbody.innerHTML = '';
        items.forEach(m => {
            const tr = document.createElement('tr');
            const availStatus = m.is_available ? 'available' : 'unavailable';
            const availText = m.is_available ? 'Active' : 'Offline';
            tr.innerHTML = `
                <td>#${m.item_id}</td>
                <td>${m.name} ${m.is_veg ? '🟩' : '🟥'}</td>
                <td>${m.category_name || 'Unclassified'}</td>
                <td>₹${m.price}</td>
                <td><span class="status ${availStatus}">${availText}</span></td>
                <td class="action-btns">
                    <button class="action-btn check" onclick="updatePrice(${m.item_id}, '${m.name.replace(/'/g, "\\'")}', ${m.price})" title="Edit Price"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteMenu(${m.item_id})" title="Delete Script"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderUsers(users) {
        const tbody = document.getElementById('users-tbody');
        tbody.innerHTML = '';
        users.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${u.user_id}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td><span class="status ${u.role === 'admin' ? 'confirmed' : 'pending'}">${u.role.toUpperCase()}</span></td>
                <td class="action-btns">
                    ${u.user_id === user.id ? `<i>ROOT</i>` : `
                        <button class="action-btn check" onclick="updateRole(${u.user_id}, 'admin')" title="Grant Root Access"><i class="fas fa-arrow-up"></i></button>
                        <button class="action-btn delete" onclick="deleteUser(${u.user_id})" title="Ban Node"><i class="fas fa-ban"></i></button>
                    `}
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderFeedback(feedback) {
        const tbody = document.getElementById('feedback-tbody');
        tbody.innerHTML = '';
        feedback.forEach(f => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${f.feedback_id}</td>
                <td>${f.customer_name || 'Guest'}</td>
                <td>${f.item_name || 'General App'}</td>
                <td style="color:var(--neon-purple); letter-spacing: 2px;">${'★'.repeat(f.rating)}${'☆'.repeat(5-f.rating)}</td>
                <td>${f.message}</td>
                <td class="action-btns">
                    <button class="action-btn delete" onclick="deleteFeedback(${f.feedback_id})" title="Erase Record"><i class="fas fa-trash"></i></button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }

    window.updateOrderStatus = async function(id, status) {
        try {
            await secureFetch(`/orders/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            initDashboard();
        } catch (e) { console.error(e); }
    };
    
    window.deleteOrder = async function(id) {
        if(!confirm('Execute purge on order?')) return;
        try {
            await secureFetch(`/orders/${id}`, { method: 'DELETE' });
            initDashboard();
        } catch (e) { console.error(e); }
    };

    window.updateReservationStatus = async function(id, status) {
        try {
            await secureFetch(`/reservations/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
            initDashboard();
        } catch (e) { console.error(e); }
    };

    window.deleteReservation = async function(id) {
        if(!confirm('Delete reservation instance?')) return;
        try {
            await secureFetch(`/reservations/${id}`, { method: 'DELETE' });
            initDashboard();
        } catch (e) { console.error(e); }
    };

    window.deleteMenu = async function(id) {
        if(!confirm('Delete menu script sequence?')) return;
        try {
            await secureFetch(`/menu/${id}`, { method: 'DELETE' });
            if(window.showToast) window.showToast("Dish removed successfully.", "success");
            initAux();
        } catch (e) { console.error(e); }
    };

    window.updatePrice = async function(id, name, currentPrice) {
        let newPrice = prompt(`Enter new price for ${name} (Current: ₹${currentPrice}):`, currentPrice);
        if (newPrice === null || newPrice === "") return;
        
        newPrice = parseFloat(newPrice);
        if (isNaN(newPrice) || newPrice < 0) {
            if(window.showToast) window.showToast("Invalid price entered.", "error");
            else alert("Invalid price");
            return;
        }

        try {
            await secureFetch(`/menu/${id}/price`, {
                method: 'PATCH',
                body: JSON.stringify({ price: newPrice })
            });
            if(window.showToast) window.showToast("Price updated successfully.", "success");
            initAux();
        } catch (e) {
            console.error(e);
            if(window.showToast) window.showToast("Error updating price.", "error");
        }
    };

    window.updateRole = async function(id, role) {
        try {
            await secureFetch(`/auth/${id}/role`, {
                method: 'PUT',
                body: JSON.stringify({ role })
            });
            initDashboard();
        } catch (e) { console.error(e); }
    };

    window.deleteUser = async function(id) {
        if(!confirm('Permanently slice this node from network?')) return;
        try {
            await secureFetch(`/auth/${id}`, { method: 'DELETE' });
            initDashboard();
        } catch (e) { console.error(e); }
    };

    window.deleteFeedback = async function(id) {
        if(!confirm('Erase this intel from database?')) return;
        try {
            await secureFetch(`/feedback/${id}`, { method: 'DELETE' });
            initAux();
        } catch (e) { console.error(e); }
    };

    // Initialize Arrays
    initDashboard();
    initAux();
});
