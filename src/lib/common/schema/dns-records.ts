export interface DNSRecordType {
    id: string
    hostname: string
    type: DNSRecordTypeEnum
    value: string
    ttl: number
    created_at: Date
}

export enum DNSRecordTypeEnum {
    A = 'A',
    CNAME = 'CNAME',
    MX = 'MX',
    TXT = 'TXT',
}

export interface addDnsRecordApi {
    request: {
        body: {
            hostname: string
            type: DNSRecordTypeEnum
            value: string
            ttl: number
        };
    };
    response: { success: true, data: DNSRecordType } | { message: string };
}


export interface resolveDnsRecordApi {
    request: {
        query: Partial<{
            hostname: string;
        }>;
        body: {}
    };
    response: {
        hostname: string,
        resolvedIps: string[],
        recordType: DNSRecordTypeEnum | null,
        pointsTo: string | null
    } | { message: string };
}

export interface getDnsRecordsApi {
    request: {
        query: Partial<{
            hostname: string;
        }>;
        body: {}
    };
    response: {
        hostname: string,
        records: Partial<DNSRecordType>[]
    } | { message: string };
}

export interface deleteDnsRecordsApi {
    request: {
        query: Partial<{
            hostname: string;
            type: DNSRecordTypeEnum;
            value: string;

        }>;
        body: {}
    };
    response: { success: boolean, message: string } | { message: string };
}