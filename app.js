console.log("app.js cargado correctamente ✅");

// ===============================
// SUPABASE CONFIG
// ===============================

const supabaseUrl = "https://jqgnrldsgedwzxcsdojk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ25ybGRzZ2Vkd3p4Y3Nkb2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NTcxMTksImV4cCI6MjA5ODAzMzExOX0.aFMizATCvVF_BhoAmXgkyf6u9qMZx8wC27QL8zk536k";

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase conectado ✅");

// ===============================
// GLOBAL VARIABLES
// ===============================

let categoryChart = null;

// ===============================
// AUTH FUNCTIONS
// ===============================

async function signUp() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const authMessage = document.getElementById("auth-message");

  if (!email || !password) {
    authMessage.textContent = "Please enter email and password.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    console.error("Sign up error:", error);
    authMessage.textContent = error.message;
    return;
  }

  console.log("Sign up data:", data);
  authMessage.textContent = "User created. If email confirmation is enabled, check your inbox.";
}

async function signIn() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const authMessage = document.getElementById("auth-message");

  if (!email || !password) {
    authMessage.textContent = "Please enter email and password.";
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password
  });

  if (error) {
    console.error("Login error:", error);
    authMessage.textContent = error.message;
    return;
  }

  console.log("Login successful:", data);
  authMessage.textContent = "Login successful ✅";

  await checkUser();
}

async function signOut() {
  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error("Logout error:", error);
    return;
  }

  document.getElementById("app-section").style.display = "none";
  document.getElementById("auth-section").style.display = "block";
  document.getElementById("user-email").textContent = "";

  console.log("Logged out ✅");
}

async function checkUser() {
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.error("Get user error:", error);
  }

  const user = data.user;

  if (user) {
    console.log("Current user:", user);

    document.getElementById("auth-section").style.display = "none";
    document.getElementById("app-section").style.display = "block";
    document.getElementById("user-email").textContent = user.email;

    await loadExpenses();
  } else {
    console.log("No active user");

    document.getElementById("auth-section").style.display = "block";
    document.getElementById("app-section").style.display = "none";
  }
}

// ===============================
// EXPENSE FUNCTIONS
// ===============================

async function addExpense() {
  console.log("CLICK FUNCIONA ✅");

  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (!date || !amount || !category) {
    alert("Please complete date, amount and category.");
    return;
  }

  const { data: userData, error: userError } = await supabaseClient.auth.getUser();

  if (userError) {
    console.error("User error:", userError);
    alert("Could not get logged user.");
    return;
  }

  const user = userData.user;

  if (!user) {
    alert("You must be logged in to save expenses.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("expenses")
    .insert([
      {
        user_id: user.id,
        date: date,
        amount: Number(amount),
        category: category,
        description: description
      }
    ])
    .select();

  if (error) {
    console.error("Error insertando gasto:", error);
    alert("Error saving expense. Check console.");
    return;
  }

  console.log("Gasto insertado correctamente:", data);

  document.getElementById("date").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";

  await loadExpenses();
}

async function loadExpenses() {
  const { data, error } = await supabaseClient
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error cargando gastos:", error);
    return;
  }

  console.log("Gastos cargados:", data);

  renderExpenseList(data);
  updateDashboard(data);
  renderCategoryChart(data);
}

function renderExpenseList(expenses) {
  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  if (!expenses || expenses.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No expenses found.";
    list.appendChild(li);
    return;
  }

  expenses.forEach((expense) => {
    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${expense.date}</strong> |
      $${Number(expense.amount).toFixed(2)} |
      ${expense.category}
      ${expense.description ? "- " + expense.description : ""}
    `;

    list.appendChild(li);
  });
}

// ===============================
// DASHBOARD FUNCTIONS
// ===============================

function updateDashboard(expenses) {
  const totalExpensesElement = document.getElementById("total-expenses");
  const expenseCountElement = document.getElementById("expense-count");
  const topCategoryElement = document.getElementById("top-category");

  if (!expenses || expenses.length === 0) {
    totalExpensesElement.textContent = "$0.00";
    expenseCountElement.textContent = "0";
    topCategoryElement.textContent = "-";
    return;
  }

  const total = expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);

  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = Number(expense.amount);

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += amount;
  });

  let topCategory = "-";
  let topAmount = 0;

  Object.keys(categoryTotals).forEach((category) => {
    if (categoryTotals[category] > topAmount) {
      topCategory = category;
      topAmount = categoryTotals[category];
    }
  });

  totalExpensesElement.textContent = `$${total.toFixed(2)}`;
  expenseCountElement.textContent = expenses.length;
  topCategoryElement.textContent = topCategory;
}

function renderCategoryChart(expenses) {
  const ctx = document.getElementById("categoryChart");

  if (!ctx) {
    return;
  }

  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = Number(expense.amount);

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += amount;
  });

  const labels = Object.keys(categoryTotals);
  const values = Object.values(categoryTotals);

  if (categoryChart) {
    categoryChart.destroy();
  }

  categoryChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Expenses by Category",
          data: values,
          backgroundColor: [
            "#2563eb",
            "#16a34a",
            "#dc2626",
            "#f59e0b",
            "#7c3aed",
            "#0891b2",
            "#db2777",
            "#65a30d"
          ],
          hoverOffset: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom"
        }
      }
    }
  });
}

// ===============================
// INITIALIZE APP
// ===============================

checkUser();
