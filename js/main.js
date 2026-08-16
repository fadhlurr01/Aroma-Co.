/* ==========================================================================
   AROMA & CO. COFFEE ROASTERS - MAIN INTERACTION SCRIPT
   ========================================================================== */

// --- GLOBAL STATE ---
let cartState = JSON.parse(localStorage.getItem('aroma_cart')) || [];
let currentQuizStep = 0;
let quizAnswers = [];
let timerInterval = null;
let timerSeconds = 0;
let isTimerRunning = false;
let activeBrewMethod = 'v60';

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initCart();
  
  // Page specific initializations
  if (document.getElementById('menuGrid')) {
    initMenuPage();
  }
  if (document.getElementById('quizOptionsGrid')) {
    initQuizWidget();
  }
  if (document.getElementById('reservationForm')) {
    initReservationForm();
  }
  if (document.getElementById('brewTimerDisplay')) {
    initBrewingCalculator();
  }
  
  updateCartBadge();
});

// --- NAVIGATION & HEADER ---
function initNavigation() {
  const header = document.querySelector('.header');
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (mobileBtn && navMenu) {
    mobileBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const isExpanded = navMenu.classList.contains('active');
      mobileBtn.innerHTML = isExpanded 
        ? '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12"></path></svg>'
        : '<svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>';
    });
  }

  // Active Nav Link highlight based on current filename
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// --- CART & ORDER DRAWER ---
function initCart() {
  const cartBtn = document.getElementById('cartToggleBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const overlay = document.getElementById('cartOverlay');
  const drawer = document.getElementById('cartDrawer');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartBtn) cartBtn.addEventListener('click', openCart);
  if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
  if (overlay) overlay.addEventListener('click', closeCart);

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', handleCheckout);
  }

  renderCartItems();
}

function openCart() {
  document.getElementById('cartOverlay').classList.add('open');
  document.getElementById('cartDrawer').classList.add('open');
}

function closeCart() {
  document.getElementById('cartOverlay').classList.remove('open');
  document.getElementById('cartDrawer').classList.remove('open');
}

function addToCart(productId, customOptions = {}) {
  const product = COFFEE_MENU.find(item => item.id === productId);
  if (!product) return;

  const existingIndex = cartState.findIndex(item => item.id === productId && JSON.stringify(item.customOptions) === JSON.stringify(customOptions));
  
  if (existingIndex > -1) {
    cartState[existingIndex].quantity += 1;
  } else {
    cartState.push({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      customOptions: customOptions
    });
  }

  saveCart();
  renderCartItems();
  updateCartBadge();
  openCart();
  showToast(`"${product.name}" ditambahkan ke keranjang pesanan!`);
}

function removeFromCart(index) {
  cartState.splice(index, 1);
  saveCart();
  renderCartItems();
  updateCartBadge();
}

function updateCartQuantity(index, delta) {
  if (cartState[index]) {
    cartState[index].quantity += delta;
    if (cartState[index].quantity <= 0) {
      removeFromCart(index);
    } else {
      saveCart();
      renderCartItems();
      updateCartBadge();
    }
  }
}

function saveCart() {
  localStorage.setItem('aroma_cart', JSON.stringify(cartState));
}

function updateCartBadge() {
  const badge = document.getElementById('cartBadgeCount');
  if (badge) {
    const totalCount = cartState.reduce((sum, item) => sum + item.quantity, 0);
    badge.textContent = totalCount;
  }
}

function renderCartItems() {
  const body = document.getElementById('cartItemsBody');
  const subtotalEl = document.getElementById('cartSubtotal');
  const taxEl = document.getElementById('cartTax');
  const totalEl = document.getElementById('cartTotal');

  if (!body) return;

  if (cartState.length === 0) {
    body.innerHTML = `
      <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
        <svg width="64" height="64" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" style="margin: 0 auto 1rem; color: var(--border-color);"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
        <p style="font-size: 1.05rem;">Keranjang Anda masih kosong.</p>
        <p style="font-size: 0.85rem; margin-top: 0.4rem;">Jelajahi menu favorit kami dan tambahkan pesanan.</p>
      </div>
    `;
    if (subtotalEl) subtotalEl.textContent = 'Rp 0';
    if (taxEl) taxEl.textContent = 'Rp 0';
    if (totalEl) totalEl.textContent = 'Rp 0';
    return;
  }

  let subtotal = 0;
  body.innerHTML = cartState.map((item, idx) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    const metaStr = item.customOptions && Object.keys(item.customOptions).length > 0 
      ? Object.values(item.customOptions).join(' | ') 
      : 'Standar Blend';

    return `
      <div class="cart-item">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-meta">${metaStr}</div>
          <div class="cart-item-price">Rp ${itemTotal.toLocaleString('id-ID')}</div>
        </div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateCartQuantity(${idx}, -1)">-</button>
          <span style="font-size: 0.9rem; font-weight: 600;">${item.quantity}</span>
          <button class="qty-btn" onclick="updateCartQuantity(${idx}, 1)">+</button>
        </div>
      </div>
    `;
  }).join('');

  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  if (subtotalEl) subtotalEl.textContent = `Rp ${subtotal.toLocaleString('id-ID')}`;
  if (taxEl) taxEl.textContent = `Rp ${tax.toLocaleString('id-ID')}`;
  if (totalEl) totalEl.textContent = `Rp ${grandTotal.toLocaleString('id-ID')}`;
}

function handleCheckout() {
  if (cartState.length === 0) {
    showToast('Keranjang Anda kosong! Silakan pilih menu terlebih dahulu.', 'warning');
    return;
  }

  const orderId = 'ARM-' + Math.floor(100000 + Math.random() * 900000);
  const dateStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  let subtotal = 0;
  const itemsHtml = cartState.map(item => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;
    return `
      <div class="receipt-row">
        <span>${item.quantity}x ${item.name}</span>
        <span>Rp ${itemTotal.toLocaleString('id-ID')}</span>
      </div>
    `;
  }).join('');

  const tax = subtotal * 0.1;
  const grandTotal = subtotal + tax;

  const modalHtml = `
    <div class="modal-overlay open" id="receiptModal">
      <div class="modal-content">
        <button class="modal-close-btn" onclick="closeModal('receiptModal')">&times;</button>
        <div style="text-align: center; margin-bottom: 1.5rem;">
          <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--color-amber);">Struk Pemesanan Digital</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted);">Terima kasih atas pesanan Anda di Aroma & Co.</p>
        </div>
        <div class="receipt-box">
          <div class="receipt-header">
            <h4 style="font-family: var(--font-brand); color: var(--color-sand);">AROMA & CO. ROASTERS</h4>
            <p style="font-size: 0.75rem;">ID Pesanan: ${orderId}</p>
            <p style="font-size: 0.75rem;">Waktu: ${dateStr}</p>
          </div>
          ${itemsHtml}
          <div style="border-top: 1px dashed rgba(212,163,115,0.3); margin: 0.8rem 0; padding-top: 0.8rem;">
            <div class="receipt-row"><span>Subtotal</span><span>Rp ${subtotal.toLocaleString('id-ID')}</span></div>
            <div class="receipt-row"><span>Pajak (10%)</span><span>Rp ${tax.toLocaleString('id-ID')}</span></div>
            <div class="receipt-row" style="font-weight: bold; color: var(--color-gold); margin-top: 0.4rem;"><span>TOTAL BAYAR</span><span>Rp ${grandTotal.toLocaleString('id-ID')}</span></div>
          </div>
        </div>
        <p style="font-size: 0.8rem; text-align: center; color: var(--text-muted); margin-bottom: 1.5rem;">Silakan tunjukkan struk ini pada Barista saat pengambilan atau pembayaran.</p>
        <button class="btn btn-primary" style="width: 100%;" onclick="finishCheckout()">Konfirmasi & Selesai</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function finishCheckout() {
  cartState = [];
  saveCart();
  renderCartItems();
  updateCartBadge();
  closeCart();
  closeModal('receiptModal');
  showToast('Pesanan berhasil dibuat! Barista kami siap menyajikannya.', 'success');
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    setTimeout(() => modal.remove(), 300);
  }
}

// --- MENU PAGE FUNCTIONALITY ---
function initMenuPage() {
  const container = document.getElementById('menuGrid');
  const searchInput = document.getElementById('menuSearchInput');
  const categoryPills = document.querySelectorAll('.category-pill');

  let currentCategory = 'all';
  let searchQuery = '';

  function filterAndRender() {
    let filtered = COFFEE_MENU;

    if (currentCategory !== 'all') {
      filtered = filtered.filter(item => item.category === currentCategory);
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(q) || 
        item.description.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    renderMenuGrid(container, filtered);
  }

  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      categoryPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentCategory = pill.dataset.category;
      filterAndRender();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      filterAndRender();
    });
  }

  filterAndRender();
}

function renderMenuGrid(container, items) {
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
        <p style="font-size: 1.2rem; font-family: var(--font-heading);">Tidak ada menu yang sesuai kriteria pencarian.</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Coba gunakan kata kunci lain atau pilih kategori lain.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(item => `
    <div class="product-card glass-panel">
      <div class="product-card-top">
        <div class="product-card-thumb-wrap">
          <img src="${item.image || 'assets/images/prod-1.jpg'}" alt="${item.name}" class="card-img-zoom" />
          <div class="product-card-badge-pos">
            <span class="badge ${item.badgeClass}">${item.badge}</span>
          </div>
          ${item.altitude ? `<span class="product-altitude-badge">🏔️ ${item.altitude}</span>` : ''}
        </div>
        <div class="product-card-body">
          <div class="product-card-meta-row">
            <div class="product-rating-text">★ ${item.rating || '4.9'} / 5.0</div>
            <span class="product-roast-text">${item.roastLevel || 'Medium Roast'}</span>
          </div>
          <h3 class="product-card-title">${item.name}</h3>
          <p class="product-card-desc">${item.description}</p>
          ${item.tastingNotes ? `
            <div class="product-notes-chips">
              ${item.tastingNotes.slice(0, 3).map(n => `<span class="mini-note-tag">${n}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
      <div class="product-card-footer">
        <div class="price-tag-wrap">
          <span class="price-tag-caption">Harga</span>
          <span class="product-price-tag">Rp ${item.price.toLocaleString('id-ID')}</span>
        </div>
        <div class="product-card-btns">
          <button class="btn btn-primary btn-sm" onclick="addToCart('${item.id}')">
            + Pesan ➔
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// --- COFFEE QUIZ WIDGET ---
function initQuizWidget() {
  renderQuizStep();
}

function renderQuizStep() {
  const container = document.getElementById('quizOptionsGrid');
  const titleEl = document.getElementById('quizQuestionTitle');
  const progressBar = document.getElementById('quizProgressBar');
  const resultBox = document.getElementById('quizResultBox');

  if (!container || currentQuizStep >= COFFEE_QUIZ_QUESTIONS.length) {
    if (resultBox && currentQuizStep >= COFFEE_QUIZ_QUESTIONS.length) {
      showQuizResult();
    }
    return;
  }

  const q = COFFEE_QUIZ_QUESTIONS[currentQuizStep];
  titleEl.textContent = `Pertanyaan ${q.id} dari ${COFFEE_QUIZ_QUESTIONS.length}: ${q.question}`;
  progressBar.style.width = `${((currentQuizStep + 1) / COFFEE_QUIZ_QUESTIONS.length) * 100}%`;

  container.innerHTML = q.options.map((opt, idx) => `
    <div class="quiz-option-btn" onclick="selectQuizOption('${opt.score}')">
      <div class="option-icon">
        <span>0${idx + 1}</span>
      </div>
      <div class="option-text">
        <h4>${opt.text}</h4>
      </div>
    </div>
  `).join('');
}

function selectQuizOption(score) {
  quizAnswers.push(score);
  currentQuizStep++;
  if (currentQuizStep < COFFEE_QUIZ_QUESTIONS.length) {
    renderQuizStep();
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  document.getElementById('quizQuestionTitle').style.display = 'none';
  document.getElementById('quizOptionsGrid').style.display = 'none';
  const resultBox = document.getElementById('quizResultBox');
  
  // Simple score tallying
  const counts = {};
  quizAnswers.forEach(score => counts[score] = (counts[score] || 0) + 1);
  let bestCategory = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b, 'espresso');

  const matchItem = COFFEE_MENU.find(m => m.category === bestCategory) || COFFEE_MENU[0];

  resultBox.style.display = 'block';
  resultBox.innerHTML = `
    <div class="quiz-result-card glass-panel">
      <span class="badge badge-gold" style="margin-bottom: 1rem;">Rekomendasi Spesial Untuk Anda</span>
      <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--color-sand);">${matchItem.name}</h3>
      <p style="color: var(--text-muted); margin: 0.8rem 0 1.5rem; max-width: 500px;">${matchItem.description}</p>
      
      <div style="display: flex; gap: 1rem;">
        <button class="btn btn-primary" onclick="addToCart('${matchItem.id}')">Pesan Kopi Ini (Rp ${matchItem.price.toLocaleString('id-ID')})</button>
        <button class="btn btn-outline" onclick="resetQuiz()">Coba Kuis Lagi</button>
      </div>
    </div>
  `;
}

function resetQuiz() {
  currentQuizStep = 0;
  quizAnswers = [];
  document.getElementById('quizQuestionTitle').style.display = 'block';
  document.getElementById('quizOptionsGrid').style.display = 'grid';
  document.getElementById('quizResultBox').style.display = 'none';
  renderQuizStep();
}

// --- TABLE RESERVATION FORM ---
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  const seatTiles = document.querySelectorAll('.seat-tile');
  let selectedSeat = 'Indoor AC';

  seatTiles.forEach(tile => {
    tile.addEventListener('click', () => {
      seatTiles.forEach(t => t.classList.remove('selected'));
      tile.classList.add('selected');
      selectedSeat = tile.dataset.seat;
    });
  });

  if (form) {
    // Set minimum date to today
    const dateInput = document.getElementById('resDate');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const outletName = document.getElementById('resOutlet').value;
      const name = document.getElementById('resName').value;
      const phone = document.getElementById('resPhone').value;
      const date = document.getElementById('resDate').value;
      const time = document.getElementById('resTime').value;
      const guests = document.getElementById('resGuests').value;

      const bookingCode = '#RES-' + Math.floor(10000 + Math.random() * 90000);

      const modalHtml = `
        <div class="modal-overlay open" id="resModal">
          <div class="modal-content">
            <button class="modal-close-btn" onclick="closeModal('resModal')">&times;</button>
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <div style="width: 60px; height: 60px; background: rgba(42,157,143,0.2); border: 1px solid var(--success-color); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1rem; color: var(--success-color);">
                <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7"></path></svg>
              </div>
              <h3 style="font-family: var(--font-heading); font-size: 1.8rem; color: var(--color-sand);">Reservasi Berhasil Konfirmasi!</h3>
              <p style="font-size: 0.85rem; color: var(--text-muted);">Kami menantikan kedatangan Anda di Aroma & Co.</p>
            </div>
            <div class="receipt-box">
              <div class="receipt-header">
                <h4 style="font-family: var(--font-brand); color: var(--color-sand);">${outletName}</h4>
                <p style="font-size: 0.8rem; color: var(--color-amber);">Kode Reservasi: ${bookingCode}</p>
              </div>
              <div class="receipt-row"><span>Atas Nama</span><span>${name}</span></div>
              <div class="receipt-row"><span>No. Telepon</span><span>${phone}</span></div>
              <div class="receipt-row"><span>Tanggal & Waktu</span><span>${date} @ ${time} WIB</span></div>
              <div class="receipt-row"><span>Jumlah Tamu</span><span>${guests} Orang</span></div>
              <div class="receipt-row"><span>Area Meja</span><span>${selectedSeat}</span></div>
            </div>
            <button class="btn btn-primary" style="width: 100%;" onclick="closeModal('resModal')">Tutup & Simpan Tiket</button>
          </div>
        </div>
      `;
      document.body.insertAdjacentHTML('beforeend', modalHtml);
      form.reset();
    });
  }
}

// --- BREWING CALCULATOR & TIMER ---
function initBrewingCalculator() {
  const coffeeInput = document.getElementById('coffeeGramsInput');
  const waterDisplay = document.getElementById('waterVolumeDisplay');
  const methodTabs = document.querySelectorAll('.method-tab-btn');
  
  const startBtn = document.getElementById('startTimerBtn');
  const resetBtn = document.getElementById('resetTimerBtn');

  function calculateWater() {
    const guide = BREWING_GUIDES_DATA.find(g => g.id === activeBrewMethod) || BREWING_GUIDES_DATA[0];
    const grams = parseFloat(coffeeInput.value) || guide.defaultCoffeeGrams;
    const ratioParts = guide.ratio.split(':');
    const ratioMultiplier = parseFloat(ratioParts[1]) || 15;
    const waterMl = grams * ratioMultiplier;

    if (waterDisplay) waterDisplay.textContent = `${waterMl} ml`;
    
    // Update timer setup
    timerSeconds = guide.totalTimeSeconds;
    updateTimerDisplay();
  }

  methodTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      methodTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeBrewMethod = tab.dataset.method;
      
      const guide = BREWING_GUIDES_DATA.find(g => g.id === activeBrewMethod);
      if (guide && coffeeInput) {
        coffeeInput.value = guide.defaultCoffeeGrams;
      }
      stopTimer();
      calculateWater();
    });
  });

  if (coffeeInput) {
    coffeeInput.addEventListener('input', calculateWater);
  }

  if (startBtn) {
    startBtn.addEventListener('click', () => {
      if (isTimerRunning) {
        stopTimer();
      } else {
        startTimer();
      }
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      stopTimer();
      const guide = BREWING_GUIDES_DATA.find(g => g.id === activeBrewMethod) || BREWING_GUIDES_DATA[0];
      timerSeconds = guide.totalTimeSeconds;
      updateTimerDisplay();
    });
  }

  calculateWater();
}

function startTimer() {
  isTimerRunning = true;
  const startBtn = document.getElementById('startTimerBtn');
  if (startBtn) startBtn.textContent = 'Pause Timer';

  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      updateTimerDisplay();
    } else {
      stopTimer();
      showToast('Penyeduhan Selesai! Nikmati cangkir kopi Anda.', 'success');
    }
  }, 1000);
}

function stopTimer() {
  isTimerRunning = false;
  clearInterval(timerInterval);
  const startBtn = document.getElementById('startTimerBtn');
  if (startBtn) startBtn.textContent = 'Mulai Timer';
}

function updateTimerDisplay() {
  const display = document.getElementById('brewTimerDisplay');
  const phaseEl = document.getElementById('brewPhaseDisplay');

  if (!display) return;

  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  display.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const guide = BREWING_GUIDES_DATA.find(g => g.id === activeBrewMethod) || BREWING_GUIDES_DATA[0];
  const elapsedSecs = guide.totalTimeSeconds - timerSeconds;

  let currentPhase = guide.phases[0];
  for (let p of guide.phases) {
    if (elapsedSecs >= p.startSec) {
      currentPhase = p;
    }
  }

  if (phaseEl) {
    phaseEl.textContent = currentPhase.name + ': ' + currentPhase.desc;
  }
}

// --- UTILITIES & SVG ICONS ---
function showToast(message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" fill="none" stroke="var(--color-amber)" stroke-width="2" viewBox="0 0 24 24"><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function getSVGIcon(type) {
  return `<svg class="coffee-svg" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 28C16 23.5817 19.5817 20 24 20H40C44.4183 20 48 23.5817 48 28V42C48 47.5228 43.5228 52 38 52H26C20.4772 52 16 47.5228 16 42V28Z" stroke="currentColor" stroke-width="3"/>
    <path d="M48 26H51C54.3137 26 57 28.6863 57 32V34C57 37.3137 54.3137 40 51 40H48" stroke="currentColor" stroke-width="3"/>
    <path d="M22 14C22 14 24 11 24 9C24 7 22 6 22 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M32 14C32 14 34 11 34 9C34 7 32 6 32 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <path d="M42 14C42 14 44 11 44 9C44 7 42 6 42 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
}
