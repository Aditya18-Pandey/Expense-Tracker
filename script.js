//selecting elements
const form = document.querySelector("#expense-form");
const expenseList = document.querySelector("#Expense-list");

const submitBtn = document.querySelector("#submit-btn");
const cancelbtn = document.querySelector("#cancel-btn");
const titleInput = document.querySelector("#title");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");
const totalEl = document.querySelector("#total");

//Storage Container
let expenses = loadData();
let editID = null;

//function For loading Existing Data
function loadData() {
  const storedData = localStorage.getItem("expenses");
  return storedData ? JSON.parse(storedData) : [];
}

//Save Function
function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function generateID() {
  return Date.now().toString();
}
//function addExpense
function addExpense(title, amount, category, date) {
  let expense = {
    id: generateID(),
    title: title,
    amount: amount,
    category: category,
    date: date,
  };
  expenses.push(expense);
  saveData();
}
//function deleteExpense via ID and filter
function deleteExpense(id) {
  expenses = expenses.filter((expense) => expense.id !== id);
  saveData();
}

function startEdit(id) {
  const expense = expenses.find((exp) => exp.id === id);

  submitBtn.textContent = "Update Expense";
  cancelbtn.hidden = false;
  titleInput.value = expense.title;
  amountInput.value = expense.amount;
  categoryInput.value = expense.category;
  dateInput.value = expense.date;
  
  editID = id;
  renderExpense();
}

function cancelEdit(){
  editID = null;
  form.reset();
  submitBtn.textContent = "Add Expense";
  cancelbtn.hidden = true;
  renderExpense();
}
cancelbtn.addEventListener("click", cancelEdit);

function calculateTotal() {
  let total = 0;
  expenses.forEach((expense) => {
    total += expense.amount;
  });
  return total;
}

function updateExpense(id, title, amount, category, date) {
  const index = expenses.findIndex((exp) => exp.id === id);

  expenses[index] = {
    id,
    title,
    amount,
    category,
    date,
  };
  saveData();
}

//Adding click handler events for submitting of the form
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = titleInput.value.trim();
  const amount = parseFloat(amountInput.value);
  const category = categoryInput.value;
  const date = dateInput.value;

  //for checking if there's any empty field
  if (!title || amount <= 0 || isNaN(amount)) return;

  if (editID) {
    updateExpense(editID, title, amount, category, date);
  } else {
    addExpense(title, amount, category, date);
  }
  submitBtn.textContent = "Add Expense";
  cancelbtn.hidden = true;
  form.reset();
  editID = null;
  renderExpense();
});

//formatting date
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString();
}
//The rendering function
function renderExpense() {
  expenseList.innerHTML = "";

  if(expenses.length === 0){
    expenseList.innerHTML = `
    <li class= "empty-state">
      No expense yet. Add one above
    </li>
    `;
    totalEl.textContent = "0";
  }
  expenses.forEach((expense) => {
    const li = document.createElement("li");
    li.classList.add("expense-item");

    li.innerHTML = `
            <div class ="expense-info">
            <span>${expense.title} - ₹${expense.amount} </span>
            <small>${expense.category} • ${formatDate(expense.date)}</small>
            </div>
            <div class ="actions">
            <button class = "edit-btn" data-id = "${expense.id}">Edit</button>
            <button class="delete-btn" data-id = "${
              expense.id
            }">Delete</button></div>
            
        `;

    if (expense.id === editID) {
      li.classList.add("editing");
      li.querySelector(".edit-btn").textContent = "Editing";
      li.querySelector(".edit-btn").disabled = true;
    }
    expenseList.appendChild(li);
  });
  renderTotal();
}
expenseList.addEventListener("click", function (e) {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    deleteExpense(id);
    renderExpense();
  }
  if (e.target.classList.contains("edit-btn")) {
    startEdit(id);
  }
});

function renderTotal() {
  totalEl.textContent = calculateTotal();
}

renderExpense();
