const fetch = require("node-fetch");

const API_BASE = "https://api.hosting.ionos.com/domains";

function headers() {
  return {
    "Content-Type": "application/json",
    "X-Api-Key": process.env.IONOS_API_KEY,
    "X-Tenant-Id": process.env.IONOS_TENANT_ID
  };
}

// REAL: List all domains
async function listDomains() {
  const res = await fetch(`${API_BASE}`, {
    method: "GET",
    headers: headers()
  });
  return await res.json();
}

// REAL: Get domain details
async function getDomain(domain) {
  const res = await fetch(`${API_BASE}/${domain}`, {
    method: "GET",
    headers: headers()
  });
  return await res.json();
}

// REAL: Get DNS records
async function getDNS(domain) {
  const res = await fetch(`${API_BASE}/${domain}/dns-records`, {
    method: "GET",
    headers: headers()
  });
  return await res.json();
}

// REAL: Update DNS records
async function updateDNS(domain, records) {
  const res = await fetch(`${API_BASE}/${domain}/dns-records`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ records })
  });
  return await res.json();
}

module.exports = {
  listDomains,
  getDomain,
  getDNS,
  updateDNS
};
