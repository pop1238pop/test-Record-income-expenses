const form = document.getElementById('expense-form');
const expenseList = document.getElementById('expense-list');

// ฟังก์ชันสำหรับเพิ่มรายการ
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const amount = document.getElementById('amount').value;
    const date = document.getElementById('date').value;
    const type = document.getElementById('type').value;

    const response = await fetch('http://localhost:5000/api/expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, amount, date, type }),
    });

    if (response.ok) {
        form.reset();
        loadExpenses();
    }
});

// ฟังก์ชันสำหรับโหลดรายการ
async function loadExpenses() {
    const response = await fetch('http://localhost:5000/api/expenses');
    const expenses = await response.json();
    expenseList.innerHTML = '';
    
    expenses.forEach(expense => {
        const div = document.createElement('div');
        div.textContent = `${expense.type}: ${expense.name} - ${expense.amount} บาท (วันที่: ${expense.date})`;
        expenseList.appendChild(div);
    });
}

// โหลดรายการเมื่อเริ่มต้น
loadExpenses();

async function deleteExpense(id) {
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'DELETE',
    });
    loadExpenses(); // โหลดรายการใหม่
}

async function updateExpense(id, name, amount, date, type) {
    await fetch(`http://localhost:5000/api/expenses/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, amount, date, type }),
    });
    loadExpenses(); // โหลดรายการใหม่
}

async function loadExpenses() {
    const response = await fetch('http://localhost:5000/api/expenses');
    const expenses = await response.json();
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const div = document.createElement('div');
        div.innerHTML = `
            ${expense.type}: ${expense.name} - ${expense.amount} บาท (วันที่: ${expense.date}) 
            <button onclick="deleteExpense(${expense.id})">ลบ</button>
            <button onclick="showUpdateForm(${expense.id}, '${expense.name}', ${expense.amount}, '${expense.date}', '${expense.type}')">ปรับปรุง</button>
        `;
        expenseList.appendChild(div);
    });
}

function showUpdateForm(id, name, amount, date, type) {
    document.getElementById('name').value = name;
    document.getElementById('amount').value = amount;
    document.getElementById('date').value = date;
    document.getElementById('type').value = type;

    form.onsubmit = async (e) => {
        e.preventDefault();
        await updateExpense(id, name, amount, date, type);
        form.reset();
        loadExpenses();
    };
}

async function searchByMonth(month) {
    const response = await fetch(`http://localhost:5000/api/expenses/month/${month}`);
    const expenses = await response.json();
    expenseList.innerHTML = '';

    expenses.forEach(expense => {
        const div = document.createElement('div');
        div.innerHTML = `
            ${expense.type}: ${expense.name} - ${expense.amount} บาท (วันที่: ${expense.date}) 
            <button onclick="deleteExpense(${expense.id})">ลบ</button>
            <button onclick="showUpdateForm(${expense.id}, '${expense.name}', ${expense.amount}, '${expense.date}', '${expense.type}')">ปรับปรุง</button>
        `;
        expenseList.appendChild(div);
    });
}

// ฟังก์ชันสำหรับค้นหาข้อมูลตามเดือน
const monthInput = document.createElement('input');
monthInput.type = 'number';
monthInput.placeholder = 'ค้นหาตามเดือน (1-12)';
monthInput.addEventListener('change', () => {
    const month = monthInput.value;
    searchByMonth(month);
});
document.body.prepend(monthInput);
