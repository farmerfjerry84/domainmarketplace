async function loadListings() {
  const res = await fetch("/api/listings");
  const data = await res.json();
buyNowBtn.onclick = async () => {
  const res = await fetch("/api/payments/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
  const data = await res.json();
  window.location.href = data.url;
};

  const grid = document.getElementById("grid");
  grid.innerHTML = "";

  data.forEach(item => {
    const div = document.createElement("div");
    div.textContent = `${item.domain} — $${item.price}`;
    grid.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", loadListings);
