const express = require("express");
const router = express.Router();
const ionos = require("../services/registrar/ionos");

// List domains
router.get("/list", async (req, res) => {
  try {
    const data = await ionos.listDomains();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "IONOS list failed" });
  }
});

// Domain details
router.get("/domain", async (req, res) => {
  try {
    const domain = req.query.domain;
    const data = await ionos.getDomain(domain);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "IONOS domain lookup failed" });
  }
});

// DNS records
router.get("/dns", async (req, res) => {
  try {
    const domain = req.query.domain;
    const data = await ionos.getDNS(domain);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "IONOS DNS lookup failed" });
  }
});

// Update DNS
router.post("/dns", async (req, res) => {
  try {
    const { domain, records } = req.body;
    const data = await ionos.updateDNS(domain, records);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "IONOS DNS update failed" });
  }
});

module.exports = router;
