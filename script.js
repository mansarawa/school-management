/**
 * EduManage - Enterprise School Management SaaS System
 * Main JavaScript Engine: Theme, Navigation, Search, Data Utilities, Toasts & Chart Helpers
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSidebar();
  initActiveNav();
  initGlobalSearch();
  initNotifications();
  initTooltips();
});

/* ==========================================================================
   1. Theme Management (Dark / Light Mode)
   ========================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('edumanage-theme') || 'light';
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-bs-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-bs-theme', newTheme);
      localStorage.setItem('edumanage-theme', newTheme);
      updateThemeIcon(newTheme);
      showToast(`Switched to ${newTheme} mode`, 'info', 'Theme Changed');
      
      // Notify charts if available
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: newTheme } }));
      }
    });
  });
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-toggle-btn i');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill text-warning';
    } else {
      icon.className = 'bi bi-moon-stars-fill';
    }
  });
}

/* ==========================================================================
   2. Sidebar Navigation & Responsiveness
   ========================================================================== */
function initSidebar() {
  const toggleBtn = document.getElementById('sidebarToggleBtn');
  const mobileToggleBtn = document.getElementById('mobileSidebarToggle');
  const overlay = document.querySelector('.sidebar-overlay');
  const sidebar = document.querySelector('.app-sidebar');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-collapsed');
      const isCollapsed = document.body.classList.contains('sidebar-collapsed');
      localStorage.setItem('edumanage-sidebar-collapsed', isCollapsed ? 'true' : 'false');
    });

    // Restore desktop collapsed state
    if (window.innerWidth > 992 && localStorage.getItem('edumanage-sidebar-collapsed') === 'true') {
      document.body.classList.add('sidebar-collapsed');
    }
  }

  // Mobile drawer controls
  if (mobileToggleBtn) {
    mobileToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('sidebar-open');
    });
  }

  if (overlay) {
    overlay.addEventListener('click', () => {
      document.body.classList.remove('sidebar-open');
    });
  }

  // Close sidebar on link click on mobile
  if (sidebar) {
    const navLinks = sidebar.querySelectorAll('.nav-link-ed');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          document.body.classList.remove('sidebar-open');
        }
      });
    });
  }
}

/* ==========================================================================
   3. Active Navigation State
   ========================================================================== */
function initActiveNav() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link-ed');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   4. Global Search Modal (Ctrl + K)
   ========================================================================== */
const searchableItems = [
  { title: 'Dashboard Overview', category: 'Page', url: 'dashboard.html', icon: 'bi-grid-1x2-fill' },
  { title: 'Students Directory', category: 'Academic', url: 'students.html', icon: 'bi-people-fill' },
  { title: 'Aarav Sharma (Class 10-A, #1001)', category: 'Student', url: 'student-details.html', icon: 'bi-person-badge' },
  { title: 'Ananya Verma (Class 12-B, #1002)', category: 'Student', url: 'student-details.html', icon: 'bi-person-badge' },
  { title: 'Rohan Mehra (Class 9-A, #1003)', category: 'Student', url: 'student-details.html', icon: 'bi-person-badge' },
  { title: 'Teachers Directory', category: 'Academic', url: 'teachers.html', icon: 'bi-person-video3' },
  { title: 'Dr. Sunita Kapoor (Senior Math)', category: 'Teacher', url: 'teacher-details.html', icon: 'bi-person-workspace' },
  { title: 'Rajesh Nair (Physics HOD)', category: 'Teacher', url: 'teacher-details.html', icon: 'bi-person-workspace' },
  { title: 'Classes & Sections', category: 'Academic', url: 'classes.html', icon: 'bi-mortarboard-fill' },
  { title: 'Curriculum & Subjects', category: 'Academic', url: 'subjects.html', icon: 'bi-book-half' },
  { title: 'Daily Attendance Register', category: 'Academic', url: 'attendance.html', icon: 'bi-calendar-check-fill' },
  { title: 'Class Timetable Matrix', category: 'Academic', url: 'timetable.html', icon: 'bi-calendar3-week-fill' },
  { title: 'Examinations Schedule', category: 'Academic', url: 'exams.html', icon: 'bi-journal-check' },
  { title: 'Report Cards & Exam Results', category: 'Academic', url: 'exam-results.html', icon: 'bi-trophy-fill' },
  { title: 'Homework & Assignments', category: 'Academic', url: 'homework.html', icon: 'bi-journal-bookmark-fill' },
  { title: 'Fees Collection & Invoices', category: 'Finance', url: 'fees.html', icon: 'bi-cash-coin' },
  { title: 'Fee Receipt #REC-2026-8912', category: 'Finance', url: 'fee-details.html', icon: 'bi-receipt' },
  { title: 'Parents & Guardians', category: 'Management', url: 'parents.html', icon: 'bi-person-hearts' },
  { title: 'Library Book Catalogue', category: 'Management', url: 'library.html', icon: 'bi-collection-fill' },
  { title: 'Transport & Fleet Routes', category: 'Management', url: 'transport.html', icon: 'bi-bus-front-fill' },
  { title: 'School Notices & Circulars', category: 'Management', url: 'notices.html', icon: 'bi-megaphone-fill' },
  { title: 'Upcoming Events Calendar', category: 'Management', url: 'events.html', icon: 'bi-calendar-event-fill' },
  { title: 'Internal Messaging & Chat', category: 'Management', url: 'messages.html', icon: 'bi-chat-dots-fill' },
  { title: 'Analytical Reports & Export', category: 'Reports', url: 'reports.html', icon: 'bi-file-earmark-bar-graph-fill' },
  { title: 'System Settings & Config', category: 'System', url: 'settings.html', icon: 'bi-gear-fill' },
  { title: 'Administrator Profile', category: 'System', url: 'profile.html', icon: 'bi-person-circle' }
];

function initGlobalSearch() {
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchModal();
    }
  });

  const searchTriggers = document.querySelectorAll('.topbar-search-trigger');
  searchTriggers.forEach(btn => {
    btn.addEventListener('click', openSearchModal);
  });

  const searchInput = document.getElementById('globalModalSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      renderSearchResults(e.target.value.trim());
    });
  }
}

function openSearchModal() {
  const modalEl = document.getElementById('globalSearchModal');
  if (modalEl) {
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
    setTimeout(() => {
      const input = document.getElementById('globalModalSearchInput');
      if (input) {
        input.value = '';
        input.focus();
        renderSearchResults('');
      }
    }, 200);
  }
}

function renderSearchResults(query) {
  const resultsContainer = document.getElementById('globalSearchResults');
  if (!resultsContainer) return;

  const filtered = searchableItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `
      <div class="p-4 text-center text-muted">
        <i class="bi bi-search fs-3 d-block mb-2 text-secondary opacity-50"></i>
        <p class="mb-0">No matches found for "<strong>${escapeHtml(query)}</strong>"</p>
        <small class="text-secondary">Try searching for 'student', 'fees', 'class', or 'report'</small>
      </div>
    `;
    return;
  }

  resultsContainer.innerHTML = filtered.map(item => `
    <a href="${item.url}" class="d-flex align-items-center justify-content-between p-2 px-3 border-bottom text-decoration-none search-result-item hover-bg">
      <div class="d-flex align-items-center gap-3">
        <div class="stat-icon p-2" style="width:36px;height:36px;font-size:1rem;background:var(--ed-primary-light);color:var(--ed-primary);">
          <i class="bi ${item.icon}"></i>
        </div>
        <div>
          <div class="fw-semibold text-dark-emphasis">${item.title}</div>
          <small class="text-muted">${item.category}</small>
        </div>
      </div>
      <i class="bi bi-arrow-right text-muted small"></i>
    </a>
  `).join('');
}

/* ==========================================================================
   5. Interactive Toast Notifications
   ========================================================================== */
function showToast(message, type = 'success', title = 'EduManage') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'bi-check-circle-fill text-success',
    warning: 'bi-exclamation-triangle-fill text-warning',
    danger: 'bi-x-circle-fill text-danger',
    info: 'bi-info-circle-fill text-primary'
  };

  const toastId = 'toast-' + Date.now();
  const html = `
    <div id="${toastId}" class="toast toast-ed align-items-center show shadow" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body d-flex align-items-center gap-2">
          <i class="bi ${icons[type] || icons.success} fs-5"></i>
          <div>
            <strong class="d-block font-sans text-dark-emphasis">${escapeHtml(title)}</strong>
            <span class="small text-secondary">${escapeHtml(message)}</span>
          </div>
        </div>
        <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  container.insertAdjacentHTML('beforeend', html);
  const toastEl = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastEl, { delay: 4000 });
  toast.show();

  toastEl.addEventListener('hidden.bs.toast', () => {
    toastEl.remove();
  });
}

/* ==========================================================================
   6. Notification Simulator
   ========================================================================== */
function initNotifications() {
  const markReadBtn = document.getElementById('markAllNotificationsRead');
  if (markReadBtn) {
    markReadBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const badges = document.querySelectorAll('.notification-unread-dot');
      badges.forEach(b => b.remove());
      const counter = document.getElementById('notificationCountBadge');
      if (counter) counter.innerText = '0';
      showToast('All notifications marked as read', 'info', 'Notifications');
    });
  }
}

function initTooltips() {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

// Global helpers for mock table operations
window.EduManage = {
  showToast,
  openSearchModal
};
