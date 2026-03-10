/* ================================================
   PawStay — app.js  (shared vanilla JS)
   The same file is loaded by both sitters.html
   and Availability.html; page-specific code
   is gated behind document.getElementById checks.
   ================================================ */

'use strict';

/* ────────────────────────────────────────────────
   1. SITTER DATA
──────────────────────────────────────────────── */
const SITTERS = [
    {
        id: 1,
        name: 'Priya Mehta',
        initials: 'PM',
        color: '#E07A5F',
        rating: 4.8,
        reviews: 127,
        rate: 1499,
        pets: ['Dog', 'Cat'],
        fencedYard: true,
        experience: 'Expert',
        services: ['Walking', 'Sitting', 'Feeding'],
        location: 'Austin, TX',
    },
    {
        id: 2,
        name: 'Jake Rivera',
        initials: 'JR',
        color: '#81B29A',
        rating: 4.6,
        reviews: 89,
        rate: 1249,
        pets: ['Dog', 'Cat', 'Bird'],
        fencedYard: false,
        experience: 'Intermediate',
        services: ['Walking', 'Sitting'],
        location: 'Austin, TX',
    },
    {
        id: 3,
        name: 'Ananya Iyer',
        initials: 'AI',
        color: '#3D405B',
        rating: 5.0,
        reviews: 214,
        rate: 1849,
        pets: ['Dog', 'Cat', 'Rabbit'],
        fencedYard: true,
        experience: 'Expert',
        services: ['Walking', 'Sitting', 'Feeding'],
        location: 'Austin, TX',
    },
    {
        id: 4,
        name: 'Tom Nguyen',
        initials: 'TN',
        color: '#F2CC8F',
        rating: 4.2,
        reviews: 43,
        rate: 999,
        pets: ['Cat', 'Bird'],
        fencedYard: false,
        experience: 'Beginner',
        services: ['Sitting', 'Feeding'],
        location: 'Austin, TX',
    },
    {
        id: 5,
        name: 'Sara Okafor',
        initials: 'SO',
        color: '#A8DADC',
        rating: 4.9,
        reviews: 176,
        rate: 1699,
        pets: ['Dog', 'Cat', 'Bird', 'Rabbit'],
        fencedYard: true,
        experience: 'Expert',
        services: ['Walking', 'Sitting', 'Feeding'],
        location: 'Austin, TX',
    },
    {
        id: 6,
        name: 'Liam Foster',
        initials: 'LF',
        color: '#C77DFF',
        rating: 4.4,
        reviews: 61,
        rate: 1199,
        pets: ['Dog', 'Rabbit'],
        fencedYard: true,
        experience: 'Intermediate',
        services: ['Walking', 'Feeding'],
        location: 'Austin, TX',
    },
];

/* ────────────────────────────────────────────────
   2. AVAILABILITY DATA
   Key format: "YYYY-MM-DD" → 'available' | 'limited' | 'booked'
──────────────────────────────────────────────── */
const buildAvailability = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    const today = now.getDate();

    const data = {};

    // Populate two months of data
    for (let m = 0; m <= 1; m++) {
        const d = new Date(year, month + m, 1);
        const daysInMonth = new Date(year, month + m + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isPast = (m === 0 && day < today);
            if (isPast) continue;

            // Some hardcoded patterns
            const mod = (day * 7 + m * 13) % 10;
            if (mod < 5) data[key] = 'available';
            else if (mod < 8) data[key] = 'limited';
            else data[key] = 'booked';
        }
    }

    // Force a few specific states near today
    const pad = n => String(n).padStart(2, '0');
    const fmtDate = (y, mo, d) => `${y}-${pad(mo + 1)}-${pad(d)}`;
    if (today + 1 <= new Date(year, month + 1, 0).getDate())
        data[fmtDate(year, month, today + 1)] = 'available';
    if (today + 2 <= new Date(year, month + 1, 0).getDate())
        data[fmtDate(year, month, today + 2)] = 'available';
    if (today + 3 <= new Date(year, month + 1, 0).getDate())
        data[fmtDate(year, month, today + 3)] = 'limited';

    return data;
};

let availabilityData = buildAvailability();

/* ────────────────────────────────────────────────
   3. UTILITY
──────────────────────────────────────────────── */
const HOLIDAY_MONTHS_DAYS = [
    [11, 24], [11, 25], [11, 31], [0, 1], // Dec 24,25,31 & Jan 1
];
const PET_ICONS = { Dog: '🐕', Cat: '🐈', Bird: '🐦', Rabbit: '🐇' };
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

function isHoliday(dateObj) {
    const m = dateObj.getMonth();
    const d = dateObj.getDate();
    return HOLIDAY_MONTHS_DAYS.some(([hm, hd]) => hm === m && hd === d);
}

function formatDate(dateObj) {
    const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', opts);
}

function dateKey(dateObj) {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, '0');
    const d = String(dateObj.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function parseKey(key) {
    const [y, m, d] = key.split('-').map(Number);
    return new Date(y, m - 1, d);
}

function starsHTML(rating) {
    const full = Math.floor(rating);
    const half = (rating - full) >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = '';
    for (let i = 0; i < full; i++)  html += '<span class="star filled">★</span>';
    if (half) html += '<span class="star half">★</span>';
    for (let i = 0; i < empty; i++) html += '<span class="star">★</span>';
    return html;
}

function showToast(msg, type = 'success') {
    const container = document.querySelector('.toast-container') || (() => {
        const el = document.createElement('div');
        el.className = 'toast-container';
        document.body.appendChild(el);
        return el;
    })();
    const t = document.createElement('div');
    t.className = `toast${type === 'error' ? ' toast-error' : ''}`;
    t.innerHTML = `<span class="toast-icon">${type === 'error' ? '⚠️' : '✅'}</span> ${msg}`;
    container.appendChild(t);
    setTimeout(() => {
        t.classList.add('removing');
        setTimeout(() => t.remove(), 320);
    }, 3400);
}

/* ────────────────────────────────────────────────
   4. PRICE CALCULATOR
──────────────────────────────────────────────── */
const BASE_RATES = {
    '1hr': (r) => r,
    '2hr': (r) => r * 2,
    'half': (r) => r * 4,
    'full': (r) => r * 8,
};
const DURATION_LABELS = {
    '1hr': '1 Hour',
    '2hr': '2 Hours',
    'half': 'Half Day (4 hrs)',
    'full': 'Full Day (8 hrs)',
};

function calcPrice({ rate, duration, petCount, service, dateStr }) {
    const base = BASE_RATES[duration](rate);
    const dateObj = parseKey(dateStr);
    const holiday = isHoliday(dateObj);
    const holidaySurcharge = holiday ? base * 0.25 : 0;
    const afterSurcharge = base + holidaySurcharge;
    const extraPets = Math.max(0, petCount - 1);
    const multiPetDiscount = afterSurcharge * (extraPets * 0.10);
    const isBundle = service === 'bundle';
    const bundleDiscount = isBundle ? (afterSurcharge - multiPetDiscount) * 0.15 : 0;
    const total = afterSurcharge - multiPetDiscount - bundleDiscount;
    return { base, holidaySurcharge, multiPetDiscount, bundleDiscount, total, holiday };
}

function renderPriceBox(box, priceInfo) {
    const { base, holidaySurcharge, multiPetDiscount, bundleDiscount, total, holiday } = priceInfo;
    const fmt = n => `₹${Math.round(n).toLocaleString('en-IN')}`;
    box.innerHTML = `
    <div class="price-row"><span>Base price</span><span>${fmt(base)}</span></div>
    ${holiday ? `<div class="price-row surcharge"><span>🎄 Holiday surcharge (+25%)</span><span>+${fmt(holidaySurcharge)}</span></div>` : ''}
    ${multiPetDiscount > 0 ? `<div class="price-row discount"><span>Multi-pet discount</span><span>-${fmt(multiPetDiscount)}</span></div>` : ''}
    ${bundleDiscount > 0 ? `<div class="price-row discount"><span>Walk+Feed bundle (-15%)</span><span>-${fmt(bundleDiscount)}</span></div>` : ''}
    <div class="price-row total"><span>Total</span><span>${fmt(total)}</span></div>
  `;
}

/* ────────────────────────────────────────────────
   5. CONTACT MODAL (sitters page)
──────────────────────────────────────────────── */
function initContactModal() {
    const overlay = document.getElementById('contactModal');
    if (!overlay) return;

    const closeBtn = overlay.querySelector('.modal__close');
    const cancelBtn = overlay.querySelector('#contactCancel');
    const form = overlay.querySelector('#contactForm');
    const sitterNameEl = overlay.querySelector('#modalSitterName');

    function closeModal() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
    }

    window.openContactModal = function (sitterName) {
        if (sitterNameEl) sitterNameEl.textContent = sitterName;
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    closeBtn && closeBtn.addEventListener('click', closeModal);
    cancelBtn && cancelBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeModal();
    });

    form && form.addEventListener('submit', e => {
        e.preventDefault();
        closeModal();
        showToast('Message sent! The sitter will reply shortly. 🐾');
    });
}

/* ────────────────────────────────────────────────
   6. SITTER CARDS (sitters.html)
──────────────────────────────────────────────── */
function renderSitterCard(sitter) {
    const expClass = {
        Beginner: 'exp-beginner',
        Intermediate: 'exp-intermediate',
        Expert: 'exp-expert',
    }[sitter.experience];

    const petBadges = sitter.pets.map(p =>
        `<span class="pet-badge">${PET_ICONS[p]} ${p}</span>`).join('');

    const serviceTags = sitter.services.map(s =>
        `<span class="service-chip">${s}</span>`).join('');

    const yardClass = sitter.fencedYard ? 'yard-yes' : 'yard-no';
    const yardText = sitter.fencedYard ? '🌿 Fenced Yard' : '🚫 No Yard';

    const article = document.createElement('article');
    article.className = 'sitter-card';
    article.dataset.pets = sitter.pets.join(',');
    article.dataset.exp = sitter.experience;
    article.dataset.id = sitter.id;

    article.innerHTML = `
    <div class="card__header">
      <div class="card__avatar" style="background:${sitter.color}" aria-label="Profile photo of ${sitter.name}">
        ${sitter.initials}
      </div>
      <div class="card__name-wrap">
        <div class="card__name">
          ${sitter.name}
          <span class="verified-badge" title="Verified Sitter" aria-label="Verified">✓</span>
        </div>
        <div class="star-rating">
          <div class="stars" aria-label="${sitter.rating} stars out of 5">${starsHTML(sitter.rating)}</div>
          <span class="rating-text">${sitter.rating} ★ (${sitter.reviews} reviews)</span>
        </div>
      </div>
      <div class="card__rate">₹${sitter.rate.toLocaleString('en-IN')}/hr</div>
    </div>

    <div class="card__divider"></div>

    <div class="card__pets" aria-label="Accepted pet types">${petBadges}</div>

    <div class="card__info-row">
      <span class="badge ${expClass}">${sitter.experience}</span>
      <span class="badge ${yardClass}">${yardText}</span>
    </div>

    <div class="card__services">${serviceTags}</div>

    <div class="card__pricing">
      <span class="pricing-tag-discount">🐾 2nd Pet -10%</span>
      <span class="pricing-tag-bundle">🎁 Walk+Feed Bundle -15%</span>
    </div>

    <div class="card__divider"></div>

    <div class="card__actions">
      <a href="Availability.html?sitter=${sitter.id}"
         class="btn btn-outline-green"
         aria-label="View availability for ${sitter.name}">
        <i class="fa-regular fa-calendar" aria-hidden="true"></i> Availability
      </a>
      <button class="btn btn-primary"
              onclick="openContactModal('${sitter.name}')"
              aria-label="Contact ${sitter.name}">
        <i class="fa-regular fa-envelope" aria-hidden="true"></i> Contact
      </button>
    </div>
  `;
    return article;
}

function renderSitters(list) {
    const grid = document.getElementById('sittersGrid');
    if (!grid) return;
    grid.innerHTML = '';
    if (list.length === 0) {
        grid.innerHTML = `
      <div style="grid-column:1/-1;text-align:center;padding:60px 0;color:var(--text-light)">
        <div style="font-size:3rem;margin-bottom:12px">🐕</div>
        <p style="font-size:1.05rem;font-weight:600">No sitters match your filters.<br>Try adjusting your search!</p>
      </div>`;
        return;
    }
    list.forEach(s => grid.appendChild(renderSitterCard(s)));
}

function initFilters() {
    const grid = document.getElementById('sittersGrid');
    if (!grid) return;

    renderSitters(SITTERS);

    const filterBtn = document.getElementById('filterBtn');
    const petFilter = document.getElementById('petFilter');
    const expFilter = document.getElementById('expFilter');
    const locInput = document.getElementById('locInput');

    function applyFilters() {
        const pet = petFilter ? petFilter.value : '';
        const exp = expFilter ? expFilter.value : '';
        const loc = locInput ? locInput.value.trim().toLowerCase() : '';
        const filtered = SITTERS.filter(s => {
            if (pet && !s.pets.includes(pet)) return false;
            if (exp && s.experience !== exp) return false;
            return true;
        });
        renderSitters(filtered);
    }

    filterBtn && filterBtn.addEventListener('click', applyFilters);
    petFilter && petFilter.addEventListener('change', applyFilters);
    expFilter && expFilter.addEventListener('change', applyFilters);
}

/* ────────────────────────────────────────────────
   7. CALENDAR (Availability.html)
──────────────────────────────────────────────── */
let currentCalYear, currentCalMonth;
let selectedSitterId = 1;
let selectedDateKey = null;

function initCalendar() {
    const calGrid = document.getElementById('calGrid');
    if (!calGrid) return;

    const now = new Date();
    currentCalYear = now.getFullYear();
    currentCalMonth = now.getMonth();

    renderCalendar();

    document.getElementById('calPrev').addEventListener('click', () => {
        const prev = new Date(currentCalYear, currentCalMonth - 1, 1);
        currentCalYear = prev.getFullYear();
        currentCalMonth = prev.getMonth();
        renderCalendar();
    });
    document.getElementById('calNext').addEventListener('click', () => {
        const next = new Date(currentCalYear, currentCalMonth + 1, 1);
        currentCalYear = next.getFullYear();
        currentCalMonth = next.getMonth();
        renderCalendar();
    });
}

function renderCalendar() {
    const grid = document.getElementById('calGrid');
    const title = document.getElementById('calTitle');
    if (!grid || !title) return;

    title.textContent = `${MONTH_NAMES[currentCalMonth]} ${currentCalYear}`;
    grid.innerHTML = '';

    const firstDay = new Date(currentCalYear, currentCalMonth, 1).getDay();
    const daysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty leading cells
    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement('div');
        empty.className = 'cal-day empty';
        grid.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(currentCalYear, currentCalMonth, day);
        const key = dateKey(dateObj);
        const isPast = dateObj < today;
        const holiday = isHoliday(dateObj);
        const isToday = dateObj.getTime() === today.getTime();
        const status = availabilityData[key] || (isPast ? 'past' : 'available');

        const cell = document.createElement('div');
        cell.className = 'cal-day';

        if (isPast) {
            cell.classList.add('past');
            cell.title = 'Past date';
        } else {
            cell.classList.add(status);
            cell.title = status === 'available' ? 'Available — click to book'
                : status === 'limited' ? 'Limited slots — click to book'
                    : 'Fully booked';
        }
        if (isToday) cell.classList.add('today');
        if (holiday && !isPast) {
            cell.classList.add('holiday');
            cell.innerHTML = `<span class="holiday-star" title="Holiday">⭐</span>`;
        }

        cell.innerHTML += `<span>${day}</span>`;

        if (!isPast && (status === 'available' || status === 'limited')) {
            cell.setAttribute('tabindex', '0');
            cell.setAttribute('role', 'button');
            cell.setAttribute('aria-label', `${formatDate(dateObj)}, ${status}`);
            cell.addEventListener('click', () => openBookingModal(key));
            cell.addEventListener('keydown', e => {
                if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openBookingModal(key); }
            });
        }

        grid.appendChild(cell);
    }
}

/* ────────────────────────────────────────────────
   8. BOOKING MODAL (Availability.html)
──────────────────────────────────────────────── */
function initBookingModal() {
    const overlay = document.getElementById('bookingModal');
    if (!overlay) return;

    const closeBtn = overlay.querySelector('.modal__close');
    const cancelBtn = overlay.querySelector('#bookCancel');
    const confirmBtn = overlay.querySelector('#bookConfirm');
    const petCount = overlay.querySelector('#petCount');
    const service = overlay.querySelector('#serviceType');
    const duration = overlay.querySelector('#durationSelect');
    const priceBox = overlay.querySelector('#priceBox');

    function getActiveSitter() {
        return SITTERS.find(s => s.id === selectedSitterId) || SITTERS[0];
    }

    function refreshPrice() {
        if (!selectedDateKey) return;
        const sitter = getActiveSitter();
        const info = calcPrice({
            rate: sitter.rate,
            duration: duration.value,
            petCount: parseInt(petCount.value) || 1,
            service: service.value,
            dateStr: selectedDateKey,
        });
        renderPriceBox(priceBox, info);
    }

    window.openBookingModal = function (key) {
        selectedDateKey = key;
        const sitter = getActiveSitter();
        const dateObj = parseKey(key);
        const holiday = isHoliday(dateObj);

        overlay.querySelector('#modalDateText').textContent = formatDate(dateObj);
        overlay.querySelector('#modalSitterLabel').textContent = `with ${sitter.name}`;
        if (overlay.querySelector('#holidayNote')) {
            overlay.querySelector('#holidayNote').style.display = holiday ? 'flex' : 'none';
        }

        refreshPrice();
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
    };

    function closeBooking() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        selectedDateKey = null;
    }

    closeBtn && closeBtn.addEventListener('click', closeBooking);
    cancelBtn && cancelBtn.addEventListener('click', closeBooking);
    overlay.addEventListener('click', e => { if (e.target === overlay) closeBooking(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeBooking(); });

    petCount && petCount.addEventListener('input', refreshPrice);
    service && service.addEventListener('change', refreshPrice);
    duration && duration.addEventListener('change', refreshPrice);

    confirmBtn && confirmBtn.addEventListener('click', () => {
        if (!selectedDateKey) return;
        // Update state → mark as booked
        availabilityData[selectedDateKey] = 'booked';
        const sitter = getActiveSitter();
        const info = calcPrice({
            rate: sitter.rate,
            duration: duration.value,
            petCount: parseInt(petCount.value) || 1,
            service: service.value,
            dateStr: selectedDateKey,
        });
        // Save booking to localStorage
        saveBooking({
            id: Date.now(),
            sitterId: sitter.id,
            sitterName: sitter.name,
            sitterInitials: sitter.initials,
            sitterColor: sitter.color,
            date: selectedDateKey,
            dateFormatted: formatDate(parseKey(selectedDateKey)),
            service: service.value,
            serviceLabel: service.options[service.selectedIndex].text,
            petCount: parseInt(petCount.value) || 1,
            duration: DURATION_LABELS[duration.value],
            total: info.total,
            holiday: info.holiday,
            status: 'Confirmed',
        });
        renderCalendar();
        renderBookings();
        closeBooking();
        showToast(`🎉 Booking confirmed with ${sitter.name} for ₹${Math.round(info.total).toLocaleString('en-IN')}!`);
    });
}

/* ────────────────────────────────────────────────
   9. SITTER TABS (Availability.html)
──────────────────────────────────────────────── */
function initSitterTabs() {
    const tabs = document.querySelectorAll('.sitter-tab');
    if (!tabs.length) return;

    // Pre-select from URL param
    const params = new URLSearchParams(window.location.search);
    const paramId = parseInt(params.get('sitter'));
    if (paramId) selectedSitterId = paramId;

    tabs.forEach(tab => {
        const id = parseInt(tab.dataset.id);
        if (id === selectedSitterId) tab.classList.add('active');

        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            selectedSitterId = id;
            updateSidebarForSitter();
        });
    });

    updateSidebarForSitter();
}

function updateSidebarForSitter() {
    const sitter = SITTERS.find(s => s.id === selectedSitterId) || SITTERS[0];
    const nameEl = document.getElementById('sidebarSitterName');
    const rateEl = document.getElementById('sidebarRate');
    const expEl = document.getElementById('sidebarExp');
    const petsEl = document.getElementById('sidebarPets');
    if (nameEl) nameEl.textContent = sitter.name;
    if (rateEl) rateEl.textContent = `₹${sitter.rate.toLocaleString('en-IN')}/hr`;
    if (expEl) expEl.textContent = sitter.experience;
    if (petsEl) petsEl.textContent = sitter.pets.join(', ');
}

/* ────────────────────────────────────────────────
   10. HAMBURGER MENU
──────────────────────────────────────────────── */
function initHamburger() {
    const btn = document.getElementById('hamburger');
    const menu = document.getElementById('mobileMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });
}

/* ────────────────────────────────────────────────
   11. MY BOOKINGS
──────────────────────────────────────────────── */
const BOOKINGS_KEY = 'pawstay_bookings';

function loadBookings() {
    try { return JSON.parse(localStorage.getItem(BOOKINGS_KEY)) || []; }
    catch { return []; }
}

function saveBooking(booking) {
    const list = loadBookings();
    list.unshift(booking); // newest first
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(list));
}

const SERVICE_ICONS = {
    walk: '🦮', sit: '🏠', feed: '🍽️', bundle: '🎁',
};
const STATUS_COLORS = { Confirmed: '#81B29A', Cancelled: '#E07A5F' };

function renderBookings() {
    const section = document.getElementById('myBookingsGrid');
    if (!section) return;

    const list = loadBookings();
    const confirmed = list.filter(b => b.status !== 'Cancelled');
    const countEl = document.getElementById('bookingsCount');
    if (countEl) countEl.textContent = confirmed.length;

    if (confirmed.length === 0) {
        section.innerHTML = `
      <div class="bookings-empty">
        <div class="bookings-empty__icon">📅</div>
        <p class="bookings-empty__text">No bookings yet.</p>
        <p class="bookings-empty__sub">Check availability and confirm a booking — it'll appear here!</p>
        <a href="Availability.html" class="btn btn-primary" style="margin-top:16px">
          <i class="fa-regular fa-calendar" aria-hidden="true"></i> View Availability
        </a>
      </div>`;
        return;
    }

    section.innerHTML = confirmed.map(b => {
        const icon = SERVICE_ICONS[b.service] || '📋';
        const statusColor = STATUS_COLORS[b.status] || '#9fa3bf';
        return `
      <article class="booking-card" aria-label="Booking with ${b.sitterName} on ${b.dateFormatted}">
        <div class="booking-card__header">
          <div class="booking-card__avatar" style="background:${b.sitterColor}">${b.sitterInitials}</div>
          <div class="booking-card__info">
            <div class="booking-card__name">${b.sitterName} <span class="verified-badge" aria-label="Verified">✓</span></div>
            <div class="booking-card__date">
              <i class="fa-regular fa-calendar" aria-hidden="true"></i> ${b.dateFormatted}
            </div>
          </div>
          <span class="booking-card__status" style="background:${statusColor}20;color:${statusColor};border:1.5px solid ${statusColor}40">
            ${b.status}
          </span>
        </div>
        <div class="booking-card__divider"></div>
        <div class="booking-card__meta">
          <span>${icon} ${b.serviceLabel}</span>
          <span>🐾 ${b.petCount} pet${b.petCount > 1 ? 's' : ''}</span>
          <span>⏱ ${b.duration}</span>
          ${b.holiday ? '<span class="booking-holiday">🎄 Holiday</span>' : ''}
        </div>
        <div class="booking-card__total">
          Total paid: <strong>₹${Math.round(b.total).toLocaleString('en-IN')}</strong>
        </div>
        <button class="booking-card__cancel btn btn-secondary"
                data-id="${b.id}"
                aria-label="Cancel booking with ${b.sitterName}">
          <i class="fa-solid fa-xmark" aria-hidden="true"></i> Cancel Booking
        </button>
      </article>`;
    }).join('');

    // Wire up cancel buttons
    section.querySelectorAll('.booking-card__cancel').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const targetId = btn.dataset.id;           // string comparison — no parseInt
            const all = loadBookings();
            const idx = all.findIndex(b => String(b.id) === targetId);
            if (idx >= 0) {
                all.splice(idx, 1);                    // remove instead of mutating status
                localStorage.setItem(BOOKINGS_KEY, JSON.stringify(all));
                renderBookings();
                showToast('Booking cancelled and removed. 🐾', 'error');
            }
        });
    });
}

/* ────────────────────────────────────────────────
   12. INIT
──────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    initHamburger();
    initContactModal();
    initFilters();
    initCalendar();
    initSitterTabs();
    initBookingModal();
    renderBookings();
});
