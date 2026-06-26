// ✅ Supabase config
const supabaseUrl = "https://jqgnrldsgedwzxcsdojk.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ25ybGRzZ2Vkd3p4Y3Nkb2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NTcxMTksImV4cCI6MjA5ODAzMzExOX0.aFMizATCvVF_BhoAmXgkyf6u9qMZx8wC27QL8zk536k";

console.log("app.js cargado ✅");



const supabaseClient = window.supabase.createClient(supabaseUrl, supabaseKey);

console.log("Supabase conectado ✅");

// ✅ Cargar gastos
async function loadExpenses() {
  const { data, error } = await supabaseClient
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.error("Error cargando:", error);
    return;
  }

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  data.forEach((e) => {
    const li = document.createElement("li");
    li.textContent = `${e.date} - $${e.amount} - ${e.category}`;
    list.appendChild(li);
  });
}

// ✅ Agregar gasto
async function addExpense() {
  console.log("CLICK FUNCIONA ✅");

  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  if (!date || !amount || !category) {
    alert("Completa los campos");
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
    ]);

  if (error) {
    console.error("Error insertando:", error);
    alert("Error al guardar");
    return;
  }

  console.log("Insert OK ✅", data);

  loadExpenses();
}

// ✅ Ejecutar al cargar
loadExpenses();
