const supabaseUrl = "https://TU_PROJECT_ID.supabase.co";
const supabaseKey = "TU_ANON_KEY";

const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// ✅ Cargar gastos
async function loadExpenses() {
  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  if (data) {
    data.forEach(e => {
      const li = document.createElement("li");
      li.textContent = `${e.date} - $${e.amount} - ${e.category}`;
      list.appendChild(li);
    });
  }
}

// ✅ Agregar gasto
async function addExpense() {
  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const user = (await supabase.auth.getUser()).data.user;

  if (!user) {
    alert("You must be logged in");
    return;
  }

  await supabase.from("expenses").insert([
    {
      date,
      amount,
      category,
      description,
      user_id: user.id
    }
  ]);

  loadExpenses();
}

// ✅ Ejecutar al cargar
loadExpenses();
