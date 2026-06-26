// ✅ Supabase config
const supabaseUrl = "https://jqgnrldsgedwzxcsdojk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ25ybGRzZ2Vkd3p4Y3Nkb2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NTcxMTksImV4cCI6MjA5ODAzMzExOX0.aFMizATCvVF_BhoAmXgkyf6u9qMZx8wC27QL8zk536k";

console.log("app.js cargado correctamente ✅");

const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase conectado ✅");

// ✅ Cargar gastos desde Supabase
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

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  if (!data || data.length === 0) {
    const li = document.createElement("li");
    li.textContent = "No expenses found.";
    list.appendChild(li);
    return;
  }

  data.forEach((expense) => {
    const li = document.createElement("li");
    li.textContent = `${expense.date} - $${expense.amount} - ${expense.category} - ${expense.description || ""}`;
    list.appendChild(li);
  });
}

// ✅ Agregar gasto a Supabase
async function addExpense() {
  console.log("CLICK FUNCIONA ✅");

  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  console.log("Datos capturados:", {
    date,
    amount,
    category,
    description
  });

  if (!date || !amount || !category) {
    alert("Please complete date, amount and category.");
    return;
  }

  const { data, error } = await supabaseClient
    .from("expenses")
    .insert([
      {
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
  alert("Expense saved successfully ✅");

  document.getElementById("date").value = "";
  document.getElementById("amount").value = "";
  document.getElementById("category").value = "";
  document.getElementById("description").value = "";

  loadExpenses();
}

// ✅ Ejecutar al cargar la página
loadExpenses();
