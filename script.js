//selecting elements
const form = document.querySelector("#expense-form");
const expenseList = document.querySelector("#Expense-list");

const titleInput = document.querySelector("#title");
const amountInput = document.querySelector("#amount");
const categoryInput = document.querySelector("#category");
const dateInput = document.querySelector("#date");
const totalEl= document.querySelector("#total");

//Storage Container
let expenses = loadData();



//function For loading Existing Data
function loadData(){
    const storedData = localStorage.getItem("expenses");
    return storedData?JSON.parse(storedData) : [];
}

//Save Function
function saveData(){
    localStorage.setItem("expenses",JSON.stringify(expenses));
}

function generateID(){
    return Date.now().toString();
}
//function addExpense
function addExpense(title,amount,category,date){
    let expense = {
        id: generateID(),
        title:title,
        amount:amount,
        category:category,
        date: date
    }
    expenses.push(expense);
    saveData();
}
//function deleteExpense via ID and filter
function deleteExpense(id){
    expenses = expenses.filter(expense => expense.id !== id);
    saveData();
}
function calculateTotal(){
    let total = 0;
    expenses.forEach(expense => {
        total +=expense.amount;
    });
    return total;
}

//Adding click handler events
form.addEventListener("submit", function(e){
    e.preventDefault();  
    console.log("Form Submitted");

    const title = titleInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;

    if(!title|| amount <=0 || isNaN(amount)) return;
    addExpense(title, amount, category, date);
    form.reset();
    renderExpense();
})

function renderExpense(){
    expenseList.innerHTML = "";

    expenses.forEach(expense =>{
        const li = document.createElement("li");
        li.innerHTML = `
                <span>${expense.title} - ₹${expense.amount} (${expense.category})</span>
                <button data-id = "${expense.id}">Delete</button>
                `
        expenseList.appendChild(li);
    })
    renderTotal();

}
expenseList.addEventListener("click" , function(e){
    if(e.target.tagName ==="BUTTON"){
        const id = e.target.dataset.id;
        deleteExpense(id);
        renderExpense();
        
    }
});

function renderTotal(){
    
    totalEl.textContent = calculateTotal();
}

renderExpense();