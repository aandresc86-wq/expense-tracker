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
let categoryBarChart = null;
let allExpenses = [];

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

  // Guardamos todos los gastos en memoria
  allExpenses = data || [];

  // ✅ inicializar filtro con mes actual
  setCurrentMonthFilter();

  // Aplicamos el filtro mensual actual
  applyMonthlyFilter();
}


function setCurrentMonthFilter() {
  const monthInput = document.getElementById("month-filter");

  if (!monthInput) return;

  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");

  const currentMonth = `${year}-${month}`;

  // ✅ solo setea si está vacío
  if (!monthInput.value) {
    monthInput.value = currentMonth;
    console.log("Mes actual seleccionado automáticamente:", currentMonth);
  }
}


function applyMonthlyFilter() {
  const monthFilter = document.getElementById("month-filter");

  let filteredExpenses = allExpenses;

  if (monthFilter && monthFilter.value) {
    const selectedMonth = monthFilter.value;

    filteredExpenses = allExpenses.filter((expense) => {
      if (!expense.date) return false;

      return expense.date.substring(0, 7) === selectedMonth;
    });

    console.log("Filtro aplicado:", selectedMonth);
  } else {
    console.log("Sin filtro mensual");
  }

  renderExpenseList(filteredExpenses);
  updateDashboard(filteredExpenses, monthFilter.value);
  renderCategoryChart(filteredExpenses);

  // ✅ importante: usar el nombre correcto de tu función
  if (typeof renderCategoryBarChart === "function") {
    renderCategoryBarChart(filteredExpenses);
  }

  if (typeof renderHorizontalBarChart === "function") {
    renderHorizontalBarChart(filteredExpenses);
  }
}








function clearMonthlyFilter() {
  const monthFilter = document.getElementById("month-filter");

  if (monthFilter) {
    monthFilter.value = "";
  }

  applyMonthlyFilter();
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
// HELPERS / UTILS
// ===============================

function calculateCategoryTotals(expenses) {
  const categoryTotals = {};

  expenses.forEach((expense) => {
    const category = expense.category;
    const amount = Number(expense.amount);

    if (!categoryTotals[category]) {
      categoryTotals[category] = 0;
    }

    categoryTotals[category] += amount;
  });

  return categoryTotals;
}

function getPreviousMonth(selectedMonth) {
  const [year, month] = selectedMonth.split("-").map(Number);

  const date = new Date(year, month - 2, 1);

  const previousYear = date.getFullYear();
  const previousMonth = String(date.getMonth() + 1).padStart(2, "0");

  return `${previousYear}-${previousMonth}`;
}

function filterExpensesByMonth(expenses, month) {
  return expenses.filter((expense) => {
    if (!expense.date) return false;
    return expense.date.substring(0, 7) === month;
  });
}

function calculateTotal(expenses) {
  return expenses.reduce((sum, expense) => {
    return sum + Number(expense.amount);
  }, 0);
}

function calculatePercentageChange(currentValue, previousValue) {
  if (previousValue === 0 && currentValue === 0) {
    return {
      text: "No change vs previous month",
      className: "neutral"
    };
  }

  if (previousValue === 0 && currentValue > 0) {
    return {
      text: "New spending vs previous month",
      className: "negative"
    };
  }

  const change = ((currentValue - previousValue) / previousValue) * 100;
  const sign = change >= 0 ? "+" : "";

  return {
    text: `${sign}${change.toFixed(1)}% vs previous month`,
    className: change > 0 ? "negative" : change < 0 ? "positive" : "neutral"
  };
}

function getTopCategory(expenses) {
  if (!expenses || expenses.length === 0) {
    return {
      category: "-",
      amount: 0
    };
  }

  const categoryTotals = calculateCategoryTotals(expenses);

  let topCategory = "-";
  let topAmount = 0;

  Object.keys(categoryTotals).forEach((category) => {
    if (categoryTotals[category] > topAmount) {
      topCategory = category;
      topAmount = categoryTotals[category];
    }
  });

  return {
    category: topCategory,
    amount: topAmount
  };
}




// ===============================
// DASHBOARD FUNCTIONS
// ===============================

function updateDashboard(expenses, selectedMonth = null) {
  const totalExpensesElement = document.getElementById("total-expenses");
  const expenseCountElement = document.getElementById("expense-count");
  const topCategoryElement = document.getElementById("top-category");

  const totalComparisonElement = document.getElementById("total-expenses-comparison");
  const countComparisonElement = document.getElementById("expense-count-comparison");
  const topCategoryComparisonElement = document.getElementById("top-category-comparison");

  const currentTotal = calculateTotal(expenses);
  const currentCount = expenses.length;
  const currentTopCategory = getTopCategory(expenses);

  totalExpensesElement.textContent = `$${currentTotal.toFixed(2)}`;
  expenseCountElement.textContent = currentCount;
  topCategoryElement.textContent = currentTopCategory.category;

  if (!selectedMonth) {
    totalComparisonElement.textContent = "vs previous month: -";
    countComparisonElement.textContent = "vs previous month: -";
    topCategoryComparisonElement.textContent = "previous month: -";
    return;
  }

  const previousMonth = getPreviousMonth(selectedMonth);
  const previousMonthExpenses = filterExpensesByMonth(allExpenses, previousMonth);

  const previousTotal = calculateTotal(previousMonthExpenses);
  const previousCount = previousMonthExpenses.length;
  const previousTopCategory = getTopCategory(previousMonthExpenses);

  const totalChange = calculatePercentageChange(currentTotal, previousTotal);
  const countChange = calculatePercentageChange(currentCount, previousCount);

  totalComparisonElement.textContent = `${totalChange.text} | Previous: $${previousTotal.toFixed(2)}`;
  countComparisonElement.textContent = `${countChange.text} | Previous: ${previousCount}`;

  totalComparisonElement.className = totalChange.className;
  countComparisonElement.className = countChange.className;

  if (previousTopCategory.category === "-") {
    topCategoryComparisonElement.textContent = "previous month: no data";
  } else {
    topCategoryComparisonElement.textContent =
      `previous month: ${previousTopCategory.category} ($${previousTopCategory.amount.toFixed(2)})`;
  }
}







function renderCategoryChart(expenses) {
  const ctx = document.getElementById("categoryChart");

  if (!ctx) {
    console.error("categoryChart canvas not found.");
    return;
  }

  if (!expenses || expenses.length === 0) {
    if (categoryChart) {
      categoryChart.destroy();
      categoryChart = null;
    }
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

  const total = values.reduce((sum, value) => sum + value, 0);

  const colors = [
    "#2563eb",
    "#16a34a",
    "#dc2626",
    "#f59e0b",
    "#7c3aed",
    "#0891b2",
    "#db2777",
    "#65a30d",
    "#ea580c",
    "#0f766e",
    "#9333ea",
    "#475569",
    "#84cc16",
    "#e11d48",
    "#0284c7"
  ];

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
          backgroundColor: colors,
          hoverOffset: 4
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            generateLabels: function (chart) {
              const data = chart.data;
              const dataset = data.datasets[0];

              return data.labels.map((label, index) => {
                const value = Number(dataset.data[index]);
                const percentage =
                  total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

                return {
                  text: `${label}: ${percentage}%`,
                  fillStyle: dataset.backgroundColor[index],
                  strokeStyle: dataset.backgroundColor[index],
                  lineWidth: 1,
                  hidden: false,
                  index: index
                };
              });
            }
          }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = Number(context.raw);
              const percentage =
                total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

              return `${label}: $${value.toFixed(2)} (${percentage}%)`;
            }
          }
        },
        datalabels: {
          color: "#ffffff",
          font: {
            weight: "bold",
            size: 12
          },
          formatter: function (value) {
            const percentage =
              total > 0 ? ((value / total) * 100).toFixed(1) : "0.0";

            if (Number(percentage) < 4) {
              return "";
            }

            return `${percentage}%`;
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}


function renderCategoryBarChart(expenses) {
  const ctx = document.getElementById("categoryBarChart");

  if (!ctx) {
    console.error("categoryBarChart canvas not found.");
    return;
  }

  if (!expenses || expenses.length === 0) {
    if (categoryBarChart) {
      categoryBarChart.destroy();
      categoryBarChart = null;
    }
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

  const sortedCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1]);

  const labels = sortedCategories.map((item) => item[0]);
  const values = sortedCategories.map((item) => item[1]);

  if (categoryBarChart) {
    categoryBarChart.destroy();
  }

  categoryBarChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Total Expenses",
          data: values,
          backgroundColor: "#2563eb",
          borderRadius: 6
        }
      ]
    },
    options: {
      indexAxis: "y",
      responsive: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              const value = Number(context.raw);
              return `$${value.toFixed(2)}`;
            }
          }
        },
        datalabels: {
          anchor: "end",
          align: "right",
          color: "#111827",
          font: {
            weight: "bold"
          },
          formatter: function (value) {
            return `$${Number(value).toFixed(2)}`;
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            callback: function (value) {
              return "$" + value;
            }
          }
        },
        y: {
          ticks: {
            autoSkip: false
          }
        }
      }
    },
    plugins: [ChartDataLabels]
  });
}





// ===============================
// INITIALIZE APP
// ===============================

checkUser();
