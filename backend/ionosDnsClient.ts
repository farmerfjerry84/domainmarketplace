import 'dotenv/config';
import fetch from 'node-fetch';

const IONOS_API_KEY = process.env.IONOS_API_KEY!;
const BASE_URL = process.env.IONOS_DNS_BASE_URL || 'https://api.hosting.ionos.com/dns/v1';

if (!IONOS_API_KEY) {
  throw new Error('IONOS_API_KEY is not set');
}

interface Zone {
  id: string;
  name: string;
}

interface DnsRecord {
  id?: string;
  name: string;
  type: 'A' | 'CNAME' | 'TXT';
  content: string;
  ttl: number;
}

async function ionosRequest(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': IONOS_API_KEY,
      ...(options.headers || {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`IONOS API error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function findZoneForDomain(domain: string): Promise<Zone> {
  const zones: Zone[] = await ionosRequest('/zones', { method: 'GET' });

  const zone = zones.find(z => domain === z.name || domain.endsWith(`.${z.name}`));
  if (!zone) {
    throw new Error(`No matching zone found for domain ${domain}`);
  }

  return zone;
}

export async function createDnsRecord(
  zoneId: string,
  record: DnsRecord
): Promise<void> {
  await ionosRequest(`/zones/${zoneId}/records`, {
    method: 'POST',
    body: JSON.stringify([record]),
  });
}

export async function provisionDomainForAzure(domain: string, verificationToken: string) {
  const zone = await findZoneForDomain(domain);

  const rootName = '@';
  const wwwName = 'www';

  const azureIp = process.env.AZURE_APP_IP;
  const azureHostname = process.env.AZURE_APP_HOSTNAME;
  if (!azureHostname) {
    throw new Error('AZURE_APP_HOSTNAME is not set');
  }

  if (azureIp) {
    await createDnsRecord(zone.id, {
      name: rootName,
      type: 'A',
      content: azureIp,
      ttl: 3600,
    });
  }

  await createDnsRecord(zone.id, {
    name: wwwName,
    type: 'CNAME',
    content: azureHostname,
    ttl: 3600,
  });

  await createDnsRecord(zone.id, {
    name: rootName,
    type: 'TXT',
    content: verificationToken,
    ttl: 3600,
  });

  console.log(`Provisioned DNS for ${domain} in zone ${zone.name}`);
}
