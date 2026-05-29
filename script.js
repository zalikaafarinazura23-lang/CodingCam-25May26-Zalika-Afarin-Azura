const form = document.getElementById('transaction-form');
const itemName = document.getElementById('item-name');
const itemAmount = document.getElementById('item-amount');
const itemCategory = document.getElementById('item-category');
const transactionList = document.getElementById('transaction-list');
const balance = document.getElementById('balance');
const monthlyTotal = document.getElementById('monthly-total');
const limitWarning = document.getElementById('limit-warning');
const sortBtn = document.getElementById('sort-btn');
const themeToggle = document.getElementById('theme-toggle');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let darkMode = false;

const ctx = document.getElementById('expenseChart');

const expenseChart = new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ['Food', 'Transport', 'Fun', 'Shopping', 'Bills'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ]
    }]
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
});

function saveTransactions() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

function updateBalance() {
  const total = transactions.reduce((acc, item) => acc + item.amount, 0);

  balance.textContent = `Rp ${total.toLocaleString()}`;
  monthlyTotal.textContent = `Rp ${total.toLocaleString()}`;

  if (total > 1000000) {
    limitWarning.textContent = 'Spending Limit Exceeded';
    document.querySelector('.limit-card').classList.add('warning');
  } else {
    limitWarning.textContent = 'Safe Spending';
    document.querySelector('.limit-card').classList.remove('warning');
  }
}

function updateChart() {
  const categories = {
    Food: 0,
    Transport: 0,
    Fun: 0,
    Shopping: 0,
    Bills: 0
  };

  transactions.forEach(item => {
    categories[item.category] += item.amount;
  });

  expenseChart.data.datasets[0].data = [
    categories.Food,
    categories.Transport,
    categories.Fun,
    categories.Shopping,
    categories.Bills
  ];

  expenseChart.update();
}

function renderTransactions() {
  transactionList.innerHTML = '';

  transactions.forEach((transaction, index) => {
    const div = document.createElement('div');
    div.classList.add('transaction-item');

    div.innerHTML = `
      <div class="transaction-info">
        <h4>${transaction.name}</h4>
        <p class="transaction-category">
          ${transaction.category} • Rp ${transaction.amount.toLocaleString()}
        </p>
      </div>

      <button class="delete-btn" onclick="deleteTransaction(${index})">
        Delete
      </button>
    `;

    transactionList.appendChild(div);
  });

  updateBalance();
  updateChart();
}

function deleteTransaction(index) {
  transactions.splice(index, 1);
  saveTransactions();
  renderTransactions();
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = itemName.value.trim();
  const amount = Number(itemAmount.value);
  const category = itemCategory.value;

  if (!name || !amount || !category) {
    alert('Please fill all fields');
    return;
  }

  const transaction = {
    name,
    amount,
    category
  };

  transactions.push(transaction);

  saveTransactions();
  renderTransactions();

  form.reset();
});

sortBtn.addEventListener('click', () => {
  transactions.sort((a, b) => b.amount - a.amount);
  renderTransactions();
});

themeToggle.addEventListener('click', () => {
  darkMode = !darkMode;

  document.body.classList.toggle('dark');

  if (darkMode) {
    themeToggle.textContent = 'Light Mode';
  } else {
    themeToggle.textContent = 'Dark Mode';
  }
});

renderTransactions(); 