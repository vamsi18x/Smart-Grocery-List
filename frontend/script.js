const API = "http://localhost:5000";

// --- AUTH LOGIC ---
const loginBtn = document.getElementById("login-btn");
if (loginBtn) {
  loginBtn.onclick = async () => {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const res = await fetch(`${API}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const user = await res.json();

      if (res.ok && user._id) {
        localStorage.setItem("user", JSON.stringify(user));
        window.location.href = "dashboard.html"; // REDIRECT
      } else {
        alert(user.message || "Login failed");
      }
    } catch (err) {
      alert("Cannot connect to server");
    }
  };
}

const registerBtn = document.getElementById("register-btn");
if (registerBtn) {
  registerBtn.onclick = async () => {
    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      const res = await fetch(`${API}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });
      if (res.ok) {
        alert("Success! Please login.");
        showLogin();
      }
    } catch (err) { alert("Registration error"); }
  };
}

// --- DASHBOARD PROTECTION & LOADING ---
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isDashboard = window.location.pathname.includes("dashboard.html");

  if (isDashboard) {
    if (!user) {
      window.location.href = "index.html"; // Kicks out unauthenticated users
    } else {
      document.getElementById("username").innerText = user.username;
      document.getElementById("user-avatar").innerText = user.username[0].toUpperCase();
    }
  }
});

async function viewHistory() {
  const user = JSON.parse(localStorage.getItem("user"));
  const content = document.getElementById("content");
  content.innerHTML = "<h3>Loading history...</h3>";

  try {
    const res = await fetch(`${API}/items/${user._id}`);
    const items = await res.json();
    
    let table = `<table class="fancy-table"><thead><tr><th>Item</th><th>Date</th></tr></thead><tbody>`;
    items.forEach(i => {
      table += `<tr><td>${i.name}</td><td>${new Date(i.dateBought).toDateString()}</td></tr>`;
    });
    table += `</tbody></table>`;
    content.innerHTML = items.length ? table : "No items found.";
  } catch (e) { content.innerHTML = "Error loading data."; }
}

async function prepareList(type) {
  const user = JSON.parse(localStorage.getItem("user"));
  const content = document.getElementById("content");
  content.innerHTML = `<h3>Generating ${type}ly list...</h3>`;

  try {
    const res = await fetch(`${API}/predict/${user._id}`);
    const items = await res.json();
    content.innerHTML = `<h3>Predicted for ${type}</h3><ul style="list-style:none; margin-top:20px;">` + 
      items.map(i => `<li style="padding:10px; border-bottom:1px solid #eee;">🛒 ${i}</li>`).join('') + `</ul>`;
  } catch (e) { content.innerHTML = "Error generating list."; }
}

function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}