// 1️⃣ Populate location dropdown from Flask
fetch('http://127.0.0.1:5000/get_location_names')
    .then(res => res.json())
    .then(data => {
        const locationSelect = document.getElementById('location');
        // Flask returns key 'location'
        data.location.forEach(loc => {
            const option = document.createElement('option');
            option.value = loc;
            option.textContent = loc;
            locationSelect.appendChild(option);
        });
    })
    .catch(err => console.error("Error loading locations:", err));

// 2️⃣ Function to predict price
async function predictPrice(location, bhk, bath, area) {
    const formData = new FormData();
    formData.append('location', location);
    formData.append('bhk', bhk);
    formData.append('bath', bath);
    formData.append('total_sqft', area);

    const response = await fetch('http://127.0.0.1:5000/predic_home_price', {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    return Math.round(data.estimated_price);
}

// 3️⃣ Attach to button click
document.getElementById('estimate-btn').addEventListener('click', async () => {
    const location = document.getElementById('location').value;
    const bhk = Number(document.getElementById('bhk').value);   // Convert to number
    const bath = Number(document.getElementById('bath').value); // Convert to number
    const area = Number(document.getElementById('area').value); // Convert to number

    if (!location || !bhk || !bath || !area) {
        alert("Please fill in all fields");
        return;
    }

    try {
        const price = await predictPrice(location, bhk, bath, area);
        console.log("Predicted Price:", price); // Debug
        document.getElementById('result').textContent = `Estimated Price: ₹${price}`;
    } catch (err) {
        console.error("Error fetching estimated price:", err);
        alert("Failed to get price. Check console for details.");
    }
});
