const fs = require("fs");
const path = require("path");

const LISTINGS_PATH = path.join(__dirname, "data", "listings.json");

// expected schema for a listing
const listingSchema = {
  id: { type: "string", required: true },
  domain: { type: "string", required: true },
  tld: { type: "string", required: true },
  price: { type: "number", required: true },
  type: { type: "string", required: true },      // "buy" | "auction"
  category: { type: "string", required: false },
  desc: { type: "string", required: false },
  traffic: { type: "string", required: false },
  age: { type: "string", required: false }
};

function loadListingsRaw() {
  const raw = fs.readFileSync(LISTINGS_PATH, "utf8");
  return JSON.parse(raw);
}

function saveListings(listings) {
  fs.writeFileSync(LISTINGS_PATH, JSON.stringify(listings, null, 2));
}

// deep scan + rebuild one listing
function healListing(listing) {
  const healed = { ...listing };
  const anomalies = [];

  for (const [key, rule] of Object.entries(listingSchema)) {
    const value = healed[key];

    if (value === undefined || value === null) {
      if (rule.required) {
        anomalies.push(`missing required property: ${key}`);
        // basic defaulting
        if (rule.type === "string") healed[key] = "";
        if (rule.type === "number") healed[key] = 0;
      }
      continue;
    }

    const actualType = typeof value;
    if (actualType !== rule.type) {
      anomalies.push(`type mismatch on ${key}: expected ${rule.type}, got ${actualType}`);
      // attempt to coerce
      if (rule.type === "number") healed[key] = Number(value) || 0;
      if (rule.type === "string") healed[key] = String(value);
    }
  }

  return { healed, anomalies };
}

// self‑healing loader
function loadListingsHealed() {
  const raw = loadListingsRaw();
  const healedList = [];
  let changed = false;
  const report = [];

  for (const item of raw) {
    const { healed, anomalies } = healListing(item);
    if (anomalies.length) {
      changed = true;
      report.push({ id: item.id || "(no id)", anomalies });
    }
    healedList.push(healed);
  }

  if (changed) {
    saveListings(healedList);
    console.log("[reflection] healed listings:", JSON.stringify(report, null, 2));
  }

  return healedList;
}

module.exports = {
  loadListingsHealed
};
