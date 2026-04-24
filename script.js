'use strict';

/* ============================================================
   EXPENSE TRACKER — script.js
   ============================================================ */

// ── CATEGORY CONFIG ─────────────────────────────────────────
const CATS = {
  food:          { label: 'Food',          icon: '🍔', color: '#FF6B9D', dim: 'rgba(255,107,157,0.15)' },
  transport:     { label: 'Transport',     icon: '🚗', color: '#4DC8FF', dim: 'rgba(77,200,255,0.15)'  },
  shopping:      { label: 'Shopping',      icon: '🛍', color: '#7C5CFC', dim: 'rgba(124,92,252,0.15)'  },
  entertainment: { label: 'Entertainment', icon: '🎬', color: '#FFB547', dim: 'rgba(255,181,71,0.15)'  },
  bills:         { label: 'Bills',         icon: '💡', color: '#00E5A0', dim: 'rgba(0,229,160,0.15)'   },
  health:        { label: 'Health',        icon: '💊', color: '#2DFFF0', dim: 'rgba(45,255,240,0.15)'  },
  subscriptions: { label: 'Subscriptions', icon: '📱', color: '#FF4D6A', dim: 'rgba(255,77,106,0.15)'  },
  other:         { label: 'Other',         icon: '📦', color: '#9090A8', dim: 'rgba(144,144,168,0.15)' },
};

// ── STATE ───────────────────────────────────────────────────
let expenses    = [];
let activeFilter = 'all';
let searchQuery  = '';
let trendChart   = null;
let donutChart   = null;

// ── DOM HELPERS ─────────────────────────────────────────────
const $ = id => document.getElementById(id);

// Form inputs
const eName = $('eName');
const eAmt  = $('eAmt');
const eCat  = $('eCat');

// ── LOCAL STORAGE ────────────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('expense_tracker_v3', JSON.stringify(expenses));
}

function loadFromStorage() {
  try {
    expenses = JSON.parse(localStorage.getItem('expense_tracker_v3') || '[]');
  } catch (e) {
    expenses = [];
  }
}

// ── UTILITY FUNCTIONS ────────────────────────────────────────

// Format a number as a currency string
function formatMoney(amount) {
  return '$' + amount.toLocaleString('en-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

// Escape HTML to prevent XSS
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Add error state to a field
function setFieldError(fieldId) {
  $(fieldId).classList.add('err');
}

// Remove error state from a field
function clearFieldError(fieldId) {
  $(fieldId).classList.remove('err');
}

// ── TOAST NOTIFICATION ───────────────────────────────────────
let toastTimer;

function showToast(message, isSuccess = false) {
  const toast = $('toast');
  toast.textContent = message;
  toast.style.borderColor = isSuccess ? 'var(--green)' : 'var(--border2)';
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── ADD EXPENSE ──────────────────────────────────────────────
function addExpense() {
  // Clear previous errors
  clearFieldError('fldName');
  clearFieldError('fldAmt');

  const name   = eName.value.trim();
  const amount = parseFloat(eAmt.value);
  const cat    = eCat.value;

  // Validate inputs
  let isValid = true;
  if (!name)                           { setFieldError('fldName'); isValid = false; }
  if (!amount || amount <= 0 || isNaN(amount)) { setFieldError('fldAmt');  isValid = false; }
  if (!isValid) return;

  // Create and store the new expense
  const newExpense = {
    id:       Date.now(),
    name:     name,
    amount:   amount,
    category: cat,
    ts:       Date.now()
  };

  expenses.unshift(newExpense); // Add to front (newest first)
  saveToStorage();

  // Reset form
  eName.value = '';
  eAmt.value  = '';
  eCat.value  = 'food';
  eName.focus();

  showSubmitSuccess();
  showToast('"' + name + '" added — ' + formatMoney(amount), true);
  refreshAll();
}

// ── DELETE EXPENSE ───────────────────────────────────────────
function deleteExpense(id) {
  const expense = expenses.find(e => e.id === id);
  expenses = expenses.filter(e => e.id !== id);
  saveToStorage();
  refreshAll();
  if (expense) showToast('Removed "' + expense.name + '"');
}

// ── CLEAR ALL EXPENSES ───────────────────────────────────────
function clearAllExpenses() {
  if (!expenses.length) {
    showToast('Nothing to clear');
    return;
  }
  if (!confirm('Delete all expenses? This cannot be undone.')) return;
  expenses = [];
  saveToStorage();
  refreshAll();
  showToast('All expenses cleared');
}

// ── BUTTON FEEDBACK ──────────────────────────────────────────
let submitBtnTimer;

function showSubmitSuccess() {
  const btn = $('addBtn');
  btn.classList.add('ok');
  btn.textContent = '✓ Added!';
  clearTimeout(submitBtnTimer);
  submitBtnTimer = setTimeout(() => {
    btn.classList.remove('ok');
    btn.textContent = '+ Add Expense';
  }, 1800);
}

// Ripple effect on button click
function createRipple(event) {
  const btn    = event.currentTarget;
  const rect   = btn.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className  = 'ripple';
  ripple.style.left = (event.clientX - rect.left - 5) + 'px';
  ripple.style.top  = (event.clientY - rect.top  - 5) + 'px';
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

// ── RENDER: EXPENSE LIST ──────────────────────────────────────
function renderList() {
  const list  = $('expenseList');
  const empty = $('emptyState');

  // Apply category filter
  let data = [...expenses];
  if (activeFilter !== 'all') {
    data = data.filter(e => e.category === activeFilter);
  }

  // Apply search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    data = data.filter(e =>
      e.name.toLowerCase().includes(q) ||
      CATS[e.category].label.toLowerCase().includes(q)
    );
  }

  // Clear current list
  list.innerHTML = '';

  // Show empty state if no results
  if (!data.length) {
    empty.classList.add('show');
    return;
  }
  empty.classList.remove('show');

  // Build each list item
  data.forEach((expense, index) => {
    const cat  = CATS[expense.category] || CATS.other;
    const date = new Date(expense.ts).toLocaleDateString('en-CA', {
      month: 'short',
      day:   'numeric',
      year:  'numeric'
    });

    const li = document.createElement('li');
    li.className = 'exp-item';
    li.style.animationDelay = (index * 0.04) + 's';

    li.innerHTML =
      '<div class="exp-icon" style="background:' + cat.dim + '">' + cat.icon + '</div>' +
      '<div class="exp-body">' +
        '<div class="exp-name">' + escapeHtml(expense.name) + '</div>' +
        '<div class="exp-foot">' +
          '<span class="exp-cat" style="background:' + cat.dim + ';color:' + cat.color + '">' + cat.label + '</span>' +
          '<span class="exp-date">' + date + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="exp-amt" style="color:' + cat.color + '">' + formatMoney(expense.amount) + '</div>' +
      '<button class="btn-del" data-id="' + expense.id + '" title="Delete">' +
        '<svg width="9" height="9" viewBox="0 0 9 9" fill="none">' +
          '<path d="M1 1l7 7M8 1L1 8" stroke="#FF4D6A" stroke-width="1.5" stroke-linecap="round"/>' +
        '</svg>' +
      '</button>';

    list.appendChild(li);
  });

  // Attach delete listeners to all delete buttons
  list.querySelectorAll('.btn-del').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      deleteExpense(Number(btn.dataset.id));
    });
  });
}

// ── RENDER: STATS CARDS ───────────────────────────────────────
function renderStats() {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;

  // Total & count
  $('statTotal').textContent = formatMoney(total);
  $('statCount').textContent = count;
  $('statAvg').textContent   = count
    ? 'avg ' + formatMoney(total / count) + ' per entry'
    : 'avg — per entry';

  // Biggest single expense
  if (count) {
    const biggest = expenses.reduce((a, b) => a.amount > b.amount ? a : b);
    $('statMax').textContent     = formatMoney(biggest.amount);
    $('statMaxName').textContent = biggest.name.length > 20
      ? biggest.name.slice(0, 18) + '…'
      : biggest.name;
  } else {
    $('statMax').textContent     = '—';
    $('statMaxName').textContent = '—';
  }

  // This month's total (with colour-coded badge)
  const now        = new Date();
  const monthTotal = expenses
    .filter(e => {
      const d = new Date(e.ts);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((sum, e) => sum + e.amount, 0);

  const deltaEl = $('statDelta');
  deltaEl.textContent = '↑ ' + formatMoney(monthTotal) + ' this month';
  deltaEl.className   = 'hc-delta ' + (monthTotal > 2000 ? 'down' : monthTotal > 800 ? 'warn' : 'up');

  // Top category
  if (count) {
    const tally = {};
    expenses.forEach(e => { tally[e.category] = (tally[e.category] || 0) + e.amount; });
    const [topKey, topVal] = Object.entries(tally).sort((a, b) => b[1] - a[1])[0];
    $('statTopCat').textContent = CATS[topKey].label;
    $('statTopAmt').textContent = formatMoney(topVal) + ' total';
  } else {
    $('statTopCat').textContent = '—';
    $('statTopAmt').textContent = 'no data yet';
  }
}

// ── RENDER: SPENDING TREND LINE CHART ─────────────────────────
function renderTrendChart() {
  const labels = [];
  const data   = [];

  // Build last 7 days of data
  for (let i = 6; i >= 0; i--) {
    const day = new Date();
    day.setDate(day.getDate() - i);

    labels.push(i === 0
      ? 'Today'
      : day.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
    );

    const dayTotal = expenses
      .filter(e => new Date(e.ts).toDateString() === day.toDateString())
      .reduce((sum, e) => sum + e.amount, 0);

    data.push(parseFloat(dayTotal.toFixed(2)));
  }

  const ctx  = $('trendChart').getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, 160);
  grad.addColorStop(0, 'rgba(124,92,252,0.35)');
  grad.addColorStop(1, 'rgba(124,92,252,0)');

  // Destroy previous instance before redrawing
  if (trendChart) trendChart.destroy();

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        data,
        borderColor:          '#7C5CFC',
        backgroundColor:      grad,
        borderWidth:          2,
        pointBackgroundColor: '#7C5CFC',
        pointBorderColor:     '#0A0A0F',
        pointBorderWidth:     2,
        pointRadius:          4,
        pointHoverRadius:     6,
        tension:              0.4,
        fill:                 true,
      }]
    },
    options: {
      responsive:          true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#18181F',
          borderColor:     '#2A2A38',
          borderWidth:     1,
          titleColor:      '#9090A8',
          bodyColor:       '#F0F0F8',
          titleFont: { family: "'JetBrains Mono'", size: 10 },
          bodyFont:  { family: "'Syne'", size: 13, weight: '700' },
          callbacks: { label: ctx => ' ' + formatMoney(ctx.parsed.y) }
        }
      },
      scales: {
        x: {
          grid:  { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5A5A70', font: { family: "'JetBrains Mono'", size: 9 } }
        },
        y: {
          grid:  { color: 'rgba(255,255,255,0.04)' },
          ticks: { color: '#5A5A70', font: { family: "'JetBrains Mono'", size: 9 }, callback: v => '$' + v }
        }
      }
    }
  });
}

// ── RENDER: CATEGORY DONUT CHART ──────────────────────────────
function renderDonutChart() {
  const tally = {};
  expenses.forEach(e => { tally[e.category] = (tally[e.category] || 0) + e.amount; });

  const entries    = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const grandTotal = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Update centre label
  $('donutCenter').textContent = grandTotal > 0 ? '$' + Math.round(grandTotal) : '$0';

  const ctx = $('donutChart').getContext('2d');
  if (donutChart) donutChart.destroy();

  if (!entries.length) {
    // Draw empty placeholder donut
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels:   ['Empty'],
        datasets: [{ data: [1], backgroundColor: ['#2A2A38'], borderWidth: 0 }]
      },
      options: {
        cutout:  '72%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
      }
    });
  } else {
    donutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels:   entries.map(([k]) => CATS[k].label),
        datasets: [{
          data:            entries.map(([, v]) => parseFloat(v.toFixed(2))),
          backgroundColor: entries.map(([k]) => CATS[k].color),
          borderColor:     '#0A0A0F',
          borderWidth:     3,
          hoverOffset:     6,
        }]
      },
      options: {
        cutout:  '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#18181F',
            borderColor:     '#2A2A38',
            borderWidth:     1,
            titleColor:      '#9090A8',
            bodyColor:       '#F0F0F8',
            titleFont: { family: "'JetBrains Mono'", size: 10 },
            bodyFont:  { family: "'Syne'", size: 12, weight: '700' },
            callbacks: { label: ctx => ' ' + formatMoney(ctx.parsed) }
          }
        }
      }
    });
  }

  // Build legend below the donut
  const legend = $('catLegend');
  legend.innerHTML = '';

  if (!entries.length) {
    legend.innerHTML = '<span style="font-size:0.72rem;color:var(--text3)">No data yet</span>';
    return;
  }

  entries.slice(0, 6).forEach(([key, value]) => {
    const cat = CATS[key];
    const pct = grandTotal > 0 ? Math.round((value / grandTotal) * 100) : 0;
    legend.innerHTML +=
      '<div class="legend-row">' +
        '<div class="legend-dot" style="background:' + cat.color + '"></div>' +
        '<span class="legend-label">' + cat.label + '</span>' +
        '<span class="legend-pct">' + pct + '%</span>' +
      '</div>';
  });
}

// ── RENDER: CATEGORY HORIZONTAL BARS ──────────────────────────
function renderCategoryBars() {
  const tally = {};
  expenses.forEach(e => { tally[e.category] = (tally[e.category] || 0) + e.amount; });

  const entries = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const maxVal  = entries.length ? entries[0][1] : 1;
  const el      = $('catBars');
  el.innerHTML  = '';

  if (!entries.length) {
    el.innerHTML = '<span style="font-size:0.75rem;color:var(--text3)">No data yet</span>';
    return;
  }

  entries.forEach(([key, value]) => {
    const cat = CATS[key];
    const pct = Math.round((value / maxVal) * 100);
    el.innerHTML +=
      '<div class="act-row">' +
        '<span class="act-label">' + cat.icon + ' ' + cat.label + '</span>' +
        '<div class="act-bar-wrap">' +
          '<div class="act-bar" style="width:' + pct + '%;background:' + cat.color + '"></div>' +
        '</div>' +
        '<span class="act-val">' + formatMoney(value) + '</span>' +
      '</div>';
  });
}

// ── REFRESH ALL ───────────────────────────────────────────────
function refreshAll() {
  renderList();
  renderStats();
  renderTrendChart();
  renderDonutChart();
  renderCategoryBars();
}

// ── EVENT LISTENERS ───────────────────────────────────────────

// Category filter buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.cat;
    renderList();
  });
});

// Search input
$('searchInput').addEventListener('input', e => {
  searchQuery = e.target.value.trim();
  renderList();
});

// Keyboard shortcuts in form
eName.addEventListener('keydown', e => { if (e.key === 'Enter') eAmt.focus(); });
eAmt.addEventListener('keydown',  e => { if (e.key === 'Enter') addExpense(); });

// Clear errors when user starts typing
eName.addEventListener('input', () => clearFieldError('fldName'));
eAmt.addEventListener('input',  () => clearFieldError('fldAmt'));

// Add button
$('addBtn').addEventListener('click', function (e) {
  createRipple(e);
  addExpense();
});

// Clear all button
$('clearBtn').addEventListener('click', clearAllExpenses);

// ── INIT ─────────────────────────────────────────────────────
loadFromStorage();
refreshAll();
