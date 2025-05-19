import { DNSQueryLoggerType } from "@/lib/common/schema/dns-query-logger";
import { DNSRecordType, DNSRecordTypeEnum } from "@/lib/common/schema/dns-records";
import { db, DBTableNames } from "@/lib/db";
import { v4 as uuid } from 'uuid';

export const logDnsQueryUseCase = async ({
    hostname,
    recordType,
    resolvedIps,
    chain,
    clientIp,
}: {
    hostname: string;
    recordType?: DNSRecordTypeEnum | null;
    resolvedIps?: string[];
    chain?: string[];
    clientIp?: string | null;
}) => {

    const dnsRecords = await db<DNSQueryLoggerType>(DBTableNames.DNS_QUERY_LOGS)
        .insert({
            id: uuid(),
            hostname,
            record_type: recordType,
            resolved_ips: resolvedIps,
            chain,
            client_ip: clientIp,
        })
        .returning("*");

    return dnsRecords;
};