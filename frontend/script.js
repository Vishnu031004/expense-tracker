// Check if user is logged in
function checkAuth() {
    const userId = localStorage.getItem('userId');
    const username = localStorage.getItem('username');
    
    if (!userId && window.location.pathname.includes('dashboard')) {
        window.location.href = 'index.html';
    }
    
    if (userId && username && window.location.pathname.includes('dashboard')) {
        document.getElementById('welcomeUser').textContent = `Welcome, ${username}`;
        loadExpenses();
        loadCategoryAnalysis();
    }
}

// Logout function
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = 'index.html';
}

// Add Expense
if (document.getElementById('expenseForm')) {
    document.getElementById('expenseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userId = localStorage.getItem('userId');
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const expenseDate = document.getElementById('expenseDate').value;
        const description = document.getElementById('description').value;
        
        try {
            const response = await fetch('http://localhost:3000/api/expenses/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    amount,
                    category,
                    description,
                    expense_date: expenseDate
                })
            });
            
            if (response.ok) {
                alert('Expense added successfully!');
                document.getElementById('expenseForm').reset();
                loadExpenses();
                loadCategoryAnalysis();
            }
        } catch (error) {
            alert('Failed to add expense');
        }
    });
}

// Load Expenses
async function loadExpenses() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`http://localhost:3000/api/expenses/all/${userId}`);
        const expenses = await response.json();
        
        displayExpenses(expenses);
        updateSummary(expenses);
    } catch (error) {
        console.error('Failed to load expenses');
    }
}

// Display Expenses
function displayExpenses(expenses) {
    const expenseList = document.getElementById('expenseList');
    
    if (expenses.length === 0) {
        expenseList.innerHTML = '<p style="text-align:center;color:#999;">No expenses yet. Add your first expense!</p>';
        return;
    }
    
    expenseList.innerHTML = expenses.map(expense => `
        <div class="expense-item">
            <div class="expense-details">
                <div class="expense-amount">₹${parseFloat(expense.amount).toFixed(2)}</div>
                <div>
                    <span class="expense-category">${expense.category}</span>
                    <span class="expense-date">${new Date(expense.expense_date).toLocaleDateString()}</span>
                </div>
                ${expense.description ? `<div class="expense-description">${expense.description}</div>` : ''}
            </div>
            <button class="btn-delete" onclick="deleteExpense(${expense.id})">Delete</button>
        </div>
    `).join('');
}

// Update Summary
function updateSummary(expenses) {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const currentMonth = new Date().getMonth();
    const monthTotal = expenses
        .filter(exp => new Date(exp.expense_date).getMonth() === currentMonth)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('monthAmount').textContent = `₹${monthTotal.toFixed(2)}`;
    document.getElementById('totalEntries').textContent = expenses.length;
}

// Delete Expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
        const response = await fetch(`http://localhost:3000/api/expenses/delete/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            loadExpenses();
            loadCategoryAnalysis();
        }
    } catch (error) {
        alert('Failed to delete expense');
    }
}

// Load Category Analysis
// Load Category Analysis with Charts
let pieChart = null;
let barChart = null;

async function loadCategoryAnalysis() {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`http://localhost:3000/api/expenses/category-total/${userId}`);
        const data = await response.json();
        
        if (data.length === 0) {
            displayNoData();
            return;
        }
        
        // Prepare data for charts
        const categories = data.map(item => item.category);
        const amounts = data.map(item => parseFloat(item.total));
        const total = amounts.reduce((sum, amount) => sum + amount, 0);
        
        // Create Pie Chart
        createPieChart(categories, amounts);
        
        // Create Bar Chart
        createBarChart(categories, amounts);
        
        // Display Category Details
        displayCategoryDetails(data, total);
        
    } catch (error) {
        console.error('Failed to load category analysis');
        displayNoData();
    }
}

// Create Pie Chart
function createPieChart(categories, amounts) {
    const ctx = document.getElementById('pieChart');
    
    // Destroy existing chart if it exists
    if (pieChart) {
        pieChart.destroy();
    }
    
    const colors = [
        '#667eea', '#764ba2', '#f093fb', '#4facfe',
        '#43e97b', '#fa709a', '#fee140', '#30cfd0'
    ];
    
    pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categories,
            datasets: [{
                data: amounts,
                backgroundColor: colors.slice(0, categories.length),
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Create Bar Chart
function createBarChart(categories, amounts) {
    const ctx = document.getElementById('barChart');
    
    // Destroy existing chart if it exists
    if (barChart) {
        barChart.destroy();
    }
    
    barChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categories,
            datasets: [{
                label: 'Expense Amount (₹)',
                data: amounts,
                backgroundColor: 'rgba(102, 126, 234, 0.8)',
                borderColor: 'rgba(102, 126, 234, 1)',
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return '₹' + value;
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'Amount: ₹' + context.parsed.y.toFixed(2);
                        }
                    }
                }
            }
        }
    });
}

// Display Category Details
function displayCategoryDetails(data, total) {
    const categoryDetails = document.getElementById('categoryDetails');
    
    // Category icons
    const icons = {
        'Food': '🍔',
        'Transport': '🚗',
        'Shopping': '🛍️',
        'Entertainment': '🎬',
        'Bills': '💡',
        'Health': '⚕️',
        'Other': '📌'
    };
    
    categoryDetails.innerHTML = `
        <h4 style="margin-bottom: 15px;">Detailed Breakdown</h4>
        ${data.map(item => {
            const percentage = ((parseFloat(item.total) / total) * 100).toFixed(1);
            return `
                <div class="category-item">
                    <div class="category-item-left">
                        <div class="category-icon">
                            ${icons[item.category] || '📊'}
                        </div>
                        <div class="category-info">
                            <h4>${item.category}</h4>
                            <span class="category-percentage">${percentage}% of total</span>
                        </div>
                    </div>
                    <div class="category-amount">₹${parseFloat(item.total).toFixed(2)}</div>
                </div>
            `;
        }).join('')}
    `;
}

// Display No Data Message
function displayNoData() {
    const pieCtx = document.getElementById('pieChart');
    const barCtx = document.getElementById('barChart');
    const categoryDetails = document.getElementById('categoryDetails');
    
    if (pieChart) pieChart.destroy();
    if (barChart) barChart.destroy();
    
    pieCtx.style.display = 'none';
    barCtx.style.display = 'none';
    
    categoryDetails.innerHTML = `
        <div class="no-data-message">
            <p>📊 No expense data available yet</p>
            <p style="font-size: 14px; color: #999;">Add your first expense to see beautiful charts!</p>
        </div>
    `;
}

// Filter Functions
// Global variable to store all expenses
let allExpenses = [];

// Load Expenses (Updated)
async function loadExpenses(filterCategory = '', filterDate = '') {
    const userId = localStorage.getItem('userId');
    
    try {
        const response = await fetch(`http://localhost:3000/api/expenses/all/${userId}`);
        const expenses = await response.json();
        
        // Store all expenses globally
        allExpenses = expenses;
        
        // Apply filters if provided
        let filteredExpenses = expenses;
        
        if (filterCategory) {
            filteredExpenses = filteredExpenses.filter(exp => 
                exp.category === filterCategory
            );
        }
        
        if (filterDate) {
            filteredExpenses = filteredExpenses.filter(exp => {
                const expenseDate = new Date(exp.expense_date).toISOString().split('T')[0];
                return expenseDate === filterDate;
            });
        }
        
        displayExpenses(filteredExpenses);
        updateSummary(filteredExpenses);
        
    } catch (error) {
        console.error('Failed to load expenses');
    }
}

// Apply Filters (Fixed)
// Apply Filters (with Amount Range)
function applyFilters() {
    const category = document.getElementById('filterCategory').value;
    const date = document.getElementById('filterDate').value;
    const minAmount = document.getElementById('minAmount')?.value || '';
    const maxAmount = document.getElementById('maxAmount')?.value || '';
    
    let filteredExpenses = [...allExpenses];
    
    // Filter by category
    if (category) {
        filteredExpenses = filteredExpenses.filter(exp => 
            exp.category === category
        );
    }
    
    // Filter by date
    if (date) {
        filteredExpenses = filteredExpenses.filter(exp => {
            const expenseDate = new Date(exp.expense_date).toISOString().split('T')[0];
            return expenseDate === date;
        });
    }
    
    // Filter by amount range
    if (minAmount) {
        filteredExpenses = filteredExpenses.filter(exp => 
            parseFloat(exp.amount) >= parseFloat(minAmount)
        );
    }
    
    if (maxAmount) {
        filteredExpenses = filteredExpenses.filter(exp => 
            parseFloat(exp.amount) <= parseFloat(maxAmount)
        );
    }
    
    displayExpenses(filteredExpenses);
    updateSummary(filteredExpenses);
    showFilterMessage(category, date, minAmount, maxAmount);
}

// Updated Clear Filters
function clearFilters() {
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterDate').value = '';
    if (document.getElementById('minAmount')) {
        document.getElementById('minAmount').value = '';
        document.getElementById('maxAmount').value = '';
    }
    
    displayExpenses(allExpenses);
    updateSummary(allExpenses);
    removeFilterMessage();
}
// Show Filter Message
function showFilterMessage(category, date) {
    // Remove existing message if any
    removeFilterMessage();
    
    if (!category && !date) return;
    
    const expenseList = document.getElementById('expenseList');
    const message = document.createElement('div');
    message.id = 'filterMessage';
    message.style.cssText = `
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        margin-bottom: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 14px;
    `;
    
    let filterText = '🔍 Active Filters: ';
    if (category) filterText += `Category: ${category} `;
    if (date) filterText += `Date: ${new Date(date).toLocaleDateString()}`;
    
    message.innerHTML = `
        <span>${filterText}</span>
        <button onclick="clearFilters()" style="
            background: rgba(255,255,255,0.3);
            border: none;
            color: white;
            padding: 5px 15px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
        ">Clear</button>
    `;
    
    expenseList.parentElement.insertBefore(message, expenseList);
}

// Remove Filter Message
function removeFilterMessage() {
    const existingMessage = document.getElementById('filterMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Update Summary (Modified to show filtered totals)
function updateSummary(expenses) {
    const total = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    const currentMonth = new Date().getMonth();
    const monthTotal = expenses
        .filter(exp => new Date(exp.expense_date).getMonth() === currentMonth)
        .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
    
    document.getElementById('totalAmount').textContent = `₹${total.toFixed(2)}`;
    document.getElementById('monthAmount').textContent = `₹${monthTotal.toFixed(2)}`;
    document.getElementById('totalEntries').textContent = expenses.length;
}
// Set today's date as default
if (document.getElementById('expenseDate')) {
    document.getElementById('expenseDate').valueAsDate = new Date();
}

// Initialize
checkAuth();