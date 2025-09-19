// 1️⃣ Load locations from Flask
async function loadLocations() {
  try {
    const res = await fetch("http://127.0.0.1:5000/get_location_names");
    if (!res.ok) throw new Error("Server error: " + res.status);

    const data = await res.json();
    console.log("Fetched locations:", data);

    const locationSelect = document.getElementById("location");
    locationSelect.innerHTML = "";

    // Add a default placeholder
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Select location";
    locationSelect.appendChild(placeholder);

    // Add real locations from Flask
    data.location.forEach(loc => {
      const option = document.createElement("option");
      option.value = loc;
      option.textContent = loc;
      locationSelect.appendChild(option);
    });
  } catch (err) {
    console.error("Error loading locations:", err);
  }
}

// 2️⃣ Estimate price using Flask
async function estimatePrice() {
  const location = document.getElementById("location").value;
  const bhk = document.getElementById("bhk").value;
  const bath = document.getElementById("bath").value;   // matches your HTML
  const sqft = document.getElementById("area").value;   // matches your HTML
  const result = document.getElementById("result");

  if (!location || !bhk || !bath || !sqft) {
    result.textContent = "⚠️ Please fill all fields!";
    result.style.color = "red";
    return;
  }

  const formData = new FormData();
  formData.append("location", location);
  formData.append("bhk", bhk);
  formData.append("bath", bath);
  formData.append("total_sqft", sqft);

  try {
    const response = await fetch("http://127.0.0.1:5000/predic_home_price", { // must match your Flask route
      method: "POST",
      body: formData
    });

    if (!response.ok) throw new Error("Server error: " + response.status);

    const data = await response.json();
    result.style.color = "#16a34a";
    result.classList.add("show"); // optional CSS animation
    result.textContent = `Estimated Price: ₹ ${data.estimated_price} Lakhs`;
  } catch (err) {
    console.error("Error fetching price:", err);
    result.style.color = "red";
    result.textContent = "❌ Failed to fetch price. Check console.";
  }
}

// 3️⃣ On page load → fill locations & attach button
window.onload = () => {
  loadLocations();
  document.getElementById("estimate-btn").addEventListener("click", estimatePrice);
};
