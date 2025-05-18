import { DNSRecordType, DNSRecordTypeEnum } from "@/lib/common/schema/dns-records";
import { db, DBTableNames } from "@/lib/db";
import { v4 as uuid } from 'uuid';

export const getDnsRecordsUseCase = async (hostname: string) => {
    const dnsRecords = await db<DNSRecordType>(DBTableNames.DNS_RECORDS)
        .select("*")
        .where({ hostname: hostname.toLocaleLowerCase().trim() })
        .orderBy("created_at", "desc");

    return dnsRecords;
};

export const deleteDnsRecordsUseCase = async (
    hostname: string,
    type?: DNSRecordTypeEnum,
    value?: string
) => {
    const dnsRecords = await db<DNSRecordType>(DBTableNames.DNS_RECORDS)
        .delete()
        .where({ hostname: hostname.toLocaleLowerCase().trim(), type, value })

    return dnsRecords;
};

export const addDnsRecordUseCase = async (
    hostname: string,
    type: DNSRecordTypeEnum,
    value: string,
    ttl: number
) => {
    const dnsRecord = await db<DNSRecordType>(DBTableNames.DNS_RECORDS)
        .insert({
            id: uuid(),
            hostname: hostname.toLocaleLowerCase().trim(),
            type,
            value,
            ttl
        })
        .returning("*");

    return dnsRecord?.[0];
};