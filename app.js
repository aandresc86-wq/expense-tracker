const supabaseUrl = "https://jqgnrldsgedwzxcsdojk.supabase.co/rest/v1/";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZ25ybGRzZ2Vkd3p4Y3Nkb2prIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0NTcxMTksImV4cCI6MjA5ODAzMzExOX0.aFMizATCvVF_BhoAmXgkyf6u9qMZx8wC27QL8zk536k";

//const supabase = supabase.createClient(supabaseUrl, supabaseKey);

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// ✅ IMPORTANTE: la función debe existir
async function addExpense() {
  console.log("CLICK FUNCIONA ✅");
}




//  Cargar gastos
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

//  Agregar gasto
async function addExpense() {
  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const user = (await supabase.auth.getUser()).data.user;
  
  console.log("USER:", user);

  const { data, error } = await supabase.from("expenses").insert([
    {
      date,
      amount,
      category,
      description,
      user_id: user ? user.id : null
    }
  ]);

  console.log("DATA:", data);
  console.log("ERROR:", error);
}



  

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

//  Ejecutar al cargar
loadExpenses();

console.log("Supabase conectado");
