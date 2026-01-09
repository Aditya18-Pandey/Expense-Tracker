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
    total = 0;
    expenses.forEach(expense => {
        total +=expense.amount;
    });
    return total;
}