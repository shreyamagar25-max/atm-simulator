
"use strict";

// Demo account details
const DEMO_ACCOUNT = "1234567890";
const INITIAL_BALANCE = 10000;

let currentPIN = "1234";
let balance = INITIAL_BALANCE;
let transactions = [];
let loggedIn = false;

// Save and restore demo data
function saveData() {
  try {
    localStorage.setItem("atmDemoData", JSON.stringify({
      balance,
      transactions,
      currentPIN
    }));
  } catch (error) {
    console.warn("Demo data could not be saved.");
  }
}

function loadData() {
  try {
    const saved = localStorage.getItem("atmDemoData");
    if (!saved) return;

    const data = JSON.parse(saved);

    if (
      Number.isFinite(data.balance) &&
      data.balance >= 0 &&
      Array.isArray(data.transactions) &&
      typeof data.currentPIN === "string" &&
      /^\d{4}$/.test(data.currentPIN)
    ) {
      balance = data.balance;
      currentPIN = data.currentPIN;

      // Restore only valid transaction records
      transactions = data.transactions.filter(t =>
        t &&
        ["Deposit", "Withdrawal"].includes(t.type) &&
        Number.isFinite(t.amount) &&
        Number.isFinite(t.balanceAfter) &&
        typeof t.date === "string"
      );
    }
  } catch (error) {
    console.warn("Saved demo data was invalid.");
  }
}

// Screen navigation
const screens = [
  "welcomeScreen",
  "loginScreen",
  "dashboardScreen"
];

const sections = [
  "depositSection",
  "withdrawSection",
  "historySection",
  "pinSection"
];

function hideAllScreens() {
  [...screens, ...sections].forEach(id => {
    document.getElementById(id).classList.add("hidden");
  });
}

function showWelcome() {
  hideAllScreens();
  document.getElementById("welcomeScreen").classList.remove("hidden");
}

function showLogin() {
  hideAllScreens();
  document.getElementById("loginScreen").classList.remove("hidden");
  document.getElementById("loginMessage").textContent = "";
}

function showDashboard() {
  if (!loggedIn) {
    showLogin();
    return;
  }

  hideAllScreens();
  document.getElementById("dashboardScreen").classList.remove("hidden");
  document.getElementById("logoutBtn").classList.remove("hidden");
  updateBalance();
}

function showSection(sectionId) {
  if (!loggedIn) return;

  hideAllScreens();
  document.getElementById("dashboardScreen").classList.remove("hidden");
  document.getElementById(sectionId).classList.remove("hidden");

  if (sectionId === "historySection") {
    
function displayTransactions(records = transactions) {
  const list = document.getElementById("transactionList");
  const emptyMessage = document.getElementById("emptyHistory");

  list.replaceChildren();

  // Display newest transaction first
  const newestFirst = [...records].reverse();

  newestFirst.forEach(transaction => {
    const row = document.createElement("tr");

    [
      transaction.type,
      formatMoney(transaction.amount),
      transaction.date,
      formatMoney(transaction.balanceAfter)
    ].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    list.appendChild(row);
  });

  emptyMessage.textContent = transactions.length === 0
    ? "No transactions yet."
    : "No matching transactions found.";

  emptyMessage.classList.toggle("hidden", records.length > 0);
}

// Linear Search Algorithm
function searchTransactions() {
  const query = document
    .getElementById("searchTransaction")
    .value.trim()
    .toLowerCase();

  if (query === "") {
    displayTransactions();
    return;
  }
  



function sortTransactions() {
  console.log("Sort button clicked");
  console.log("Transactions:", transactions);

  const sortedTransactions = [...transactions];

  // Bubble Sort: lowest amount to highest
  for (let i = 0; i < sortedTransactions.length - 1; i++) {
    for (let j = 0; j < sortedTransactions.length - 1 - i; j++) {
      const firstAmount = Number(sortedTransactions[j].amount);
      const secondAmount = Number(sortedTransactions[j + 1].amount);

      if (firstAmount > secondAmount) {
        const temp = sortedTransactions[j];
        sortedTransactions[j] = sortedTransactions[j + 1];
        sortedTransactions[j + 1] = temp;
      }
    }
  }

  displayTransactions(sortedTransactions);
}
displayTransactions(sortedTransactions);
}




  const results = [];

  // Check each transaction one by one
  for (const transaction of transactions) {
    const searchableText =
      `${transaction.type} ${transaction.amount} ${transaction.date}`
        .toLowerCase();

    if (searchableText.includes(query)) {
      results.push(transaction);
    }
  }

  displayTransactions(results);
}

  }


function logout() {
  loggedIn = false;
  document.getElementById("logoutBtn").classList.add("hidden");
  document.getElementById("loginForm").reset();
  showWelcome();
}

// Login validation
document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault();

  const account = document.getElementById("accountNumber").value.trim();
  const pin = document.getElementById("pin").value.trim();
  const message = document.getElementById("loginMessage");

  if (account === DEMO_ACCOUNT && pin === currentPIN) {
    loggedIn = true;
    message.textContent = "";
    document.getElementById("loginForm").reset();
    showDashboard();
  } else {
    message.textContent = "Incorrect account number or PIN.";
    message.className = "message error";
  }
});

// Display current balance
function updateBalance() {
  document.getElementById("balance").textContent =
    formatMoney(balance);
}

function formatMoney(amount) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2
  });
}

// Record a transaction
function addTransaction(type, amount) {
  transactions.push({
    type,
    amount,
    date: new Date().toLocaleString("en-IN"),
    balanceAfter: balance
  });

  saveData();
  updateBalance();
}

// Deposit money
document.getElementById("depositForm").addEventListener("submit", function (event) {
  event.preventDefault();
  if (!loggedIn) return;

  const input = document.getElementById("depositAmount");
  const amount = Number(input.value);
  const message = document.getElementById("depositMessage");

  if (!Number.isFinite(amount) || amount <= 0) {
    showMessage(message, "Enter a valid positive amount.", false);
    return;
  }

  if (amount > 1000000) {
    showMessage(message, "Demo limit: maximum ₹10,00,000 per transaction.", false);
    return;
  }

  balance = Math.round((balance + amount) * 100) / 100;
  addTransaction("Deposit", amount);

  showMessage(message, "Deposit successful!", true);
  input.value = "";
});

// Withdraw money
document.getElementById("withdrawForm").addEventListener("submit", function (event) {
  event.preventDefault();
  if (!loggedIn) return;

  const input = document.getElementById("withdrawAmount");
  const amount = Number(input.value);
  const message = document.getElementById("withdrawMessage");

  if (!Number.isFinite(amount) || amount <= 0) {
    showMessage(message, "Enter a valid positive amount.", false);
    return;
  }

  if (amount > 1000000) {
    showMessage(message, "Demo limit: maximum ₹10,00,000 per transaction.", false);
    return;
  }

  if (amount > balance) {
    showMessage(message, "Insufficient balance!", false);
    return;
  }

  balance = Math.round((balance - amount) * 100) / 100;
  addTransaction("Withdrawal", amount);

  showMessage(message, "Withdrawal successful!", true);
  input.value = "";
});

// Display transaction history
function displayTransactions() {
  const list = document.getElementById("transactionList");
  const emptyMessage = document.getElementById("emptyHistory");

  list.replaceChildren();

  const newestFirst = [...transactions].reverse();

  newestFirst.forEach(transaction => {
    const row = document.createElement("tr");

    [
      transaction.type,
      formatMoney(transaction.amount),
      transaction.date,
      formatMoney(transaction.balanceAfter)
    ].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    list.appendChild(row);
  });

  emptyMessage.classList.toggle("hidden", transactions.length > 0);
}

// Change PIN
document.getElementById("pinForm").addEventListener("submit", function (event) {
  event.preventDefault();
  if (!loggedIn) return;

  const oldPIN = document.getElementById("currentPin").value;
  const newPIN = document.getElementById("newPin").value;
  const message = document.getElementById("pinMessage");

  if (oldPIN !== currentPIN) {
    showMessage(message, "Current PIN is incorrect.", false);
    return;
  }

  if (!/^\d{4}$/.test(newPIN)) {
    showMessage(message, "New PIN must contain exactly 4 digits.", false);
    return;
  }

  if (newPIN === currentPIN) {
    showMessage(message, "Choose a different PIN.", false);
    return;
  }

  currentPIN = newPIN;
  saveData();
  this.reset();

  showMessage(message, "PIN changed successfully.", true);
});

// Reusable message function
function showMessage(element, text, success) {
  element.textContent = text;
  element.className = success
    ? "message success"
    : "message error";
}

// Start application
loadData();
showWelcome();