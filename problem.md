Backend Developer Assessment: Mini DNS API (Realistic DNS Behavior)

Scenario: Mini DNS Service

You will implement a simplified yet realistic mini DNS service API.
Your API must handle DNS records like A records (IPv4 addresses) and CNAME records (aliases). Your service should reflect real-world DNS constraints and behavior accurately.

Submission Requirements:

GitHub: Private repository access shared with developer@speer.io. (Public repo will cause an automatic failure)
README.md with:
Setup instructions.
Clear documentation of endpoints with examples.
Reasoning behind implementation decisions.
Explicit indication/documentation if using AI tools (upload chat history or documentation).

API Core Requirements:

DNS Record Types Supported:
A Record: Hostname to IPv4 addresses (one hostname can have multiple A records).
CNAME Record: Hostname alias to another hostname (only one CNAME per hostname, and no other records can coexist).

Required Endpoints ( details are at the end of the doc )
Add DNS Record ( POST /api/dns )
Resolve Hostname ( GET /api/dns/{hostname} )
List DNS Records for Hostname ( GET /api/dns/{hostname}/records )
Delete DNS Record ( DELETE /api/dns/{hostname}?type=A&value=192.168.1.1 )

Realistic DNS Implementation Constraints:
Multiple A Records are allowed per hostname.
Only one CNAME Record per hostname, and a hostname with a CNAME cannot have other records.
CNAME chaining allowed (but detect and avoid circular references).
Validation:
Prevent conflicting records (CNAME and A on same hostname).
Prevent duplicate records.
Proper validation for hostname/IP formatting.
Appropriate HTTP status codes and detailed errors.
Unit tests covering required logic and edge cases.

Good-to-Have:

Choose at most one:

TTL (Time To Live) with expiration via async cleanup.
Caching for faster resolution.
MX, TXT, or AAAA (IPv6) Records support.
Bulk import/export for DNS records.
Docker containerization.
Simple Authentication and Rate Limiting.

Senior Developer Additional Requirements:

On top of the required endpoints, senior candidates must demonstrate asynchronous processing capability clearly and efficiently in their implementations.

Choose at least one of the following async processing features:

TTL Expiration Management:
Asynchronously handle expiration of DNS records based on TTL.
Background jobs periodically check and remove expired records.

DNS Query Logging:
Implement asynchronous logging of DNS queries for analytics purposes.
Utilize background jobs or queues to handle high volumes of logs without latency impact.

Health Checks and Automatic Failover:
Periodically check the availability of IP addresses and asynchronously update DNS records.
Demonstrate background jobs managing these health checks effectively.

Clearly document your asynchronous approach, including choice of background workers, queues, and scheduling strategies, in your README.md.

Technical Expectations:
Clean, readable, modular architecture.
Accurate error handling and input validation.
Clear endpoint documentation.
Efficient and scalable data structure design.

AI Tool Usage:
AI tools allowed and encouraged to use (e.g., ChatGPT, Cursor).
Clearly document AI use; explicitly upload chat history or mark AI-generated code in README.
If only in-line code completion tools in the editor are used, please clearly indicate in README and you will not need to upload documentation for AI.

Candidates found to have used AI without providing the required documentation will automatically receive a failing grade for the assessment.

Endpoint Details

Add DNS Record
POST /api/dns
Example Inputs:

{ "type": "A", "hostname": "example.com", "value": "192.168.1.1" }

{ "type": "CNAME", "hostname": "alias.example.com", "value": "example.com" }
Example Output:

{ "hostname": "example.com", "type": "A", "value": "192.168.1.1", "createdAt": "timestamp" }

Resolve Hostname
GET /api/dns/{hostname}
Example Output:

{
  "hostname": "alias.example.com",
  "resolvedIps": ["192.168.1.1", "192.168.1.2"],
  "recordType": "CNAME",
  "pointsTo": "example.com"
}
List DNS Records for Hostname
GET /api/dns/{hostname}/records
Example Output:

{
  "hostname": "example.com",
  "records": [
    { "type": "A", "value": "192.168.1.1" },
    { "type": "A", "value": "192.168.1.2" }
  ]
}
Delete DNS Record
DELETE /api/dns/{hostname}?type=A&value=192.168.1.1
Deletes a specific record. Return appropriate success/error messages.

Assessment Criteria:
Criteria & Description
Functional Correctness: DNS API accurately reflects real-world behavior.
Code Quality: Readable, maintainable, modular.
Validation & Error Handling: Comprehensive input validation and meaningful responses.
Testing: Effective unit tests for functionality and edge cases.
Realism & Scalability: Implementation realistically handles DNS constraints.
Documentation & Clarity: Clear, detailed setup instructions and API documentation.
AI Transparency: AI usage clearly documented and explained.

To submit your assessment:

https://docs.google.com/forms/d/e/1FAIpQLSeYU8P-RlgCcl8eI8vttI7AI-8OfywP-YFzkWzML_apXj4bSA/viewform

Good luck!

