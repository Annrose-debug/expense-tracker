// DOM Elements
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const addBtn = document.getElementById("addBtn");
const expenseList = document.getElementById("expenseList");
const totalAmount = document.getElementById("totalAmount");
const expenseCount = document.getElementById("expenseCount");
const emptyState = document.getElementById("emptyState");
const clearAllBtn = document.getElementById("clearAllBtn");

// Load expenses from localStorage or initialize empty array
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Category icons mapping
const categoryIcons = {
  food: "🍕",
  transport: "🚗",
  shopping: "🛍️",
  entertainment: "🎬",
  bills: "💡",
  health: "🏥",
  other: "📦"
};

// Category names mapping
const categoryNames = {
  food: "Food & Dining",
  transport: "Transport",
  shopping: "Shopping",
  entertainment: "Entertainment",
  bills: "Bills & Utilities",
  health: "Health & Wellness",
  other: "Other"
};

// Initialize the app
function initApp() {
  updateUI();
  attachEventListeners();
}

// Attach event listeners
function attachEventListeners() {
  // Add expense button
  addBtn.addEventListener("click", addExpense);
  
  // Clear all expenses button
  clearAllBtn.addEventListener("click", clearAllExpenses);
  
  // Enter key support
  expenseName.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      expenseAmount.focus();
    }
  });
  
  expenseAmount.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addExpense();
    }
  });
  
  // Clear input fields when clicking
  expenseName.addEventListener("click", function() {
    this.select();
  });
  
  expenseAmount.addEventListener("click", function() {
    this.select();
  });
}

// Add new expense
function addExpense() {
  const name = expenseName.value.trim();
  const amount = parseFloat(expenseAmount.value);
  const category = expenseCategory.value;
  
  // Validation
  if (!name) {
    showError(expenseName, "Please enter an expense name");
    return;
  }
  
  if (!amount || amount <= 0 || isNaN(amount)) {
    showError(expenseAmount, "Please enter a valid amount");
    return;
  }
  
  // Create expense object
  const expense = {
    id: Date.now(), // Unique ID
    name,
    amount,
    category,
    date: new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }),
    timestamp: Date.now()
  };
  
  // Add to expenses array
  expenses.push(expense);
  
  // Save to localStorage
  saveToLocalStorage();
  
  // Update UI
  updateUI();
  
  // Clear form
  expenseName.value = "";
  expenseAmount.value = "";
  expenseCategory.value = "food";
  
  // Focus back to name input
  expenseName.focus();
  
  // Show success animation
  showSuccessAnimation();
}

// Delete expense
function deleteExpense(id) {
  // Ask for confirmation
  if (!confirm("Are you sure you want to delete this expense?")) {
    return;
  }
  
  // Filter out the expense with matching ID
  expenses = expenses.filter(expense => expense.id !== id);
  
  // Save to localStorage
  saveToLocalStorage();
  
  // Update UI
  updateUI();
  
  // Show delete animation
  showDeleteAnimation();
}

// Clear all expenses
function clearAllExpenses() {
  if (expenses.length === 0) {
    alert("There are no expenses to clear!");
    return;
  }
  
  if (confirm("Are you sure you want to delete ALL expenses? This cannot be undone!")) {
    expenses = [];
    saveToLocalStorage();
    updateUI();
    showClearAllAnimation();
  }
}

// Save expenses to localStorage
function saveToLocalStorage() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Update UI
function updateUI() {
  // Clear current list
  expenseList.innerHTML = "";
  
  // Calculate total and count
  let total = 0;
  
  // Sort expenses by date (newest first)
  expenses.sort((a, b) => b.timestamp - a.timestamp);
  
  // Loop through expenses and create list items
  expenses.forEach(expense => {
    total += expense.amount;
    
    // Create list item
    const li = document.createElement("li");
    
    // Set category for styling
    li.setAttribute("data-category", expense.category);
    
    // Create HTML for expense item
    li.innerHTML = `
      <div class="expense-item">
        <div class="expense-info">
          <span class="expense-name">${expense.name}</span>
          <div class="expense-meta">
            <span class="expense-category ${expense.category}">
              ${categoryIcons[expense.category]} ${categoryNames[expense.category]}
            </span>
            <span class="expense-date">${expense.date}</span>
          </div>
        </div>
        <div class="expense-actions">
          <span class="expense-amount">$${expense.amount.toFixed(2)}</span>
          <button class="delete-btn" data-id="${expense.id}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    
    // Add to list
    expenseList.appendChild(li);
  });
  
  // Update total and count
  totalAmount.textContent = total.toFixed(2);
  expenseCount.textContent = expenses.length;
  
  // Show/hide empty state
  if (expenses.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }
  
  // Attach delete event listeners
  attachDeleteListeners();
}

// Attach delete event listeners to all delete buttons
function attachDeleteListeners() {
  const deleteButtons = document.querySelectorAll(".delete-btn");
  
  deleteButtons.forEach(button => {
    button.addEventListener("click", (e) => {
      const id = Number(e.currentTarget.getAttribute("data-id"));
      deleteExpense(id);
    });
  });
}

// Show error message
function showError(inputElement, message) {
  // Add error class
  inputElement.style.borderColor = "#ff4757";
  
  // Create or update error message
  let errorMessage = inputElement.parentElement.querySelector(".error-message");
  
  if (!errorMessage) {
    errorMessage = document.createElement("div");
    errorMessage.className = "error-message";
    inputElement.parentElement.appendChild(errorMessage);
  }
  
  errorMessage.textContent = message;
  errorMessage.style.color = "#ff4757";
  errorMessage.style.fontSize = "0.8rem";
  errorMessage.style.marginTop = "5px";
  
  // Remove error after 3 seconds
  setTimeout(() => {
    inputElement.style.borderColor = "#e9ecef";
    if (errorMessage) {
      errorMessage.remove();
    }
  }, 3000);
}

// Show success animation
function showSuccessAnimation() {
  addBtn.innerHTML = '<i class="fas fa-check"></i> Added!';
  addBtn.style.background = "linear-gradient(135deg, #06d6a0 0%, #06b6d4 100%)";
  
  setTimeout(() => {
    addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Expense';
    addBtn.style.background = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";
  }, 1500);
}

// Show delete animation
function showDeleteAnimation() {
  // Animate the delete
  const container = document.querySelector('.container');
  container.style.transform = 'scale(0.99)';
  
  setTimeout(() => {
    container.style.transform = 'scale(1)';
  }, 300);
}

// Show clear all animation
function showClearAllAnimation() {
  // Add a shake animation to the container
  const container = document.querySelector('.container');
  container.style.animation = 'shake 0.5s ease-in-out';
  
  // Create confetti effect
  createConfetti();
  
  setTimeout(() => {
    container.style.animation = '';
  }, 500);
}

// Create confetti effect
function createConfetti() {
  const colors = ['#667eea', '#764ba2', '#ff4757', '#06d6a0', '#ffd166'];
  
  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = '50%';
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.top = '-20px';
    confetti.style.zIndex = '9999';
    confetti.style.pointerEvents = 'none';
    
    document.body.appendChild(confetti);
    
    // Animate confetti
    const animation = confetti.animate([
      { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
      { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 1000 + 1000,
      easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
    });
    
    // Remove confetti after animation
    animation.onfinish = () => {
      confetti.remove();
    };
  }
}

// Add shake animation to CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
    20%, 40%, 60%, 80% { transform: translateX(5px); }
  }
`;
document.head.appendChild(style);

// Initialize the app when page loads
document.addEventListener('DOMContentLoaded', initApp);

// Export functions for testing (optional)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    addExpense,
    deleteExpense,
    clearAllExpenses,
    saveToLocalStorage,
    updateUI
  };
}