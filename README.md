# Mini DNS API – Backend Developer Assessment

A production-ready Mini DNS API service that mimics realistic DNS behavior using TypeScript, Next.js, and PostgreSQL.

It supports key DNS record types, enforces real-world constraints (like CNAME vs A rules), and includes a senior-level asynchronous logging mechanism.

---

## Live Demo

> Base URL: [https://mini-dns.piyushpriyadarshi.dev](https://mini-dns.piyushpriyadarshi.dev)

---

##  Postman API Collection

Explore all endpoints with request/response examples here:  
[Mini DNS Postman Collection](https://red-firefly-292308.postman.co/workspace/AdmitSpot~a0955b4b-6b28-480d-ae10-bb16aa124702/collection/24728942-d39db7de-3e4c-4cb4-bb13-747bdeb9232c?action=share&creator=24728942)

---

## Features

- Add DNS Records (`A`, `CNAME`, `MX`, `TXT`)
- Resolve Hostnames with:
  - Multi-level CNAME chaining
  - Circular reference detection
- Get all records for a hostname
- Delete a specific record
- Enforced real-world DNS constraints:
  - Only one `CNAME` per hostname
  - No mixing of `CNAME` with other record types
  - Multiple `A` records allowed

---

##  Tech Stack

- **Backend**: Next.js (API Routes)
- **Language**: TypeScript
- **Database**: PostgreSQL (via Knex.js)
- **Validation**: Yup
- **Rate Limiting**: rate-limiter-flexible
- **Async Logging**: via `void`
- **UUIDs**: v4 standard
- **Deployment**: Netlify + PostgreSQL (RDS)

---

##  Setup & Running Locally

```bash
git clone https://github.com/your-username/mini-dns-api.git
cd mini-dns-api

# Install dependencies
npm install

# Create .env.local
cp .env.sample .env
# Fill in your PostgreSQL DATABASE_URL and API_KEY

# Run DB migrations
npm run migrate

# Start the server
npm run dev

```


---

##  Authentication & Rate Limiting
All routes are protected with:

- x-api-key header (check .env.sample)
- Rate-limited: max 30 requests per minute per key


---

##  Authentication & Rate Limiting
DNS Query Logging

An async background task logs:

- Hostname
- Record type
- Resolved IPs
- CNAME chain
- Client IP
- Timestamp

This is handled via `void` function call to prevent blocking response flow.

Logs are stored in the dns_query_logs table and can be extended for analytics. 


---

##  AI Usage Declaration
AI tools were used in limited, assistive capacity during early planning and code refinement.

A summary of the questions asked can be found in the `ai-usage.docx` file. All code was reviewed, written, and refactored manually to meet the requirements.


---

##  Code Base Attribution
Some foundational components in this project — including API handler structure (nextEndpointHelper.ts), service/use case pattern, interface typing, and global DB error handling — were reused from my own internal base project.

That base was originally built nearly 3 years ago and has evolved over time to serve as a boilerplate for backend-heavy projects. All code reused from it was written and maintained by me.

This allowed me to move faster, maintain consistency, and focus more on domain-specific logic rather than boilerplate setup.

