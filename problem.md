Mini DNS API (Realistic DNS Behavior)

Scenario: Mini DNS Service

You will implement a simplified yet realistic mini DNS service API.
Your API must handle DNS records like A records (IPv4 addresses) and CNAME records (aliases). Your service should reflect real-world DNS constraints and behavior accurately.

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
Simple Authentication and Rate Limiting.
DNS Query Logging: Implement asynchronous logging of DNS queries for analytics purposes.
Utilize background jobs or queues to handle high volumes of logs without latency impact.

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
