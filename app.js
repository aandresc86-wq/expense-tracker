https://cdn.jsdelivr.net/npm/@supabase/supabase-jsscript>

const supabase = supabase.createClient(
  "https://TU_PROYECTO.supabase.co",
  "TU_ANON_KEY"
);

async function addExpense() {
  const date = document.getElementById("date").value;
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;

  const user = (await supabase.auth.getUser()).data.user;

  await supabase.from("expenses").insert([
    { date, amount, category, description, user_id: user.id }
  ]);

  loadExpenses();
}

async function loadExpenses() {
  const { data } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  const list = document.getElementById("expense-list");
  list.innerHTML = "";

  data.forEach(e => {
    const li = document.createElement("li");
    li.textContent = `${e.date} - $${e.amount} - ${e.category}`;
    list.appendChild(li);
  });
}

await supabase.auth.signInWithPassword({
  email: "user@mail.com",
  password: "123456"
});
