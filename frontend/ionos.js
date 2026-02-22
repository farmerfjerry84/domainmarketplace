document.getElementById("loadDomains").addEventListener("click", async () => {
  const res = await fetch("/api/registrar/list");
  const data = await res.json();
  document.getElementById("domainOutput").textContent =
    JSON.stringify(data, null, 2);
});
