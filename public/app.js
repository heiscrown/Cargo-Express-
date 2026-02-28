/* =====================================================
   LOGISTICS SYSTEM FRONTEND SCRIPT
   Clean & Fully Operational
===================================================== */

const API = "/api";

/* ================= TOKEN HELPERS ================= */

function getToken() {
  return localStorage.getItem("token");
}

function setToken(token) {
  localStorage.setItem("token", token);
}

function clearToken() {
  localStorage.removeItem("token");
}

/* ================= LOGIN ================= */

async function login() {
  const username = document.getElementById("username")?.value.trim();
  const password = document.getElementById("password")?.value.trim();
  const message = document.getElementById("message");

  if (!username || !password) {
    if (message) message.innerText = "Please enter username and password";
    return;
  }

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success && data.token) {
      setToken(data.token);
      window.location.href = "dashboard.html";
    } else {
      if (message) message.innerText = data.message || "Login failed";
    }
  } catch (err) {
    console.error(err);
    if (message) message.innerText = "Server error";
  }
}

/* ================= LOGOUT ================= */

function logout() {
  clearToken();
  window.location.href = "login.html";
}

/* ================= LOAD SHIPMENTS ================= */

async function loadShipments() {
  const container = document.getElementById("shipments");
  if (!container) return;

  try {
    const res = await fetch(`${API}/shipments`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    });

    const data = await res.json();

    if (!data.success) {
      container.innerHTML = "<p>Failed to load shipments</p>";
      return;
    }

    if (data.shipments.length === 0) {
      container.innerHTML = "<p>No shipments found.</p>";
      return;
    }

    container.innerHTML = data.shipments.map(s => `
      <div class="shipment-card">
        <strong>${s.tracking_number}</strong><br>
        ${s.sender_name} → ${s.receiver_name}<br>
        <b>Status:</b> ${s.current_status}
      </div>
    `).join("");

  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading shipments</p>";
  }
}

/* ================= CREATE SHIPMENT ================= */

async function createShipment() {
  const sender = document.getElementById("sender")?.value.trim();
  const receiver = document.getElementById("receiver")?.value.trim();
  const origin = document.getElementById("origin")?.value.trim();
  const destination = document.getElementById("destination")?.value.trim();

  if (!sender || !receiver || !origin || !destination) {
    alert("Please fill all fields");
    return;
  }

  try {
    const res = await fetch(`${API}/shipments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        sender_name: sender,
        receiver_name: receiver,
        origin_country: origin,
        destination_country: destination
      })
    });

    const data = await res.json();

    if (data.success) {
      alert("Shipment created successfully");
      loadShipments();
    } else {
      alert(data.message || "Failed to create shipment");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

/* ================= TRACK SHIPMENT ================= */

async function trackShipment() {
  const number = document.getElementById("tracking")?.value.trim();
  const result = document.getElementById("result");

  if (!number) {
    alert("Enter tracking number");
    return;
  }

  try {
    const res = await fetch(`${API}/shipments/track/${number}`);
    const data = await res.json();

    if (!data.success) {
      result.innerHTML = "<p>Shipment not found.</p>";
      return;
    }

    result.innerHTML = `
      <h3>Status: ${data.shipment.current_status}</h3>
      <p><b>From:</b> ${data.shipment.origin_country}</p>
      <p><b>To:</b> ${data.shipment.destination_country}</p>
      <p><b>Sender:</b> ${data.shipment.sender_name}</p>
      <p><b>Receiver:</b> ${data.shipment.receiver_name}</p>
    `;

  } catch (err) {
    console.error(err);
    result.innerHTML = "<p>Server error</p>";
  }
}

/* ================= AUTO INIT ================= */

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("dashboard")) {
    loadShipments();
  }
});

/* ================= EXPORT TO GLOBAL ================= */

window.login = login;
window.logout = logout;
window.createShipment = createShipment;
window.trackShipment = trackShipment;


