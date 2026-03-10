/**
 * SDRS – Shared utilities for authenticated pages
 */
(function (global) {
    'use strict';

    const API = '';

    /* ---- Auth helpers ---- */
    function getToken() {
        return localStorage.getItem('sdrs_token');
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem('sdrs_user')) || {};
        } catch {
            return {};
        }
    }

    function logout() {
        const token = getToken();
        if (token) {
            fetch(API + '/api/auth/logout', {
                headers: { Authorization: 'Bearer ' + token }
            }).catch(() => {});
        }
        localStorage.removeItem('sdrs_token');
        localStorage.removeItem('sdrs_user');
        window.location.href = 'login.html';
    }

    function requireAuth() {
        if (!getToken()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    /* ---- API request helper ---- */
    async function apiFetch(url, options = {}) {
        const token = getToken();
        const headers = Object.assign({ 'Content-Type': 'application/json' }, options.headers || {});
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const res = await fetch(API + url, Object.assign({}, options, { headers }));

        if (res.status === 401) {
            logout();
            throw new Error('Unauthorized');
        }

        const data = await res.json();
        return { ok: res.ok, status: res.status, data };
    }

    /* ---- Sidebar setup ---- */
    function initSidebar(activePage) {
        const user = getUser();

        // Populate user info
        const nameEl  = document.getElementById('sidebarUserName');
        const emailEl = document.getElementById('sidebarUserEmail');
        const avatarEl = document.getElementById('sidebarAvatar');

        if (nameEl)   nameEl.textContent  = user.name  || 'User';
        if (emailEl)  emailEl.textContent = user.email || '';
        if (avatarEl) avatarEl.textContent = (user.name || 'U').charAt(0).toUpperCase();

        // Mark active nav item
        if (activePage) {
            const items = document.querySelectorAll('.nav-item');
            items.forEach(item => {
                if (item.dataset.page === activePage) {
                    item.classList.add('active');
                }
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) logoutBtn.addEventListener('click', logout);

        // Mobile hamburger
        const hamburger = document.getElementById('hamburger');
        const sidebar   = document.getElementById('sidebar');
        const overlay   = document.getElementById('sidebarOverlay');

        function toggleSidebar(open) {
            sidebar && sidebar.classList.toggle('open', open);
            overlay && overlay.classList.toggle('open', open);
        }

        if (hamburger) hamburger.addEventListener('click', () => toggleSidebar(true));
        if (overlay)   overlay.addEventListener('click',   () => toggleSidebar(false));
    }

    /* ---- Toast notification ---- */
    function toast(message, type = 'success') {
        const existing = document.getElementById('sdrs-toast');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.id = 'sdrs-toast';
        el.style.cssText = `
            position: fixed; bottom: 1.5rem; right: 1.5rem;
            background: ${type === 'success' ? '#16a34a' : '#dc2626'};
            color: #fff; padding: .75rem 1.25rem; border-radius: .5rem;
            font-size: .9rem; font-weight: 600;
            box-shadow: 0 4px 12px rgba(0,0,0,.2);
            z-index: 9999; opacity: 0; transform: translateY(8px);
            transition: opacity .25s, transform .25s;
            max-width: 320px;
        `;
        el.textContent = message;
        document.body.appendChild(el);

        requestAnimationFrame(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });

        setTimeout(() => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(8px)';
            setTimeout(() => el.remove(), 300);
        }, 3500);
    }

    /* ---- Expose to global ---- */
    global.SDRS = { getToken, getUser, logout, requireAuth, apiFetch, initSidebar, toast };

}(window));
