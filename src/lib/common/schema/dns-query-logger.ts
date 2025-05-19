import { DNSRecordTypeEnum } from "./dns-records"

export interface DNSQueryLoggerType {
    id: string
    hostname: string
    record_type: DNSRecordTypeEnum | null
    resolved_ips: string[]
    chain: string[]
    client_ip: string | null
    created_at: Date
}