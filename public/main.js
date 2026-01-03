const goalsList = document.getElementById("goalsList");
const goalTitle = document.getElementById("goalTitle");
const addBtn = document.getElementById("addBtn");
const refreshBtn = document.getElementById("refreshBtn");
const msg = document.getElementById("msg");

// Use my deployed-style route
const API_BASE = "/api/goals";

/* ---------------------------
   Subtle toast notifications
---------------------------- */
const toast = document.createElement("div");
toast.className =
  "fixed top-4 right-4 z-50 hidden max-w-sm rounded-lg border bg-white px-4 py-3 shadow";
document.body.appendChild(toast);

function showToast(text, type = "info") {
  toast.textContent = text;
  toast.classList.remove("hidden");

  // Slight styling by type (no custom colors needed; just border tone)
  toast.classList.remove("border-gray-200", "border-green-200", "border-red-200");
  if (type === "success") toast.classList.add("border-green-200");
  else if (type === "error") toast.classList.add("border-red-200");
  else toast.classList.add("border-gray-200");

  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 1700);
}

function setMsg(text) {
  msg.textContent = text || "";
}

/* ---------------------------
   API helpers
---------------------------- */
async function apiGetGoals() {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to load goals");
  return res.json();
}

async function apiCreateGoal(title) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data;
}

async function apiUpdateGoal(id, title) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
}

async function apiDeleteGoal(id) {
  const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
}

/* ---------------------------
   Render UI
---------------------------- */
function render(goals) {
  goalsList.innerHTML = "";

  goals.forEach((g) => {
    const li = document.createElement("li");
    li.className = "border rounded p-3";

    // View mode container
    const row = document.createElement("div");
    row.className = "flex items-center justify-between gap-3";

    const titleEl = document.createElement("div");
    titleEl.className = "font-medium";
    titleEl.textContent = g.title; // no ID shown

    const btnGroup = document.createElement("div");
    btnGroup.className = "flex gap-2 shrink-0";

    const editBtn = document.createElement("button");
    editBtn.className =
      "border border-blue-500 text-blue-600 px-3 py-1 rounded hover:bg-blue-50";
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.className =
      "border border-red-500 text-red-600 px-3 py-1 rounded hover:bg-red-50";
    deleteBtn.textContent = "Delete";

    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(deleteBtn);
    row.appendChild(titleEl);
    row.appendChild(btnGroup);

    // Edit mode container (hidden by default)
    const editRow = document.createElement("div");
    editRow.className = "hidden mt-3 flex items-center gap-2";

    const input = document.createElement("input");
    input.className = "w-full border rounded px-3 py-2";
    input.value = g.title;

    const saveBtn = document.createElement("button");
    saveBtn.className =
      "bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700";
    saveBtn.textContent = "Save";

    const cancelBtn = document.createElement("button");
    cancelBtn.className = "border px-3 py-2 rounded hover:bg-gray-50";
    cancelBtn.textContent = "Cancel";

    editRow.appendChild(input);
    editRow.appendChild(saveBtn);
    editRow.appendChild(cancelBtn);

    // Handlers
    editBtn.onclick = () => {
      editRow.classList.remove("hidden");
      input.focus();
      input.select();
    };

    cancelBtn.onclick = () => {
      input.value = g.title;
      editRow.classList.add("hidden");
    };

    saveBtn.onclick = async () => {
      const newTitle = input.value.trim();
      if (!newTitle) {
        showToast("Title cannot be empty", "error");
        input.focus();
        return;
      }

      // Disable controls during save
      saveBtn.disabled = true;
      cancelBtn.disabled = true;
      editBtn.disabled = true;
      deleteBtn.disabled = true;

      try {
        await apiUpdateGoal(g.id, newTitle);
        showToast("Updated!", "success");
        await loadGoals();
      } catch (e) {
        showToast(e.message, "error");
      } finally {
        saveBtn.disabled = false;
        cancelBtn.disabled = false;
        editBtn.disabled = false;
        deleteBtn.disabled = false;
      }
    };

    deleteBtn.onclick = async () => {
      const ok = confirm("Delete this goal?");
      if (!ok) return;

      deleteBtn.disabled = true;
      editBtn.disabled = true;

      try {
        await apiDeleteGoal(g.id);
        showToast("Deleted!", "success");
        await loadGoals();
      } catch (e) {
        showToast(e.message, "error");
      } finally {
        deleteBtn.disabled = false;
        editBtn.disabled = false;
      }
    };

    li.appendChild(row);
    li.appendChild(editRow);
    goalsList.appendChild(li);
  });
}

async function loadGoals() {
  setMsg("Loading...");
  try {
    const goals = await apiGetGoals();
    render(goals);
    setMsg("");
  } catch (e) {
    setMsg("Failed to load goals.");
    showToast(e.message, "error");
  }
}

/* ---------------------------
   Button actions
---------------------------- */
addBtn.onclick = async () => {
  const title = goalTitle.value.trim();
  if (!title) {
    showToast("Please enter a title", "error");
    return;
  }

  addBtn.disabled = true;
  refreshBtn.disabled = true;

  try {
    await apiCreateGoal(title);
    goalTitle.value = "";
    showToast("Added!", "success");
    await loadGoals();
  } catch (e) {
    showToast(e.message, "error");
  } finally {
    addBtn.disabled = false;
    refreshBtn.disabled = false;
  }
};

refreshBtn.onclick = async () => {
  showToast("Refreshing...");
  await loadGoals();
};

// initial
loadGoals();
